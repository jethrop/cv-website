# cv-website

## Overview

Static, single-page CV website for Jethro Pesquera. It renders a branded hero, skills, education, and projects sections from HTML/CSS, and builds the experience timeline dynamically from `resume.json`.

## Features

- Responsive single-page CV layout with themed sections and hero background
- Dynamic experience timeline rendered from `resume.json`
- Typing headline effect and scroll animations (AOS)

## Architecture

- `index.html`: Page structure, content sections, and external CDN includes.
- `style.css`: Theme variables and layout styling.
- `script.js`: Typing animation and timeline rendering from `resume.json`.
- `resume.json`: Data source for work history and other resume content.
- Flow: Browser loads `index.html` → CSS styles the layout → `script.js` runs on DOM load → `resume.json` is fetched and used to build the timeline.

## Requirements

- Any modern web browser
- Optional: local static file server to avoid `fetch` restrictions with `file://`

## Installation

1) Clone or download this repository.
2) Keep all files in the same directory to preserve relative asset paths.

## Configuration

- `resume.json`: Update work history, skills, education, and profile data.
- `wrangler.jsonc`: Cloudflare Wrangler assets configuration (if deploying via Wrangler).

## Usage

```text
# Option A: open directly (timeline may not load due to file:// fetch restrictions)
open index.html

# Option B: serve locally so resume.json can be fetched
python -m http.server 8080
# then visit http://localhost:8080
```

## Environment-Specific Setup

Cloudflare Wrangler config is present in `wrangler.jsonc` with assets served from the project root. No deployment scripts are defined in the repo.

## Testing

Not applicable.

## Troubleshooting

- Timeline shows an error about `resume.json`: Serve the folder with a local server instead of opening `index.html` via `file://`.
- Animations not playing: Verify the AOS CDN is reachable and not blocked by the browser.

## Security Note
Yes, I know this is not a super well secured site.  Basically just a bunch of open files.  But all of this is public data that's also on my linkedIn.  There's no backend, it's all just static frontend files.

## License

All rights reserved.
