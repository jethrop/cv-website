# Social links layout spec

## Purpose and scope
Ensure the hero social links display correctly by rendering the email, LinkedIn, and GitHub/portfolio icons with their labels placed beneath each icon in the hero section.

## Inputs and outputs
- **Inputs:**
  - `index.html` hero markup for `.social-links`.
  - `style.css` styling for `.social-links` elements.
- **Outputs:**
  - Updated HTML/CSS so each social link shows an icon with its label directly below.

## Success criteria and acceptance tests
- Each social link inside `.social-links` contains an icon element followed by a label element in the markup.
- The CSS for `.social-links a` uses a vertical layout (`flex-direction: column`).
- The label is visually placed below the icon (e.g., by using block-level layout for the label).

## Edge cases and error-handling rules
- If additional social links are added later, the structure and layout rules should still place labels below icons without further changes.
