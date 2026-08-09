#!/usr/bin/env python3
"""Audit the static site for accidental contact details and placeholders."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXT_SUFFIXES = {".html", ".js", ".css", ".md", ".txt"}
PLACEHOLDERS = (
    "YOUR NAME",
    "YOUR-NAME.EXAMPLE",
    "you@example.com",
    "YOUR ROLE",
    "YOUR LOCATION",
    "Replace this",
    "Replace with",
)
ALLOWED_EMAILS = {"you@example.com"}
EMAIL_RE = re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b")


def source_files() -> list[Path]:
    return sorted(
        path
        for path in ROOT.rglob("*")
        if path.is_file()
        and path.suffix.lower() in TEXT_SUFFIXES
        and ".git" not in path.parts
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--deployment-ready",
        action="store_true",
        help="fail when template placeholders remain",
    )
    args = parser.parse_args()

    failures: list[str] = []
    placeholder_hits: list[str] = []

    for path in source_files():
        relative = path.relative_to(ROOT)
        text = path.read_text(encoding="utf-8")

        for email in sorted(set(EMAIL_RE.findall(text)) - ALLOWED_EMAILS):
            failures.append(f"{relative}: unexpected email address: {email}")

        if relative.parts and relative.parts[0] == "assets":
            for email in ALLOWED_EMAILS:
                if email in text:
                    failures.append(
                        f"{relative}: editable contact data belongs in site.config.js"
                    )

        for placeholder in PLACEHOLDERS:
            if placeholder.lower() in text.lower():
                placeholder_hits.append(f"{relative}: {placeholder}")

    if args.deployment_ready and placeholder_hits:
        failures.extend(f"placeholder remains: {hit}" for hit in placeholder_hits)

    if failures:
        print("Content audit failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    mode = "deployment" if args.deployment_ready else "template"
    print(f"Content audit passed ({mode} mode).")
    if placeholder_hits and not args.deployment_ready:
        print(f"Template placeholders intentionally remain: {len(placeholder_hits)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
