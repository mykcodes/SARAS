"""
Text cleaner — normalize raw OCR/PDF output before chunking.

Handles:
  - Collapse excessive whitespace
  - Remove common header/footer noise (page numbers, repeated titles)
  - Strip null bytes and control characters
"""

import re


def clean(text: str) -> str:
    """Apply all cleaning steps and return the normalized text."""
    text = _remove_control_chars(text)
    text = _normalize_whitespace(text)
    text = _remove_page_number_lines(text)
    return text.strip()


def _remove_control_chars(text: str) -> str:
    """Remove null bytes and other non-printable control chars (keep newlines/tabs)."""
    return re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)


def _normalize_whitespace(text: str) -> str:
    """
    - Collapse 3+ consecutive blank lines into 2
    - Strip trailing whitespace from every line
    """
    # strip trailing spaces per line
    text = "\n".join(line.rstrip() for line in text.splitlines())
    # collapse 3+ blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def _remove_page_number_lines(text: str) -> str:
    """
    Remove lines that are *only* a page number, e.g.:
      "1", "- 2 -", "Page 3", "3 of 10", etc.
    """
    pattern = re.compile(
        r"^\s*"
        r"(Page\s+\d+(\s+of\s+\d+)?|"
        r"[-–—]\s*\d+\s*[-–—]|"
        r"\d+\s*(of|/)\s*\d+|"
        r"\d+)"
        r"\s*$",
        re.IGNORECASE | re.MULTILINE,
    )
    return pattern.sub("", text)
