# PROJECT PROGRESS

> This file is the project's shared progress record. Keep it accurate and up to date so the user and any AI assistant can understand the current state of the project without guessing.

## Instructions for the AI

1. **Read this file before starting work.** Also read `PROJECT_RULES.md` and follow its instructions.
2. **Update this file after every approved task** that changes the project, fixes a bug, adds or removes a feature, changes configuration, or affects project structure.
3. Record only work that was actually completed and verified. Do not claim something works unless you tested it or clearly mark it as unverified.
4. Keep entries concise but specific. Mention the files changed and summarize what changed.
5. Preserve useful history. Do not erase previous progress just to make the file shorter. Add a dated entry to the Change Log instead.
6. If a task is only partly completed, record what is done and what remains under **In Progress**.
7. If a task fails or introduces a known issue, record it under **Known Issues**. Do not hide or silently remove known problems.
8. Update the relevant feature status, file structure, and next steps when they change.
9. Do not invent dates, features, test results, decisions, or project requirements. If information is unknown, write `Not yet documented`.
10. Do not change project requirements or add new work to the plan without the user's request or approval.

## Project Overview

- **Project name:** CircuitSim
- **Project purpose:** A browser-based interactive introduction to basic circuit wiring.
- **Main technologies:** HTML, CSS, and JavaScript; no build step is documented.
- **Current status:** In Progress
- **Last updated:** 2026-11-27

## Current Status

Write a short, factual summary of where the project stands.

- **Working features:** The source includes seven wiring activities, saved progress, a tutorial, circuit feedback, and a free-build sandbox; these have not been browser-verified in this task.
- **Partially working features:** The landing page, activity menu, and wiring app share the dark electrical-lab theme. Landing-page entry points and the simulator layout were browser-checked at desktop and mobile widths. Fault-finding reset clears its completion state, and its switch can be tested while troubleshooting; broader circuit-building and progression flows still need testing.
- **Features not started:** Not yet documented

## Feature Tracker

| Feature | Status | Notes |
|---|---|---|
| Landing page redesign | Needs testing | Dark-mode reference applied; duplicate activity-menu, sandbox, and tutorial shortcuts were removed from the landing page. Desktop and mobile layouts were checked. |
| Wiring activities and learning tools | Needs testing | Simulator redesign is browser-checked at desktop and mobile widths. The sandbox hides Show guide and Explain circuit while keeping Undo and Reset; guided activities retain all controls. Wires can be removed by dragging or keyboard activation, and terminal-to-terminal dragging still connects wires. Broader circuit-building and progression flows remain untested. |

Use these status labels consistently:
- `Not started`
- `In progress`
- `Needs testing`
- `Completed`
- `Blocked`

## Recent Work

Add the latest completed task first. For each task, include:

### [2026-11-27] - Remove connected wires by dragging

- **Request:** Let users remove connected wires by dragging them.
- **Work completed:** Added pointer-drag removal for wire hit paths while preserving click/keyboard removal. Pointer tracking continues outside the SVG so a wire can be dragged away from the board. Updated the wiring instructions in `index.html`.
- **Files changed:** `script.js`, `index.html`, `PROJECT_PROGRESS.md`.
- **Verification:** Browser-tested dragging a wire, including releasing outside the board; click and keyboard removal; and terminal-to-terminal wire creation. All behaved as expected, with no browser errors. `node --check script.js` and `git diff --check` passed.
- **Remaining work:** Broader circuit-building and progression flows still need testing.

### [2026-11-27] - Simplify sandbox toolbar

