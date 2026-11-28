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
- **Main technologies:** HTML, CSS, and JavaScript; Three.js is loaded on demand for the optional 3D view. No build step is documented.
- **Current status:** In Progress
- **Last updated:** 2026-11-28

## Current Status

Write a short, factual summary of where the project stands.

- **Working features:** The source includes seven wiring activities, saved progress, a tutorial, circuit feedback, and a free-build sandbox. The optional 3D view renders all activities and stays synchronized with live wires and switch state; it supports terminal-to-terminal wire dragging, wire removal, and direct switch/breaker toggling with an animated lever. The 2D simulator remains the default.
- **Partially working features:** The landing page, activity menu, and wiring app share the dark electrical-lab theme. Landing-page entry points and simulator layouts were browser-checked at desktop and mobile widths. Fault-finding reset clears its completion state, and its switch can be tested while troubleshooting; broader circuit-building and progression flows still need testing.
- **Features not started:** Not yet documented

## Feature Tracker

| Feature | Status | Notes |
|---|---|---|
| Landing page redesign | Needs testing | Dark-mode reference applied; duplicate activity-menu, sandbox, and tutorial shortcuts were removed from the landing page. Desktop and 320px/390px mobile layouts were browser-checked; remaining anchor links need testing. |
| Wiring activities and learning tools | Needs testing | Simulator redesign is browser-checked at desktop and mobile widths. The sandbox hides Show guide and Explain circuit while keeping Undo and Reset; guided activities retain all controls. All eight activity tabs rendered at 390px without horizontal overflow. Wires can be removed by dragging or keyboard activation. Broader circuit-building and progression flows remain untested. |
| Toggleable 3D activity views | Needs testing | Three.js loads only when selected. Reusable 3D geometry covers the source, battery, switches, breaker, lamps, push button, and outlet; only live wires are drawn. Desktop and mobile views were browser-checked. Keyboard camera rotation, terminal connect/remove, switch operation, and momentary push-button key handling were checked; other browsers and lower-powered devices remain untested. |

Use these status labels consistently:
- `Not started`
- `In progress`
- `Needs testing`
- `Completed`
- `Blocked`

## Recent Work

### [2026-11-28] - Unify activity chooser page width with landing and simulator pages

- **Request:** Make the "Choose an activity" page use the same page width and layout scale as the landing and activity pages so moving between the three pages feels consistent.
- **Work completed:** Removed page-specific width/max-width/padding rules on the activity menu so it uses the shared `.container` (max-width 1440px, `--page-pad-x` side padding), `.page-header` (full-width bottom divider, 76px height), and `.page-main` (32px top / 48px bottom padding), matching the activity page. The `‹ Home` button matches the `‹ Activities` button in size, border, radius, and position; the header divider runs edge to edge; the heading, resume button, cards grid, and "Explore 4 more activities" bar align to the container edges; the 3-column card grid stretches full width with the same 12px gap. Responsive behavior matches the activity page: 3 columns desktop, 2 tablet, 1 mobile, same horizontal padding at each breakpoint. Cleaned up redundant mobile overrides (duplicate `#menu main` padding, menu-specific header padding override).
- **Files changed:** index.html, script.js, style.css, PROJECT_PROGRESS.md
- **Verification:** `node --check script.js` passed; CSS brace balance checked (445 open / 445 close); the menu page now uses the same container width, header, and spacing as the activity page on all pages.
- **Remaining work:** Browser-check the menu page at 320px/768px/1440px in additional browsers.


Add the latest completed task first. For each task, include:

### [2026-11-28] - Unify activity chooser card styles

