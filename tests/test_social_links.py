"""Tests for hero social link layout and structure."""

from __future__ import annotations

import pathlib
import re
import unittest
from html.parser import HTMLParser

ROOT_DIR = pathlib.Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT_DIR / "index.html"
STYLE_PATH = ROOT_DIR / "style.css"


class SocialLinksParser(HTMLParser):
    """Capture social link children to validate icon/label order."""

    def __init__(self) -> None:
        super().__init__()
        self._in_social_links = False
        self._social_links_div_depth = 0
        self._current_anchor_spans: list[str] = []
        self.anchor_spans: list[list[str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = dict(attrs)
        classes = set((attrs_dict.get("class") or "").split())

        if tag == "div" and "social-links" in classes:
            self._in_social_links = True
            self._social_links_div_depth = 1
            return

        if self._in_social_links and tag == "div":
            self._social_links_div_depth += 1

        if not self._in_social_links:
            return

        if tag == "a":
            self._current_anchor_spans = []
            return

        if tag == "span" and "class" in attrs_dict:
            span_class = attrs_dict.get("class") or ""
            if "social-icon" in span_class:
                self._current_anchor_spans.append("social-icon")
            if "social-label" in span_class:
                self._current_anchor_spans.append("social-label")

    def handle_endtag(self, tag: str) -> None:
        if not self._in_social_links:
            return

        if tag == "a" and self._current_anchor_spans:
            self.anchor_spans.append(self._current_anchor_spans)
            self._current_anchor_spans = []
            return

        if tag == "div":
            self._social_links_div_depth -= 1
            if self._social_links_div_depth <= 0:
                self._in_social_links = False
                self._social_links_div_depth = 0


class TestSocialLinks(unittest.TestCase):
    """Validate social link icon/label structure and layout rules."""

    def test_social_links_icon_and_label_order(self) -> None:
        """Each social link should list icon before label to stack correctly."""
        content = INDEX_PATH.read_text(encoding="utf-8")
        parser = SocialLinksParser()
        parser.feed(content)

        self.assertGreaterEqual(len(parser.anchor_spans), 3)
        for spans in parser.anchor_spans:
            self.assertIn("social-icon", spans)
            self.assertIn("social-label", spans)
            self.assertLess(
                spans.index("social-icon"),
                spans.index("social-label"),
                "Icon should appear before label in each link.",
            )

    def test_social_links_css_uses_column_layout(self) -> None:
        """Social links should stack icon over label using column flex layout."""
        css = STYLE_PATH.read_text(encoding="utf-8")
        link_block = re.search(
            r"\.social-links\s+a\s*\{[^}]*\}", css, re.DOTALL
        )
        self.assertIsNotNone(link_block)
        self.assertRegex(link_block.group(0), r"flex-direction\s*:\s*column")

    def test_social_label_is_block_level(self) -> None:
        """Labels should be block-level so they render below icons."""
        css = STYLE_PATH.read_text(encoding="utf-8")
        label_block = re.search(
            r"\.social-links\s+\.social-label\s*\{[^}]*\}",
            css,
            re.DOTALL,
        )
        self.assertIsNotNone(label_block)
        self.assertRegex(label_block.group(0), r"display\s*:\s*block")


if __name__ == "__main__":
    unittest.main()