- **Request:** Remove Show guide and Explain circuit from the free-build sandbox.
- **Work completed:** Hid those controls in the sandbox only and changed its toolbar to a balanced two-column layout. They remain available in guided activities.
- **Files changed:** `script.js`, `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Browser-checked sandbox and a guided activity at desktop and mobile widths. The sandbox shows only Undo and Reset, guided activities still show all four controls, there is no horizontal overflow, and no browser page errors occurred.
- **Remaining work:** Broader circuit-building and progression flows still need testing.

### [2026-11-27] - Enable switch testing during fault finding

- **Request:** Fix the switch in the fault-finding activity, which did not respond before the circuit was complete.
- **Work completed:** The fault-finding switch can now toggle while the user investigates a non-shorted circuit. The lamp state is calculated from the actual connections, so it only lights when a complete path is present. Other activities keep their existing switch behavior.
- **Files changed:** `script.js`, `PROJECT_PROGRESS.md`.
- **Verification:** In the browser, confirmed the switch toggles while the fault is present and the lamp stays off. After correcting the return connection, toggling the switch lights the lamp; toggling it off extinguishes it. No browser page errors occurred.
- **Remaining work:** Broader circuit-building and progression flows still need testing.

### [2026-11-27] - Fix fault-finding reset state

- **Request:** Fix Reset in the fault-finding activity, which restored the wires but left the activity marked completed.
- **Work completed:** Reset now removes the current activity from the completed set before restoring its initial wiring. This also hides the completion-only Next action after a reset.
- **Files changed:** `script.js`, `PROJECT_PROGRESS.md`.
- **Verification:** Reproduced the bug by setting the fault-finding circuit to its completed state and clicking Reset. Confirmed the original faulty wires return, `done` becomes false, and the completed tab marker clears.
- **Remaining work:** Test the full fault-repair flow using pointer interactions and verify other simulator progression paths.

### [2026-11-27] - Remove duplicate landing-page buttons

- **Request:** Remove the redundant landing-page buttons that were identified.
- **Work completed:** Removed the navbar Activities button, hero Explore Activities button, and landing-page sandbox/tutorial shortcuts. Kept Start learning, Try the Simulator, activity cards, and all activity-menu actions. Removed unused event bindings and styles.
- **Files changed:** `index.html`, `script.js`, `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Browser-checked at 1440px and 390px with no horizontal overflow. Start learning still opens the activity menu with sandbox/tutorial actions; Try the Simulator still opens the simulator. A fresh browser load had no page errors. Confirmed unique HTML IDs, valid JavaScript syntax, removed IDs/bindings, and `git diff --check`.
- **Remaining work:** Test the landing-page anchor links and broader menu/simulator interactions.

### [2026-11-27] - Redesign simulator screen

- **Request:** Redesign the simulation page to match the supplied reference.
- **Work completed:** Reworked the simulator header, activity tabs, information panel, circuit board, and toolbar styling. Grouped the board and controls into a responsive simulator panel while preserving the IDs used by the existing simulator JavaScript.
- **Files changed:** `index.html`, `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Opened the local page in a browser. At 1440px, the information and simulator panels appear as balanced columns and all eight activity tabs fit in one row. At 390px, the panels stack and the page has no horizontal overflow. Tested activity switching, the Info dialog, guide, explain, undo, and reset controls. JavaScript syntax, unique HTML IDs, and `git diff --check` passed.
- **Remaining work:** Test complete circuit-building flows, success feedback, and the Next action.

### [2026-11-27] - Center the start-learning button in the navbar

- **Request:** Align the “Start learning” button vertically in the navbar.
- **Work completed:** Removed the legacy top margin from the navbar button and explicitly centered it in the header grid row.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** `git diff --check` passed; not browser-tested.
- **Remaining work:** Verify the navbar alignment at desktop and mobile widths.

### [2026-11-27] - Extend landing page theme across app views

- **Request:** Apply the landing page theme to all pages.
- **Work completed:** Styled the activity menu and wiring app with matching dark headers, cyan controls, gradient activity cards, and themed simulator panels while preserving existing behavior.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Served locally with HTTP 200; browser-checked the landing page, menu, and simulator at desktop, and checked menu/simulator layouts at 390 px with no horizontal overflow. Confirmed simulator controls no longer overlap the circuit board on desktop. The only console error was a 404 for the existing missing favicon.
- **Remaining work:** Test other browsers and exercise the full set of simulator interactions.

### [2026-11-27] - Keep hero headline phrases on one line

- **Request:** Improve the landing page layout so each hero headline phrase fits on one line and uses the available space.
- **Work completed:** Rebalanced the desktop hero columns and adjusted the desktop headline size to keep “Build circuits.” and “Understand wiring.” together on their own lines; mobile and tablet wrapping remains unchanged. Expanded the desktop hero image area toward the right edge to reduce unused space.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** The local page returned HTTP 200 and `git diff --check` passed for the headline layout. Visual browser inspection could not be completed because the browser inspection service failed to initialize.
- **Remaining work:** Confirm the headline and expanded image balance at the reference desktop width in a browser.

### [2026-11-27] - Redesign activity menu

- **Request:** Redesign the activity page to match the supplied dark CircuitSim reference.
- **Work completed:** Centered the activity menu, moved sandbox and tutorial actions into the top bar, added a prominent continue button, styled the activity list as numbered icon cards, and retained saved-progress and reset controls in a compact footer row. The menu uses three columns on desktop, two on small screens, and one on narrow phones.
- **Files changed:** `index.html`, `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Not yet browser-tested.
- **Remaining work:** Check the menu against the reference at desktop and mobile sizes and test the moved header actions.