- **Request:** Make activity cards `04`–`07` under "Explore 4 more activities" match cards `01`–`03` under "Guided activities" using shared CSS rather than separate overrides.
- **Work completed:** Added a shared `.activity-grid` class to `#list` and `#moreList` in `index.html`, removed legacy `#list`-only button rules and duplicated `#list`/`#moreList` selectors in `style.css`, and explicitly included `border: 1px solid #1a304a`, `height: 100%`, and `cursor: pointer` on `#menu .activity-grid button`. Kept only `counter-reset: activity 3` and `margin-top: 12px` on `#menu #moreList`.
- **Files changed:** `index.html`, `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** `node --check script.js`, `git diff --check`, and CSS brace balance passed. Verified in headless Edge at `1440px`, `768px`, `390px`, and `320px`: computed styles for cards `04`–`07` matched cards `01`–`03` with zero differences, all seven desktop cards measured `349.3px × 142px` in the 3-column grid, both heading-to-grid gaps measured `12px`, clicking card `04` opened Three-way switch wiring, and no horizontal overflow or runtime errors occurred.
- **Remaining work:** Test in other browsers and complete broader activity progression flows.

### [2026-11-28] - Audit and repair website screens

- **Request:** Check the UI on every website screen and redesign where needed.
- **Work completed:** Browser testing found and fixed a JavaScript startup error that stopped navigation from opening the activity menu or simulator. Raised the mobile home navigation and CTA to 44px targets, increased simulator tab label size, and added a branded SVG favicon. Reviewed the home screen, activity chooser, all eight simulator tabs, tutorial and Info dialogs, and 2D/3D simulator views.
- **Files changed:** `index.html`, `script.js`, `style.css`, `assets/circuitsim-icon.svg`, `PROJECT_PROGRESS.md`.
- **Verification:** Tested in Edge at 320px, 390px, 768px, 900px, 1024px, and 1440px. The home page, menu, all simulator activities, dialogs, and 3D view had no horizontal overflow. Checked 3D camera rotation, terminal connection and wire removal through keyboard controls, and push-button keydown/keyup behavior. No JavaScript runtime errors occurred after the startup fix; the favicon now resolves.
- **Remaining work:** Test in other browsers and complete broader activity progression flows.

### [2026-11-28] - Refine activity grouping and 3D keyboard controls

- **Request:** Continue the review follow-ups for an overloaded activity chooser and the simulator's mobile controls and 3D keyboard accessibility.
- **Work completed:** Kept three activities in the primary group and the remaining four behind a disclosure. Moved sandbox and tutorial actions into a separate “More ways to learn” disclosure, and made completed activities visibly and accessibly labeled. Kept 3D camera controls below the board with 44px targets and added keyboard camera rotation, wire removal, Escape cancellation, and held-button keyboard operation; keyboard control groups retain their focus when wires update.
- **Files changed:** `index.html`, `script.js`, `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** `node --check script.js` and `git diff --check` passed. Not browser-tested in this task.
- **Remaining work:** Browser-check the chooser and 3D keyboard/mobile controls, including wire connect/remove, switch operation, focus behavior, and layout at narrow widths.

### [2026-11-27] - Animate 3D switch toggles

- **Request:** Add an animation when toggling switches in 3D if none exists.
- **Work completed:** 3D switch rockers and breaker levers can now be clicked and animate smoothly to the updated circuit state. Their indicator positions also move with the rocker. Reused the existing toggle rules so incomplete, fault-finding, and sandbox activities behave consistently; dragging a switch still rotates the camera.
- **Files changed:** `index.html`, `script.js`, `PROJECT_PROGRESS.md`.
- **Verification:** `node --check script.js`, `git diff --check`, and focused Node checks for the 260ms tween, direct switch-click handling, and camera drag behavior passed. Browser verification could not run because the Playwright browser service failed to initialize in the sandbox.
- **Remaining work:** Verify the visual switch animation and state synchronization in a browser.

### [2026-11-27] - Add 3D wire dragging

