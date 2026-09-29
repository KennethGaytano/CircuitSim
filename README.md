# CircuitSim

A breadboard circuit simulator for first-year Industrial Art students. Build a circuit from
resistors, bulbs, switches and wires, measure it, find the fault and fix it, without ever touching
a live wire.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no framework.

Live site: <https://kennethgaytano.github.io/CircuitSim/>

## How to run it

Open `index.html` by double-clicking it, or start the Live Server extension in VS Code. There is
nothing to install.

## Files

| File | What it does |
|---|---|
| `index.html` | A tiny page: a header for the menus and an empty `<main>` that every page is drawn into |
| `css/style.css` | Ten numbered blocks: theme colors, base styles, header and menus, buttons and form fields, page layout, cards and grids, the SVG board, feedback colors, progress bars and quiz options, responsive |
| `js/app.js` | Everything else, in nine numbered sections plus a start-up block at the end |
| `STUDY_GUIDE.md` | Reading order, key concepts and exercises for learning the code |
| `.gitignore` | Editor and OS files that should never be committed |

## How the site works

There is only one HTML page. `render()` in `app.js` looks at the current page id and draws the
matching page into `<main>`, so the menu, the lessons, the quizzes and the simulator are all just
data plus one render function:

```
change the data or the state  ->  render() / draw()  ->  the screen
```

The top menu is built from the `SECS` array, so adding a page means adding one line there.

## What is inside

| Section | Pages | What it does |
|---|---|---|
| Home | 1 | Progress bars for every section, and links into the first page |
| Learn | 6 | Short lessons: Circuit Components, Voltage, Current, Resistance, Ohm's Law, Circuit Safety |
| Construction | 5 | Drag parts from the tray to build series, parallel and series-parallel circuits, or copy a target diagram |
| Analysis | 6 | Five Ohm's-law calculators (get three right to complete one) plus Predict and Verify |
| Measurement | 3 | Voltmeter, ammeter and multimeter practice: tap a part to measure it |
| Troubleshooting | 4 | Find the faulty part with a meter, repair it, and deal with multiple faults |
| Assessment | 4 | Pre-Test, Practice, Post-Test (from the 8-question `QZ` bank) and the Final Challenge |

That is 28 activities, and the Home page keeps count of how many you have finished.

## The simulator

Every simulator activity is one entry in the `PG` table:

| Key | Meaning |
|---|---|
| `tray: 1` | show the parts tray, for build mode |
| `probe` | show a meter and let the student tap parts to measure them |
| `goal` | a function that returns `true` when the challenge is complete |
| `ask` | a question the student answers with a number |
| `dx` | show the diagnosis dropdown, to find the fault |
| `spec` | a target board to copy |

One engine therefore gives many activities. Drag parts into the slots, tap a part to change it (a
switch toggles, a resistor cycles through 100, 220, 470 and 1000 ohm), and drag it off the board to
remove it. Mouse, touch and pen all share the same pointer-event code.

## The physics

`solve()` is the heart of the simulator. It works in four steps:

1. Add the series resistances. Any open part (a switch that is off, a failed part) opens the loop.
2. Combine the parallel legs with `1/Rp = 1/R1 + 1/R2 + ...`. An open leg is skipped; a wire leg
   shorts the group.
3. Total resistance `Rt = rs + Rp`, then Ohm's law `I = V / R` with a 9 V battery.
4. Work out the voltage, current and power of every part, so the meters and the bulbs can use them.

Units are mA, V and mW (V x mA). A bulb is 100 ohm and counts as lit once its power passes 20 mW.

## Progress

Finished pages and test scores are saved in the browser with `localStorage`, under the key
`circuitsim-structure`, so they survive a refresh. Clearing your browser data clears your progress.

## Extras

- Responsive phone layout: the two-column grids become one column on small screens.
- Dark mode that follows the system setting.

## Learning the code

See [STUDY_GUIDE.md](STUDY_GUIDE.md) for the suggested reading order, the concepts involved and
practice exercises.
