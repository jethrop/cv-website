"""Specification tests for the copy-friendly contact section.

Purpose and scope:
- Ensure the CV includes a dedicated contact section with copy-friendly fields.

Inputs and outputs:
- Inputs: index.html and style.css.
- Output: tests validate expected HTML structure and CSS rules.

Success criteria / acceptance tests:
- A section with id="contacts" exists and includes a contact grid.
- Each contact method renders a readonly input paired with a copy button.
- Contact grid uses CSS grid and the copy button uses a pointer cursor.

Edge cases and error-handling:
- Missing IDs or non-readonly inputs should fail fast.
"""

from __future__ import annotations

import pathlib
import re
import unittest
from html.parser import HTMLParser

ROOT_DIR = pathlib.Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT_DIR / "index.html"
STYLE_PATH = ROOT_DIR / "style.css"


class ContactSectionParser(HTMLParser):
    """Parse the contact section to capture inputs and copy buttons."""

    def __init__(self) -> None:
        super().__init__()
        self._in_contacts_section = False
        self._contacts_section_depth = 0
        self.has_contact_grid = False
        self.copy_buttons: list[str] = []
        self.readonly_inputs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = dict(attrs)
        classes = set((attrs_dict.get("class") or "").split())

        if tag == "section" and attrs_dict.get("id") == "contacts":
            self._in_contacts_section = True
            self._contacts_section_depth = 1
            return

        if self._in_contacts_section and tag == "section":
            self._contacts_section_depth += 1

        if not self._in_contacts_section:
            return

        if tag == "div" and "contact-grid" in classes:
            self.has_contact_grid = True

        if tag == "input" and "readonly" in attrs_dict:
            input_id = attrs_dict.get("id")
            if input_id:
                self.readonly_inputs.append(input_id)

        if tag == "button" and attrs_dict.get("data-copy-target"):
            self.copy_buttons.append(attrs_dict["data-copy-target"])

    def handle_endtag(self, tag: str) -> None:
        if not self._in_contacts_section:
            return

        if tag == "section":
            self._contacts_section_depth -= 1
            if self._contacts_section_depth <= 0:
                self._in_contacts_section = False
                self._contacts_section_depth = 0


class TestContactSection(unittest.TestCase):
    """Validate the contact section markup and styling requirements."""

    def test_contact_section_structure(self) -> None:
        """Contact section includes a grid plus inputs and copy buttons."""
        content = INDEX_PATH.read_text(encoding="utf-8")
        parser = ContactSectionParser()
        parser.feed(content)

        self.assertTrue(parser.has_contact_grid, "Expected a contact grid container.")
        self.assertGreaterEqual(len(parser.readonly_inputs), 2)
        self.assertEqual(
            sorted(parser.readonly_inputs),
            sorted(parser.copy_buttons),
            "Each copy button should target a readonly input.",
        )

    def test_contact_styles(self) -> None:
        """Contact styles use grid layout and pointer cursor for copy buttons."""
        css = STYLE_PATH.read_text(encoding="utf-8")
        grid_block = re.search(r"\.contact-grid\s*\{[^}]*\}", css, re.DOTALL)
        self.assertIsNotNone(grid_block)
        self.assertRegex(grid_block.group(0), r"display\s*:\s*grid")

        button_block = re.search(r"\.copy-btn\s*\{[^}]*\}", css, re.DOTALL)
        self.assertIsNotNone(button_block)
        self.assertRegex(button_block.group(0), r"cursor\s*:\s*pointer")


if __name__ == "__main__":
    unittest.main()
