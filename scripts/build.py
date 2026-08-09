#!/usr/bin/env python3
"""Build a self-contained, directly shareable HTML file."""

from __future__ import annotations

import base64
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist" / "index.html"


class LocalReferenceFinder(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        for attribute in ("src", "href"):
            value = values.get(attribute) or ""
            if value and not value.startswith(
                ("http:", "https:", "mailto:", "#", "data:")
            ):
                self.references.append(f"{tag}[{attribute}={value!r}]")


def main() -> int:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "assets" / "styles.css").read_text(encoding="utf-8")
    config = (ROOT / "site.config.js").read_text(encoding="utf-8")
    app = (ROOT / "assets" / "app.js").read_text(encoding="utf-8")
    favicon = base64.b64encode(
        (ROOT / "assets" / "favicon.svg").read_bytes()
    ).decode("ascii")

    replacements = {
        '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">': (
            '<link rel="icon" href="data:image/svg+xml;base64,' + favicon + '" '
            'type="image/svg+xml">'
        ),
        '<link rel="stylesheet" href="assets/styles.css">': f"<style>\n{css}</style>",
        '<script src="site.config.js"></script>': f"<script>\n{config}</script>",
        '<script src="assets/app.js"></script>': f"<script>\n{app}</script>",
    }

    for source, bundled in replacements.items():
        if source not in html:
            raise SystemExit(f"Expected source tag missing: {source}")
        html = html.replace(source, bundled, 1)

    finder = LocalReferenceFinder()
    finder.feed(html)
    if finder.references:
        raise SystemExit(
            "Standalone build still has local dependencies: "
            + ", ".join(finder.references)
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Built {OUTPUT} ({OUTPUT.stat().st_size} bytes)")
    print("Standalone dependency check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
