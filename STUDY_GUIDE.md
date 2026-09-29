# CircuitSim (full structure) study guide

## How to run it
Double-click `index.html`, or use the Live Server extension in VS Code. Nothing to install.

## Files
| File | What it does |
|---|---|
| `index.html` | A tiny page: a header for the menus and an empty `<main>` |
| `css/style.css` | Colors, layout, dark mode, phone layout |
| `js/app.js` | Everything else. Sections are numbered 1 to 10 |

## How the site works
There is only one HTML page. `render()` in `app.js` draws the current page into `<main>`.
The menu is built from the `SECS` array, so adding a page means adding one line there.

## Suggested reading order
1. `index.html` (it is short).
2. `js/app.js` section 1: the `SECS` menu data.
3. Section 2 and 3: the circuit model and `solve()`. This is the electronics logic. Follow it with pen and paper.
4. Section 4: how a part and the board become SVG.
5. Section 7: the `PG` table. Each simulator activity is just data.
6. Section 8: drag and drop with pointer events.

## Where each menu page lives in the code
| Section | Code |
|---|---|
| Home | `home()` |
| Learn | `LN` data and `learn()` |
| Construction | `PG['con.*']` entries |
| Analysis (calculators) | `CALC` and `calc()` |
| Analysis (Predict and Verify) | `PG['ana.pv']` |
| Measurement | `PG['mea.*']` entries |
| Troubleshooting | `PG['tro.*']` entries |
| Assessment tests | `QZ` and `quiz()` |
| Final Challenge | `PG['asm.fin']` |

## Concepts to learn
- Data-driven pages: the menu, lessons and activities are arrays and objects.
- Series and parallel resistance: read `solve()`.
- SVG drawing with template strings.
- Pointer events for drag and drop (mouse and touch use the same code).
- Event delegation: one click listener for all buttons.
- `localStorage` for saving progress.

## Exercises (easy to hard)
1. Change the accent color in `:root`.
2. Add a new question to `QZ` (the tests will use 9 questions automatically).
3. Add a new Learn page: one line in `SECS` and one entry in `LN`.
4. Change the battery from 9 V to 12 V in `solve()`. Which challenges break? Why?
5. Add a new Analysis page for "series resistance" using `CALC`.
6. Add a new construction challenge in `PG` (for example: parallel with a resistor in each branch).
7. Add a resistor value (for example 330) to the tap cycle and the Analysis problems.
8. Add a "Clear progress" button on the Home page.
