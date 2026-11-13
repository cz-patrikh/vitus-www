# Repository Guidelines

## Project Structure & Module Organization

This is a static Czech-language website for Divadlo Vitus. `index.html` contains the page content and markup, `css/style.css` the styling, and `js/main.js` the navigation and gallery behavior. Images live under `images/`, grouped by gallery, plays, and team. `CNAME` contains the custom domain; `optimize-images.sh` generates WebP versions of images.

## Build, Test, and Development Commands

- `python3 -m http.server 8000` serves the repository locally at `http://localhost:8000`.
- `node --check js/main.js` checks JavaScript syntax when Node.js is available.
- `./optimize-images.sh` creates missing WebP copies under `images/`; it requires `cwebp` from the `webp` package and retains originals.

There is no package manager, build step, or configured linting tool. External Google Fonts require a network connection.

## Coding Style & Naming Conventions

Follow the existing two-space indentation in HTML, CSS, and JavaScript. Use semantic HTML, descriptive alt text, and existing accessibility attributes when adding interactive elements. Keep CSS class names lowercase and hyphenated, such as `nav-toggle`; use camelCase for JavaScript variables and functions. Reuse CSS custom properties for shared colors and spacing, and keep visible copy in Czech.

## Testing Guidelines

No automated test suite or coverage threshold is configured. After changes, serve the site locally and check the affected content at desktop and mobile widths. For interaction changes, check navigation, keyboard access, and the gallery lightbox; inspect the browser console for errors. `CONFIG.comingSoon` in `js/main.js` controls whether the full site is visible, so check the relevant mode without accidentally changing the intended setting.

## Commit & Pull Request Guidelines

Existing history uses short, informal commit subjects, such as `Create CNAME`. Write concise, descriptive subjects that explain the change. Pull requests should describe the user-visible effect and manual checks performed; link a relevant issue when available and include screenshots for visual changes. Preserve the custom domain in `CNAME` unless the domain is intentionally changing.