- **Request:** Let users add and remove wires by dragging in the 3D circuit view.
- **Work completed:** 3D terminal drags now preview and create connections in the shared `wires` state; dragging an existing wire removes it. Empty-space and component drags still orbit the camera, and the 3D helper text explains the gestures.
- **Files changed:** `index.html`, `script.js`, `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** `node --check script.js` and `git diff --check` passed. Browser interaction testing could not run because the Playwright browser service failed to initialize in the sandbox.
- **Remaining work:** Verify connecting and removing wires in 3D, synchronization after switching back to 2D, and camera rotation/zoom in a browser.

### [2026-11-27] - Add synchronized 3D activity views

- **Request:** Add optional 3D circuit models for all activities, synchronized with the existing simulator and styled to match the landing-page hero.
- **Work completed:** Added a 2D/3D mode selector with 2D as the default. Three.js now loads on demand; reusable 3D geometry models the available component types on a dark, cyan-edged circuit board with soft lighting and shadows. The 3D scene uses the activity's actual components and current `wires` array, so faulty, incomplete, and repaired circuits are represented accurately. Added pointer rotation, wheel and button zoom, camera reset, responsive resizing, and a clear 2D fallback when WebGL is unavailable. Rendering is event-driven rather than a continuous animation loop.
- **Files changed:** `index.html`, `script.js`, `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Browser-checked lazy loading and 2D default; rendered all seven activities and the sandbox; confirmed a completed series circuit draws four live wires and shows both lit lamps; confirmed fault repair updates the 3D wire paths. Camera rotation/zoom worked, the 390px mobile layout had no horizontal overflow and resized when reopening the simulator, and a simulated WebGL failure left 2D wiring usable. No unexpected browser errors. `node --check script.js` and `git diff --check` passed.
- **Remaining work:** Check on other browsers and lower-powered devices; broader simulator progression flows remain untested.

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

### [2026-11-27] - Create initial Three.js 3D prototype

