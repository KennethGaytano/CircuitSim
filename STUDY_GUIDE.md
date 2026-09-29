# CircuitSim study guide

## How to run it
Open `index.html` by double-clicking it, or use the Live Server extension in VS Code.
There is nothing to install.

## Files
| File | What it does |
|---|---|
| `index.html` | The three pages (Home, Simulator, My progress) and the SVG breadboard |
| `css/style.css` | Colors, layout, dark mode, phone layout |
| `js/app.js` | All the behavior. Sections are numbered 1 to 9 |

## Suggested reading order
1. `index.html`: find the three `<section class="v">` pages. Only one has the class `on`.
2. `css/style.css`: read sections 1 to 5. Notice the CSS variables in `:root`.
3. `js/app.js` sections 1 to 3: constants, challenges, and the state object `S`.
4. Section 5 (`solve`): this is the electronics logic. Follow it with pen and paper.
5. Section 4 and `draw()`: see how state becomes a picture.
6. Section 7: drag and drop with pointer events.

## Concepts to learn
- State plus render: change `S`, then call `draw()`.
- SVG: drawing shapes with code (`<rect>`, `<circle>`, `<path>`, `transform="translate(x y)"`).
- Pointer events: `pointerdown`, `pointermove`, `pointerup`.
- Event delegation: one click listener for many buttons.
- `localStorage`: saving progress in the browser.
- Ohm's law: current = voltage / resistance.

## Exercises (easy to hard)
1. Change the accent color in `:root` and refresh.
2. Add a `2200` ohm resistor value to `RV` and `BANDS`.
3. Change the LED drop from 2 V to 3 V in `solve()` and in the Analysis challenge text.
4. Add a fourth challenge to `CH` (for example: light the LED with a 6 V battery).
5. Add a fifth slot to the breadboard (you will need a new slot position in `SX`, the loops that use `4`, and new SVG lines).
6. Add a "Clear progress" button on the My progress page.
7. Add a second LED type (green) with a different voltage drop.
