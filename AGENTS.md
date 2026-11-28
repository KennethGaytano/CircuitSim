# Repository Guidelines

## Project Structure

CircuitSim is a small, dependency-light website built with plain HTML, CSS, and JavaScript. The application entry point is `index.html`; styles live in `style.css`, and circuit data, simulator behavior, and UI interactions live in `script.js`. Static images and icons belong in `assets/`. There is no separate source, build, or test directory. Read `PROJECT_RULES.md` for project-specific development and communication expectations, and update `PROJECT_PROGRESS.md` after completing work.

## Development and Validation

There is no package manifest or build step. Serve the repository root locally so browser APIs and assets load consistently:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`. Check JavaScript syntax with `node --check script.js`. No automated test framework is configured; validate UI changes in a browser, including simulator interactions and narrow layouts (for example, 320px, 768px, and desktop widths). Check the browser console and confirm controls remain usable by keyboard and touch where relevant.

## Code Style

Keep HTML, CSS, and JavaScript in their existing separate files. Use two spaces for indentation, descriptive camelCase names in JavaScript, and lowercase kebab-case for CSS classes. Prefer small functions, clear labels, semantic HTML, and native controls. Reuse existing patterns and avoid adding dependencies, generated files, or duplicate rules without a clear need. Keep responsive rules in `style.css` and preserve accessible focus states and keyboard behavior.

## UI and Simulator Changes

Preserve existing simulator behavior and the visual system unless a change specifically requires otherwise. When editing layouts, test state changes as well as initial views: activity selection, wire creation/removal, switches, reset/undo, disclosures, and 2D/3D controls. Ensure dynamic content can grow naturally and controls do not clip or overlap at phone, tablet, and desktop widths.

## Commits and Pull Requests

Recent history uses short, direct subjects, though conventions vary. Write imperative commit subjects that describe one change (for example, `Fix mobile simulator control wrapping`). Pull requests should summarize user-visible changes, list validation performed, note any known limitations, and include before/after screenshots for visual changes. Link related issues when available.

## Configuration and Dependencies

Do not commit secrets or local environment files. The 3D experience may load its rendering library at runtime; preserve its existing fallback behavior when changing that integration. Avoid introducing a package manager or build tooling unless the project explicitly adopts it.