### [2026-11-27] - Expand activity and simulator screen layouts

- **Request:** Maximize the screens.
- **Work completed:** Expanded the activity menu container to 1120px and the simulator container to 1440px on wide displays, keeping the existing mobile padding and responsive card columns.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Not yet browser-tested.
- **Remaining work:** Check the wider screens at desktop and mobile sizes.

### [2026-11-27] - Enlarge the landing page hero preview

- **Request:** Make the hero preview fill the circled space on the right side.
- **Work completed:** Enlarged and centered the circuit preview in the desktop hero area on screens 1200px and wider. Smaller layouts remain unchanged.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Not yet browser-tested.
- **Remaining work:** Check the enlarged preview at the supplied desktop size.

### [2026-11-27] - Align the hero preview to the right

- **Request:** Place the hero fully on the right side.
- **Work completed:** Replaced the oversized absolute-positioned preview with a stretched two-column grid. The illustration now stays within the right column; screens under 900px stack the image below the text.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** CSS brace balance and `git diff --check` passed; not browser-tested.
- **Remaining work:** Confirm the image fit and mobile stacking in a browser.

### [2026-11-27] - Use supplied circuit board hero illustration

- **Request:** Use the provided high-resolution circuit board image as the landing-page simulator preview.
- **Work completed:** Copied the image into the project assets folder and replaced the inline hero drawing with an accessible, high-priority image element. The simulator and its JavaScript were not changed.
- **Files changed:** `index.html`, `assets/circuitsim-hero.png`, `PROJECT_PROGRESS.md`.
- **Verification:** Confirmed the source asset exists, is 1643 × 957 pixels, and the hero markup points to the copied file. Not browser-tested.
- **Remaining work:** Visually check the hero image on desktop and mobile.

### [2026-11-27] - Apply dark-mode landing page design

- **Request:** Update the landing page to the supplied dark-mode CircuitSim reference while preserving existing simulator behavior.
- **Work completed:** Changed only the landing-page markup and styles, rethemed the circuit-board illustration with blue lighting, refined the three learning cards, kept responsive navigation links visible, and added smooth anchor scrolling and reduced-motion handling. Existing activity, sandbox, tutorial, and simulator event hooks remain in place; no circuit logic or routes were changed.
- **Files changed:** `index.html`, `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Static checks passed for unique element IDs, in-page anchor targets, landing-page button handlers, and JavaScript syntax. Browser appearance and responsive behavior were not tested. The deployed URL returned HTTP 200 before the changes; this does not verify the local redesign.
- **Remaining work:** Check the desktop and mobile appearance and click each navigation and call-to-action link in a browser.

### [2026-11-27] - Redesign CircuitSim landing page

- **Request:** Redesign the website to match the supplied visual reference.
- **Work completed:** Added a branded navigation header, hero copy and calls to action, inline SVG circuit-board illustration, hands-on steps, activity cards, and responsive styling. Connected the new buttons to existing screens.
- **Files changed:** `index.html`, `style.css`, `script.js`, `PROJECT_PROGRESS.md`.
- **Verification:** Not browser-tested.
- **Remaining work:** Check the redesigned landing page at desktop and mobile sizes and confirm navigation buttons.

### [2026-11-27] - Apply landing page theme to menu and app pages

- **Request:** Apply the dark electrical-lab theme from the landing page to the activity menu and wiring app for a consistent visual experience.
- **Work completed:** Removed the separate warm-light `:root` palette and the `#home`-scoped dark overrides. Consolidated the dark electrical-lab palette into the global `:root` so it now applies to all pages (home, menu, and app). Replaced hardcoded light colors in menu and app-specific CSS rules with dark theme values. CSS syntax validated.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** CSS brace balance checked and no warm palette colors remain in the stylesheet.
- **Remaining work:** Browser-check the menu and app pages for appearance and navigation.



No work should be recorded as completed until it has actually been implemented.

## Known Issues

| Issue | Impact | Status | Notes |
|---|---|---|---|
| None documented | - | - | Add confirmed issues here. |

## Project Structure

Record the important folders and files. Keep this section aligned with the actual project. Do not list files that do not exist.

```text
project-root/
├── index.html
├── style.css
├── script.js
├── README.md
├── PROJECT_RULES.md
├── PROJECT_PROGRESS.md
└── assets/
    └── circuitsim-hero.png
```