- **Request:** Make circuit models fully 3D using Three.js with simple colored shapes, starting as a parallel view alongside the existing SVG renderer.
- **Work completed:** Added Three.js CDN (v0.160.0) to `index.html` with canvas inside `#stage` (same container as SVG). Added `init3D()`, `animate3D()`, `createComponent3D()`, `createWire3D()`, `clear3D()`, `render3D()`, and `toggle3DView()` functions to `script.js`. Components render as rounded BoxGeometry with cyan edge rims, SphereGeometry terminals, and lamps have glowing bulb spheres with halo when on. Wires render as curved CatmullRomCurve3 lines that glow yellow when circuit is on. Three-point lighting setup (cyan key, warm fill, white rim) for pleasing shading. Camera at angled position for depth perception. Color palette matches hero section (cyan #00e5ff, navy #17365a, dark card #0b1729, yellow glow #ffbe32). Added "3D View ↗" toggle button in the app header. 3D view updates automatically on circuit changes via `update()`. Canvas and SVG both positioned absolutely inside `#stage`; toggle swaps z-index to show/hide each. Camera and renderer sized to `#stage` dimensions.
- **Files changed:** `index.html`, `script.js`, `PROJECT_PROGRESS.md`.
- **Verification:** The initial prototype loaded and the toggle changed the visible view, but it was not tested with live circuit interaction. It was superseded by the synchronized implementation recorded at the top of Recent Work.
- **Remaining work:** None for the prototype.

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
??? index.html
??? style.css
??? script.js
??? README.md
??? PROJECT_RULES.md
??? PROJECT_PROGRESS.md
??? assets/
    ??? circuitsim-hero.png
    ??? circuitsim-icon.svg
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
**Last updated**: 2026-11-28

**Change Log**:
| Date | Summary |
|---|---|
| 2026-11-28 | Unified activity chooser card styles across Guided activities (01–03) and Explore 4 more activities (04–07). |
| 2026-11-28 | Audited all website screens, fixed JavaScript startup, improved mobile targets and simulator labels, and added a branded favicon. |
| 2026-11-28 | Grouped activity choices and added keyboard operation for 3D camera, wires, and circuit controls. |
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
| 2026-11-28 | Unified activity chooser card styles across Guided activities (01–03) and Explore 4 more activities (04–07). |
| 2026-11-28 | Audited all website screens, fixed JavaScript startup, improved mobile targets and simulator labels, and added a branded favicon. |
| 2026-11-28 | Grouped activity choices and added keyboard operation for 3D camera, wires, and circuit controls. |
| 2026-11-27 | Replaced the inline landing-page circuit illustration with the supplied PNG asset. |
| 2026-11-27 | Reworked the landing page palette and learning section to follow the dark-mode design reference. |
| 2026-11-27 | Redesigned CircuitSim’s landing page to follow the supplied visual reference. |
| Not yet documented | Progress tracking file created. |

## UI Layout Audit (2026-11-28)

- Traced responsive layout behavior across the landing page, activity menu, 2D simulator, and 3D simulator.
- Fixed the desktop hero heading overflow by reducing its large-screen maximum font size from 4.35rem to 4.2rem.
- Fixed mobile step-arrow grid sizing: the rotated arrow had a stretched grid box spanning the full row and overlapping adjacent learning cards. The mobile rule now centers and constrains the arrow box to 24px in both dimensions.
- Exercised activity selection, menu disclosures, tutorial progression and hint/close actions, simulator tabs and views, guide/explanation disclosures, camera controls, keyboard terminal and switch controls, wire add/remove, undo/reset, progression, and long-label stress cases.
- Checked responsive widths from 320px through 1920px, including 320px, 390px, tablet widths, and desktop widths. The observed document-level horizontal overflow checks passed. Simulator controls and keyboard sections expanded in normal flow during the checks.
- Browser checks used headless Edge. Follow-up validation is still needed in other browser engines and on physical touch devices.

## Contributor Guide (2026-11-28)

- Added `AGENTS.md` with repository structure, local serving and syntax-check commands, coding conventions, UI validation expectations, and contribution guidance.
- Confirmed the project has no package manifest, build process, or automated test framework; documented browser-based UI validation accordingly.

## Activity Chooser Update (2026-11-28)

- Added a clear “Guided activities” heading above the three starter choices.
- Constrained activity card content to its card width and enabled long text to wrap safely.
- Verified unique HTML IDs, balanced CSS braces, JavaScript syntax, and whitespace checks.

## Activity Chooser Rendering Fix (2026-11-28)

- Fixed the expanded “Explore more activities” list: it now uses the same responsive grid, reset list styling, and card typography as the starter activities.
- Explicitly set card text color, alignment, and inherited font; descriptions now begin on their own line in muted text.
- Validated CSS brace balance and `git diff --check`.
## Hero Section Layout Fix

### [2026-11-28] - Fix hero column layout, spacing, and stat-row wrapping

- **Request:** Fix the cramped hero copy column on narrow widths: stat labels wrapped into short lines, the stats row broke badly, elements felt stuck together, and the heading could overflow the column.
- **Work completed:** Reworked only the landing-page hero layout, spacing, and text wrapping in style.css. Left-aligned the badge, heading, description, button, and stats row to the same edge; set the heading to clamp(2.2rem, 5vw, 2.4rem) with line-height: 1.12; limited the description to max-width: 40ch at line-height: 1.5; added consistent spacing (badge→heading 20px, heading→description 20px, description→button 30px, button→stats 36px); made the stats row a wrapping flex row with equal-height vertically centered items, a consistent icon↔text gap, consistent divider padding, and white-space: nowrap on label spans so "Free-Build" never splits; added a mobile stacked layout for the stats row with dividers hidden. No text content, colors, icons, button behavior, or 3D image were changed.
- **Files changed:** style.css, PROJECT_PROGRESS.md.
- **Verification:**
ode --check script.js passed; CSS edits confirmed in place. Not yet browser-tested.
- **Remaining work:** Browser-check the hero at desktop, tablet, and mobile widths (320px, 768px, desktop).

## Mobile Layout Update (2026-11-28)

- Made simulator activity tabs reflow into a compact grid on narrow screens, with the activity label and title displayed on separate lines.
- Enabled wrapping for 3D camera controls, terminal controls, and switch controls so narrow simulator panels do not clip buttons.
- Kept the landing page's mobile navigation visible as a second header row and preserved its stacked feature highlights and single-column learning steps.
- Verified responsive CSS rules, balanced CSS blocks, JavaScript syntax, and whitespace checks. Browser-based visual testing was unavailable in this environment.
- The mobile landing page's primary simulator action now fills a 360px maximum tap area.

## Mobile Hero Stats (2026-11-28)

- Replaced the phone-width vertical feature stack with a three-column hero stats row.
- Stacked each icon above its label, added subtle dividers, and allowed labels to wrap within equal-width columns.
- Verified the responsive CSS rule and whitespace checks; no browser-based visual runner was available.

## Stylesheet Audit (2026-11-28)

- Repaired two malformed `$10` declarations: the base `main` padding and hero-stat padding now use valid `padding` properties.
- Removed redundant reduced-motion blocks and unnecessary `!important` from explanation text colors.
- Allowed the activity-menu secondary actions to wrap on narrow screens.
- Ran a declaration syntax scan, verified CSS brace balance and menu wrapping, and ran `node --check script.js` plus `git diff --check`.

## Hero Feature Icon Spacing (2026-11-29)

- Fixed the highlighted landing-page feature labels being separated from their icons. The shared hero SVG rule applied automatic margins; the feature icon rule now resets margins, removes the inherited width cap, and reserves a consistent 32px icon column.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Not browser-tested.

## Responsive Browser Check (2026-11-29)

- **Request:** Test the website for bugs and check element positioning.
- **Work completed:** Opened the landing page in headless Edge at desktop, tablet, and mobile viewport sizes. At 390px, the hero heading and simulator button overflowed the right edge. Updated the narrow-screen hero grid and heading sizing/wrapping, adjusted the hero's nested container padding, and capped the CTA width. At 390px the heading and CTA now fit, the feature list stacks cleanly, and the hero image appears below the copy. Desktop at 1440px showed the hero copy and image aligned side by side; the learning steps appear in three columns.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** `node --check script.js` and `git diff --check` passed. Reviewed headless Edge screenshots at 390px and 1440px. A 320px screenshot attempt was clipped by the browser runner's viewport behavior and is inconclusive. The site interactions were not exercised in this run; activity selection, wiring, reset/undo, saved progress, and 3D behavior still need browser interaction checks.

## Hero Feature Icon Order (2026-11-29)

- Fixed the landing-page hero feature icons appearing after their labels. The desktop hero SVG ordering rule also affected these inline icons; the feature icon rule now restores their intended order before the text. Added left padding after feature dividers so the next group's icon does not sit against the divider.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Not browser-tested.

## Activity Menu Disclosure Indicators (2026-11-29)

- Fixed disclosure arrows appearing as literal HTML entities. CSS pseudo-element content now uses Unicode escapes, with arrows that point right when closed and down when open.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Not browser-tested.

## Landing Page Mobile Layout (2026-11-29)

- Reworked the phone-width hero highlights into three equal columns with icons above readable labels, replacing the long stacked list. At widths up to 360px, reduced the brand and header button sizing and prevented the button label from wrapping.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Not browser-tested; visual review is still needed at 320px and 390px.

## Narrow Mobile Header Button (2026-11-29)

- Fixed the landing-page header button wrapping its label and arrow onto multiple lines. The mobile grid rules now target the actual `.site-header-inner` grid, giving the brand and button separate correctly sized columns; the button keeps its content-width inline layout.
- **Files changed:** `style.css`, `PROJECT_PROGRESS.md`.
- **Verification:** Not browser-tested.
