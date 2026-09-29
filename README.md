# CircuitSim

A breadboard circuit simulator for first-year Industrial Art students. Build a
circuit from resistors, LEDs, switches and wires, then read the current and see
whether the LED lights — without touching a live wire.

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## How to run it

Open `index.html` by double-clicking it, or use the Live Server extension in VS Code.

## Files

| File | What it does |
|---|---|
| `index.html` | The three pages (Home, Simulator, My progress) and the SVG breadboard |
| `css/style.css` | Colors, layout, dark mode, phone layout |
| `js/app.js` | All the behavior. Sections are numbered 1 to 9 |
| `STUDY_GUIDE.md` | Reading order, key concepts and exercises for learning the code |

## What it does

- **Three challenges**, one per skill: Construction, Analysis, Troubleshooting.
- **Drag parts** from the tray into the four breadboard slots. Tap a part to flip an
  LED, toggle a switch or change a resistor; drag it off the board to remove it.
- **Live readings.** `solve()` applies Ohm's law to the current board and shows the
  current in mA, the LED state, and a plain-language explanation of any fault.
- **Analysis mode** asks the student to predict the current before checking the answer.
- **Progress is saved** in the browser with `localStorage`, so it survives a refresh.
- **Responsive** phone layout and a dark mode that follows the system setting.

## How the code is organized

State, then render: change the state object `S`, then call `draw()` to rebuild the
picture. `solve()` is the electronics logic. See [`STUDY_GUIDE.md`](STUDY_GUIDE.md) for
the suggested reading order and practice exercises.

## Livesite:

https://kennethgaytano.github.io/CircuitSim/
