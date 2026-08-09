# Dial-up Portfolio

A static portfolio landing page that opens as a 1990s dial-up/BBS terminal and provides an escape hatch to a restrained modern portfolio.

The repository ships with **generic placeholders only**. Personal details are intentionally absent.

## Personalise the site

Edit **only [`site.config.js`](site.config.js)** for normal content changes. It contains:

- name, domain, email, role, and location
- node/BBS identity
- hero copy
- three featured projects
- about paragraphs
- contact note
- terminal biography, projects, profile, and manifesto

Keep the object shape and property names unchanged. The values can be edited directly.

### Important placeholders

Before deployment, replace at least:

- `YOUR NAME`
- `YOUR-NAME.EXAMPLE`
- `you@example.com`
- `YOUR ROLE`
- `YOUR LOCATION`
- all `Replace...` project and biography text

Run the content audit afterward:

```bash
python3 scripts/audit-content.py
```

Use `--deployment-ready` when you want the audit to reject any remaining placeholders:

```bash
python3 scripts/audit-content.py --deployment-ready
```

## Run locally

No build step or package installation is required.

```bash
python3 -m http.server 8000
```

Then open <http://127.0.0.1:8000>.

## Build a single shareable HTML file

The source `index.html` depends on `site.config.js` and the `assets/` directory. To create one file that can be downloaded and opened directly, run:

```bash
python3 scripts/build.py
```

Then open or share:

```text
dist/index.html
```

That generated file contains the CSS, configuration, JavaScript, and favicon inline.

## Structure

```text
.
├── index.html             semantic page structure and fallback placeholders
├── site.config.js         all editable identity and portfolio content
├── assets/
│   ├── app.js             terminal, BBS interactions, and mode switching
│   └── styles.css         CRT and modern-site presentation
└── scripts/
    └── audit-content.py   privacy/placeholder audit
```

## Modem audio status

The existing Web Audio handshake is a **stylised placeholder**, not an accurate modem reconstruction. It is disabled by default with:

```js
features: {
  modemAudio: false
}
```

Leave it disabled until it is replaced with a verified recording or a more faithful reconstruction. The terminal sequence itself still runs silently and can be skipped.

## Privacy

The page does not fetch or expose a visitor's public IP. The displayed remote signature is generated locally and is fictional.

Google Fonts are currently loaded from Google. Self-host them before deployment if you want the page to make no third-party requests.

## Licence

MIT — see [`LICENSE`](LICENSE).