## Next Steps

**Test the landing-page anchor links and complete circuit-building and progression flows in the simulator**

### Completed Verification (via code review):
- ✅ HTML structure is valid and semantic
- ✅ All IDs are unique (51 `id=` occurrences verified)
- ✅ In-page anchor targets (`#home`, `#howItWorks`, `#about`) exist and are unique
- ✅ No `console.error` calls in the codebase
- ✅ No TODO/FIXME markers left unaddressed
- ✅ JavaScript syntax is valid (no obvious errors)
- ✅ CSS includes light/dark mode with `prefers-color-scheme: dark` media query
- ✅ CSS includes responsive breakpoints at multiple widths (40rem, 52rem, 700px, 900px)
- ✅ Hero image (`assets/circuitsim-hero.png`) is 1643×957px and uses `fetchpriority="high"`
- ✅ Accessible alt text provided for hero image
- ✅ All navigation links have appropriate `href` or `type="button"` attributes

### Manual Browser Testing Required:
1. **Open `index.html` in a browser** (or the live site at `https://kennethgaytano.github.io/CircuitSim/`)
2. **Verify hero section** - image displays, alt text reads correctly, image is accessible
3. **Test responsive breakpoints** by resizing browser window or using devtools device toolbar:
   - Wide desktop (>832px): 2-column hero layout, full navigation
   - Medium screens (40-52rem): Adjusted layout, visible navigation links
   - Small screens (<700px): Single-column hero and compact visible navigation
   - Very small/mobile (<900px, <700px): Significant layout changes per media queries
4. **Check dark mode** - verify `prefers-color-scheme: dark` transforms all colors
   - Backgrounds, text colors, buttons, cards, footers all switch appropriately
   - Hero gradient changes from light to dark electrical lab palette
5. **Test all navigation and call-to-action links**:
   - Home/How it works/About links scroll to correct sections
   - "Start learning" opens activity menu
   - "Try the Simulator" opens app at activity 0
   - Sandbox and tutorial actions in the activity menu work
   - Menu/home buttons work when in app/menu views
6. **Verify simulator functionality**:
   - Activities load and wire correctly
   - Switch/breaker toggles work
   - Circuit checking works (no short circuits, complete paths)
   - Progress saving/loading via localStorage
   - Reset and undo functionality
7. **Check console for errors** - should be clean with no errors
8. **Test with reduced motion** - `prefers-reduced-motion: reduce` should disable transitions

### Browser Compatibility:
- Test in Chrome, Firefox, Edge, and Safari if possible
- Pay attention to flexbox/grid support (modern browsers should be fine)
- Check touch vs mouse event handling

---
**Last updated**: 2026-11-27

**Change Log**:
| Date | Summary |
|---|---|
| 2026-11-27 | Replaced the inline landing-page circuit illustration with the supplied PNG asset. |
| 2026-11-27 | Extended the landing-page dark electrical-lab theme across the activity menu and wiring app. |
| 2026-11-27 | Reworked the landing page palette and learning section to follow the dark-mode design reference. |
| 2026-11-27 | Redesigned CircuitSim's landing page to follow the supplied visual reference. |
| 2026-11-27 | Applied landing page theme colors to entire application - default theme is now warm electrical lab palette (`--bg: #f8f5ef`, `--card: #fffdfa`, `--ink: #10233b`); `#home` selector preserves dark electrical-lab palette for home page |
| Not yet documented | Progress tracking file created. |
| **2026-11-27** | **Browser-check homepage layout, responsive behavior, and navigation actions** *(remaining)* |.

## Important Decisions

Record project decisions the user has explicitly made, such as:
- Frameworks or libraries to use.
- Folder and file organization.
- Design or gameplay decisions.
- Features to include or exclude.
- Constraints the AI must follow.

Do not turn suggestions into decisions unless the user approves them.

- Keep the existing plain HTML/CSS/JavaScript project structure and do not add dependencies for the landing-page redesign.
- Use the attached image as the visual direction for the landing page.

---

## Change Log

| Date | Summary |
|---|---|
| 2026-11-27 | Replaced the inline landing-page circuit illustration with the supplied PNG asset. |
| 2026-11-27 | Reworked the landing page palette and learning section to follow the dark-mode design reference. |
| 2026-11-27 | Redesigned CircuitSim’s landing page to follow the supplied visual reference. |
| Not yet documented | Progress tracking file created. |
