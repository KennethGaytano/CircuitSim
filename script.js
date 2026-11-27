const T = (n, s, dy, col, lab) => ({ n, s, dy, col, lab });
const A = () => [T("a", "l", 0, "#888", "A"), T("b", "r", 0, "#888", "B")];
const S = (id, y) => ({
  id,
  type: "sw",
  name: "Switch",
  y,
  terms: A(),
  swap: ["a", "b"],
});
const PB = (id, y) => ({
  id,
  type: "button",
  name: "Push button",
  y,
  terms: A(),
  swap: ["a", "b"],
});
const L = (id, y, name) => ({
  id,
  type: "lamp",
  name,
  y,
  terms: A(),
  swap: ["a", "b"],
});
const SRC = (y) => ({
  id: "src",
  type: "src",
  name: "Power source",
  y,
  terms: [T("l", "l", 0, "#d32f2f", "L"), T("n", "r", 0, "#2563eb", "N")],
});
const BAT = (y) => ({
  id: "bat",
  type: "bat",
  name: "Battery 9V",
  y,
  terms: [T("p", "l", 0, "#d32f2f", "+"), T("n", "r", 0, "#555", "−")],
});
const S3 = (id, y, name) => ({
  id,
  type: "sw3",
  name,
  y,
  h: 90,
  terms: [
    T("c", "l", 0, "#d32f2f", "COM"),
    T("a", "r", -25, "#888", "A"),
    T("b", "r", 25, "#888", "B"),
  ],
  swap: ["a", "b"],
});
const ACTS = [
  {
    name: "1. Series",
    kind: "series",
    title: "Series circuit",
    goal: "Connect the battery, switch and two lamps in one single loop.",
    steps: [
      "Battery (+) to the switch",
      "Switch to Lamp 1",
      "Lamp 1 to Lamp 2",
      "Lamp 2 to Battery (−)",
    ],
    tip: "In a series circuit the current has only one path, so every part is in line.",
    comps: [
      BAT(50),
      S("sw", 140),
      L("l1", 230, "Lamp 1"),
      L("l2", 320, "Lamp 2"),
    ],
    nets: [
      ["bat.p", "sw.a"],
      ["sw.b", "l1.a"],
      ["l1.b", "l2.a"],
      ["l2.b", "bat.n"],
    ],
  },
  {
    name: "2. Parallel",
    kind: "parallel",
    title: "Parallel circuit",
    goal: "Connect two lamps side by side so each has its own path to the battery.",
    steps: [
      "Battery (+) to the switch",
      "Switch B to terminal A of both lamps",
      "Terminal B of both lamps to Battery (−)",
    ],
    tip: "In a parallel circuit every lamp gets the full supply voltage.",
    comps: [
      BAT(50),
      S("sw", 140),
      L("l1", 230, "Lamp 1"),
      L("l2", 320, "Lamp 2"),
    ],
    nets: [
      ["bat.p", "sw.a"],
      ["sw.b", "l1.a", "l2.a"],
      ["l1.b", "l2.b", "bat.n"],
    ],
  },
  {
    name: "3. Single switch",
    kind: "single",
    title: "Single-pole switch wiring",
    goal: "Wire one switch to control one lamp from a live and neutral supply.",
    steps: [
      "Live (L) to the switch",
      "Switch to the lamp",
      "Lamp to Neutral (N)",
    ],
    tip: "The switch always goes on the live wire, never on the neutral.",
    comps: [SRC(60), S("sw", 170), L("lamp", 280, "Lamp")],
    nets: [
      ["src.l", "sw.a"],
      ["sw.b", "lamp.a"],
      ["lamp.b", "src.n"],
    ],
  },
  {
    name: "4. Three-way",
    kind: "threeway",
    title: "Three-way switch wiring",
    goal: "Wire two switches so either one can turn the same lamp on and off.",
    steps: [
      "Live (L) to COM of Switch 1",
      "Switch 1 A to Switch 2 A, and Switch 1 B to Switch 2 B (the travelers)",
      "COM of Switch 2 to the lamp",
      "Lamp to Neutral (N)",
    ],
    tip: "Tap each switch to change its position. With A wired to A and B to B, the lamp is on when both switches are in the same position.",
    comps: [
      SRC(45),
      S3("s1", 135, "Switch 1"),
      S3("s2", 245, "Switch 2"),
      L("lamp", 340, "Lamp"),
    ],
    nets: [
      ["src.l", "s1.c"],
      ["s1.a", "s2.a"],
      ["s1.b", "s2.b"],
      ["s2.c", "lamp.a"],
      ["lamp.b", "src.n"],
    ],
  },
  {
    name: "5. House wiring",
    kind: "house",
    title: "Mini house wiring layout",
    goal: "Wire a breaker, a switch, a lamp and an outlet from one supply.",
    steps: [
      "Live (L) to Breaker IN",
      "Breaker OUT to the switch and to the outlet L",
      "Switch to the lamp",
      "Lamp and outlet N to Neutral (N)",
    ],
    tip: "The breaker protects everything after it. The outlet is always powered when the breaker is on; the lamp needs the switch too.",
    comps: [
      SRC(45),
      {
        id: "brk",
        type: "brk",
        name: "Breaker",
        y: 120,
        terms: [
          T("i", "l", 0, "#d32f2f", "IN"),
          T("o", "r", 0, "#d32f2f", "OUT"),
        ],
      },
      S("sw", 195),
      L("lamp", 270, "Lamp"),
      {
        id: "out",
        type: "out",
        name: "Outlet",
        y: 345,
        terms: [T("l", "l", 0, "#d32f2f", "L"), T("n", "r", 0, "#2563eb", "N")],
      },
    ],
    nets: [
      ["src.l", "brk.i"],
      ["brk.o", "sw.a", "out.l"],
      ["sw.b", "lamp.a"],
      ["lamp.b", "out.n", "src.n"],
    ],
  },
  {
    name: "6. Push button",
    kind: "button",
    title: "Momentary push-button control",
    goal: "Wire a push button so the lamp lights only while you press it.",
    steps: [
      "Live (L) to the push button",
      "Push button to the lamp",
      "Lamp to Neutral (N)",
    ],
    tip: "A momentary button closes the circuit only while pressed.",
    comps: [SRC(60), PB("btn", 170), L("lamp", 280, "Lamp")],
    nets: [
      ["src.l", "btn.a"],
      ["btn.b", "lamp.a"],
      ["lamp.b", "src.n"],
    ],
  },
  {
    name: "7. Fault finding",
    kind: "fault",
    title: "Find and fix the wiring fault",
    goal: "This lamp circuit has a wiring fault. Repair the connections so the switch controls the lamp.",
    steps: [
      "Inspect the live and neutral paths",
      "Remove or add wires to match the intended circuit",
      "Test the switch after the wiring is repaired",
    ],
    tip: "The switch belongs on the live side; the lamp must return to neutral.",
    comps: [SRC(60), S("sw", 170), L("lamp", 280, "Lamp")],
    nets: [
      ["src.l", "sw.a"],
      ["sw.b", "lamp.a"],
      ["lamp.b", "src.n"],
    ],
    initial: [
      ["src.l", "sw.a"],
      ["sw.b", "lamp.a"],
      ["lamp.b", "src.l"],
    ],
  },
];
// Definitions, in the same order as ACTS
const DEFS = [
  {
    text: "A series circuit is a circuit whose parts are connected end to end, so the current has only one path to follow.",
    terms: [
      ["Current", "The same current flows through every part."],
      ["Voltage", "The supply voltage is divided among the lamps."],
      ["If one lamp fails", "The path is broken, so all the lamps go off."],
    ],
  },
  {
    text: "A parallel circuit is a circuit whose parts are connected across the same two points, so the current has two or more paths, called branches.",
    terms: [
      ["Current", "The total current is the sum of the branch currents."],
      ["Voltage", "Each branch gets the same voltage."],
      ["If one lamp fails", "The lamps in the other branches stay on."],
    ],
  },
  {
    text: "A single-pole switch is a switch that opens or closes one conductor to control a load, such as a lamp, from one location.",
    terms: [
      ["Open circuit (OFF)", "The path is broken and no current flows."],
      ["Closed circuit (ON)", "The path is complete and current flows."],
      ["Live (L)", "The wire that carries voltage from the supply."],
      ["Neutral (N)", "The wire that returns current to the supply."],
    ],
  },
  {
    text: "Three-way switching uses two three-way switches to control the same load from two different locations, such as both ends of a staircase.",
    terms: [
      [
        "Three-way switch",
        "A switch with one common terminal and two traveler terminals.",
      ],
      [
        "Common (COM)",
        "The terminal that connects to the live wire or to the lamp.",
      ],
      ["Travelers", "The two wires that run between the two switches."],
    ],
  },
  {
    text: "House wiring is the system of wires and devices that safely carries electricity from the supply to the lights, switches and outlets in a home.",
    terms: [
      [
        "Circuit breaker",
        "A protective device that cuts the power when there is an overload or a short circuit.",
      ],
      ["Outlet", "A socket where appliances are plugged in."],
      ["Load", "Any device that uses electricity, such as a lamp."],
      [
        "Safety note",
        "This simplified model omits grounding and other required protections. Never use it as instructions for real electrical work.",
      ],
    ],
  },
  {
    text: "A push button is a momentary switch: it completes a circuit while pressed and returns to its open state when released.",
    terms: [
      ["Momentary action", "The button does not stay on after you release it."],
      [
        "Circuit path",
        "Pressing the button closes the live side of the lamp circuit.",
      ],
    ],
  },
  {
    text: "Fault finding means tracing a circuit to find and correct a connection that prevents it from working as intended.",
    terms: [
      [
        "Trace the path",
        "Follow live through the control and load, then back to neutral.",
      ],
      [
        "Test safely",
        "This is a simplified low-voltage model, not real electrical work.",
      ],
    ],
  },
  {
    text: "Use the sandbox to explore how wires, switches, and lamps interact in a simplified battery circuit.",
    terms: [
      [
        "No pass or fail",
        "Experiment freely; the activity checker is disabled.",
      ],
      [
        "Safety",
        "The sandbox models low-voltage circuits only and is not a guide to household wiring.",
      ],
    ],
  },
];
const SANDBOX = {
  name: "Sandbox",
  kind: "sandbox",
  title: "Free-build sandbox",
  goal: "Experiment with a small kit of components. There is no pass or fail goal.",
  steps: [
    "Connect any terminals to explore circuit paths.",
    "Tap the switch or breaker after wiring.",
    "Reset the board whenever you want to try again.",
  ],
  tip: "This is a simplified, low-voltage learning model.",
  comps: [
    BAT(55),
    S("sw", 145),
    L("l1", 235, "Lamp 1"),
    L("l2", 325, "Lamp 2"),
  ],
  nets: [],
};
ACTS.push(SANDBOX);
const activityCount = () => ACTS.filter((a) => a.kind !== "sandbox").length;
const SAVE_KEY = "circuitsim-progress-v1";
const svg = document.getElementById("svg"),
  CX = 180,
  W = 160;
let cur = 0,
  wires = [],
  sel = null,
  drag = null,
  showGuide = false,
  done = false,
  state = {},
  solved = new Set(),
  snapshots = {},
  started = false,
  tutorialStep = 0;
const $ = (id) => document.getElementById(id);
const comp = (id) => ACTS[cur].comps.find((c) => c.id === id);
function pos(id) {
  const [c, t] = id.split(".");
  const co = comp(c),
    tm = co.terms.find((x) => x.n === t);
  return { x: CX + (tm.s === "l" ? -W / 2 : W / 2), y: co.y + tm.dy, s: tm.s };
}
function path(a, b) {
  const p = pos(a),
    q = pos(b),
    d1 = p.s === "l" ? -55 : 55,
    d2 = q.s === "l" ? -55 : 55;
  return `M${p.x} ${p.y}C${p.x + d1} ${p.y} ${q.x + d2} ${q.y} ${q.x} ${q.y}`;
}
function nameOf(id) {
  const [c, t] = id.split("."),
    co = comp(c);
  return co.name + " " + co.terms.find((x) => x.n === t).lab;
}
// Circuit model: wires always connect; switches and breakers connect according to their position
const toggles = () =>
  ACTS[cur].comps.filter((c) =>
    ["sw", "sw3", "brk", "button"].includes(c.type),
  );
function conn(st) {
  const par = {},
    f = (x) =>
      par[x] === undefined || par[x] === x ? x : (par[x] = f(par[x])),
    join = (a, b) => {
      par[f(a)] = f(b);
    };
  wires.forEach(([a, b]) => join(a, b));
  if (st)
    toggles().forEach((c) => {
      const t = (n) => c.id + "." + n;
      if (c.type === "sw3") join(t("c"), t(st[c.id] ? "b" : "a"));
      else if (st[c.id])
        join(...(c.type === "brk" ? [t("i"), t("o")] : [t("a"), t("b")]));
    });
  return f;
}
function allStates() {
  const t = toggles();
  return Array.from({ length: 1 << t.length }, (_, m) =>
    Object.fromEntries(t.map((c, i) => [c.id, !!((m >> i) & 1)])),
  );
}
function supply() {
  const c = ACTS[cur].comps[0];
  return [c.id + (c.type === "bat" ? ".p" : ".l"), c.id + ".n"];
}
// Short circuit: any switch position joins the two supply terminals with no load between them
function shorted() {
  const [h, r] = supply();
  return allStates().some((st) => {
    const f = conn(st);
    return f(h) === f(r);
  });
}
function across(f, id, h, r) {
  const a = f(id + ".a"),
    b = f(id + ".b");
  return (a === f(h) && b === f(r)) || (b === f(h) && a === f(r));
}
// One loop through every part, in any order
function oneLoop() {
  const f = conn(),
    cs = ACTS[cur].comps,
    ids = cs.flatMap((c) => c.terms.map((t) => c.id + "." + t.n));
  const mate = (id) => {
    const m = ids.filter((x) => x !== id && f(x) === f(id));
    return m.length === 1 ? m[0] : null;
  };
  let at = cs[0].id + "." + cs[0].terms[0].n;
  const seen = new Set();
  for (let i = 0; i < cs.length; i++) {
    const m = mate(at);
    if (!m) return false;
    const [c, t] = m.split(".");
    if (seen.has(c)) return false;
    seen.add(c);
    at = c + "." + comp(c).terms.find((x) => x.n !== t).n;
  }
  return seen.size === cs.length;
}
// Judge a circuit by what it does, so every electrically correct wiring is accepted
function groupsMatch(nets) {
  const f = conn();
  const all = ACTS[cur].comps.flatMap((c) =>
    c.terms.map((t) => c.id + "." + t.n),
  );
  return (
    nets.every((group) => group.every((x) => f(x) === f(group[0]))) &&
    all.every((x) => {
      const group = nets.find((g) => g.includes(x));
      return group
        ? all.filter((y) => f(y) === f(x)).every((y) => group.includes(y))
        : all.filter((y) => f(y) === f(x)).length === 1;
    })
  );
}
function works(h, r) {
  const kind = ACTS[cur].kind,
    states = allStates();
  if (kind === "sandbox") return false;
  if (kind === "fault") return groupsMatch(ACTS[cur].nets);
  if (kind === "series") return oneLoop();
  if (kind === "parallel")
    return states.every((st) => {
      const f = conn(st);
      return across(f, "l1", h, r) === st.sw && across(f, "l2", h, r) === st.sw;
    });
  // Mains circuits: one lamp terminal stays on neutral and the other is live only while the lamp is on
  return ["a", "b"].some((n) => {
    const other = "lamp." + (n === "a" ? "b" : "a"),
      on = [];
    const good = states.every((st) => {
      const f = conn(st),
        lamp = f(other) === f(h);
      on.push(lamp);
      if (f("lamp." + n) !== f(r)) return false;
      if (kind === "single") return lamp === st.sw;
      if (kind === "button") return lamp === st.btn;
      if (kind === "house")
        return (
          lamp === (st.brk && st.sw) &&
          (f("out.l") === f(h)) === st.brk &&
          f("out.n") === f(r)
        );
      return true;
    });
    if (!good) return false;
    if (kind === "threeway")
      return on[0] !== on[1] && on[0] !== on[2] && on[0] === on[3];
    if (kind === "house") {
      const f = conn();
      return f("src.l") === f("brk.i");
    }
    return true;
  });
}
function check() {
  return ACTS[cur].kind === "sandbox"
    ? false
    : !shorted() && works(...supply());
}
function lit() {
  const kind = ACTS[cur].kind;
  if (!done && kind !== "sandbox") return false;
  if (kind === "series") return !!state.sw;
  const st = Object.fromEntries(toggles().map((c) => [c.id, !!state[c.id]]));
  if (kind === "sandbox")
    return ["l1", "l2"].some((id) => across(conn(st), id, ...supply()));
  return across(conn(st), kind === "parallel" ? "l1" : "lamp", ...supply());
}
function doneText() {
  const kind = ACTS[cur].kind,
    two = kind === "series" || kind === "parallel";
  if (kind === "house") {
    if (!state.brk)
      return state.sw
        ? "Now turn on the breaker."
        : "Circuit complete. Turn on the breaker and the switch.";
    return state.sw
      ? "The lamp is on and the outlet is powered."
      : "The outlet is powered. Now turn on the switch.";
  }
  if (kind === "threeway")
    return lit()
      ? "The lamp is on. Try either switch."
      : "The lamp is off. Tap either switch to turn it on.";
  if (lit())
    return two
      ? "The lamps are on. Try the switch."
      : "The lamp is on. Try the switch.";
  return "Circuit complete. Tap the switch to turn it on.";
}
function problemText() {
  const [h, r] = supply(),
    kind = ACTS[cur].kind;
  if (kind === "fault")
    return "Trace the path from Live through the switch and lamp to Neutral. Remove the faulty connection, then finish the return path.";
  if (shorted())
    return `Short circuit: your wires join ${kind === "series" || kind === "parallel" ? "battery + and −" : "Live and Neutral"} with no lamp between them. Remove a wire.`;
  if ((kind === "single" || kind === "threeway") && works(r, h))
    return "The lamp would work, but switching is on the neutral side. Put it on the live wire.";
  if (kind === "house") {
    const f = conn({ brk: true, sw: true });
    if (across(f, "lamp", h, r) || across(f, "lamp", r, h))
      return "Check the safety order: Live to Breaker IN, switch on the live side, outlet L to live and N to neutral.";
  }
  return "";
}
function explanationText() {
  const a = ACTS[cur];
  if (a.kind === "sandbox")
    return lit()
      ? "A closed path runs from battery + through a lamp and back to battery −. Try opening or closing the switch."
      : "Connect a source, a lamp, and a return path to explore how a complete circuit behaves.";
  if (a.kind === "fault" && !done) return problemText();
  if (!done)
    return shorted()
      ? "The source terminals are connected by wires without a load in the path. Remove a wire to break the short."
      : "The circuit is not complete yet. Follow the supply through the control and lamp, then back to the other supply terminal.";
  if (a.kind === "series")
    return "Current has one path through both lamps. Opening the switch breaks that path, so both lamps go out.";
  if (a.kind === "parallel")
    return "Each lamp has its own branch across the battery, so both receive the supply voltage.";
  if (a.kind === "threeway")
    return "The two traveler wires let either switch change whether the path to the lamp is complete.";
  if (a.kind === "house")
    return "The breaker protects the downstream circuit; the switch controls the lamp, while the outlet is powered when the breaker is on. This model omits grounding and other required protections. It is not instructions for real wiring.";
  if (a.kind === "button")
    return state.btn
      ? "While pressed, the button closes the live path and current reaches the lamp. Releasing it opens the path."
      : "This is a momentary control: hold the button to light the lamp; it should turn off when released.";
  return "The connections now carry current from live through the switch and lamp to neutral. The switch controls the lamp.";
}
function persist() {
  try {
    if (cur >= 0 && ACTS[cur])
      snapshots[cur] = { wires: wires.map((w) => [...w]), state: { ...state } };
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        version: 1,
        current: cur,
        started,
        solved: [...solved],
        snapshots,
      }),
    );
  } catch (_) {}
}
function restore() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (!d || d.version !== 1) return;
    if (
      Number.isInteger(d.current) &&
      d.current >= 0 &&
      d.current < ACTS.length
    )
      cur = d.current;
    started = !!d.started;
    if (Array.isArray(d.solved))
      solved = new Set(
        d.solved.filter(
          (i) => Number.isInteger(i) && i >= 0 && i < activityCount(),
        ),
      );
    if (d.snapshots && typeof d.snapshots === "object") snapshots = d.snapshots;
  } catch (_) {}
}
function clearProgress() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (_) {}
  snapshots = {};
  solved.clear();
  started = false;
  load(0, true);
  openMenu();
}
function explain() {
  $("explanation").textContent = explanationText();
}
function drawComp(c) {
  const h = c.h || 50,
    x = CX - W / 2,
    y = c.y - h / 2,
    on = lit(),
    tog = ["sw", "sw3", "brk", "button"].includes(c.type);
  let s = `<g${tog ? ` class="tog" data-tog="${c.id}" tabindex="0" role="button" aria-label="${c.name}, ${c.type === "sw3" ? "position " + (state[c.id] ? "B" : "A") : state[c.id] ? "on" : "off"}"` : ""}><rect class="box" x="${x}" y="${y}" width="${W}" height="${h}" rx="8"/><text class="nm" x="${CX}" y="${y + 14}">${c.name}</text>`;
  if (c.type === "lamp")
    s +=
      `<circle cx="${CX}" cy="${c.y + 8}" r="11" fill="${on ? "var(--glow)" : "none"}" stroke="var(--wire)" stroke-width="1.5"/><path d="M${CX - 6} ${c.y + 14}L${CX + 6} ${c.y + 2}M${CX - 6} ${c.y + 2}L${CX + 6} ${c.y + 14}" stroke="var(--wire)" stroke-width="1.2"/>` +
      (on
        ? `<circle cx="${CX}" cy="${c.y + 8}" r="19" fill="var(--glow)" opacity=".3"/>`
        : "");
  else if (c.type === "sw" || c.type === "brk")
    s += `<text class="st" x="${CX}" y="${c.y + 14}">${state[c.id] ? "ON" : "OFF"}</text>`;
  else if (c.type === "button")
    s += `<text class="st" x="${CX}" y="${c.y + 14}">${state[c.id] ? "PRESSED" : "PRESS"}</text>`;
  else if (c.type === "sw3")
    s += `<text class="st" x="${CX}" y="${c.y + 22}">Pos ${state[c.id] ? "B" : "A"}</text>`;
  else if (c.type === "out") {
    const pw = done && state.brk;
    s += `<text class="st" x="${CX}" y="${c.y + 14}" style="${pw ? "fill:var(--ok)" : ""}">${pw ? "POWERED" : "no power"}</text>`;
  } else if (c.type === "src")
    s += `<text class="st" x="${CX}" y="${c.y + 14}">AC supply</text>`;
  s += "</g>";
  c.terms.forEach((t) => {
    const p = pos(c.id + "." + t.n),
      sel1 = sel === c.id + "." + t.n;
    s += `<g class="term" data-t="${c.id}.${t.n}" tabindex="0" role="button" aria-pressed="${sel1}" aria-label="${c.name} terminal ${t.lab}"><circle class="area" cx="${p.x}" cy="${p.y}" r="25" fill="transparent"/><circle class="dot" cx="${p.x}" cy="${p.y}" r="${sel1 ? 11 : 8}" fill="${t.col}" stroke="${sel1 ? "var(--acc)" : "var(--card)"}" stroke-width="2.5"/><text class="tl" x="${p.x + (t.s === "l" ? 12 : -12)}" y="${p.y + (t.dy ? 3 : -9)}" text-anchor="${t.s === "l" ? "start" : "end"}">${t.lab}</text></g>`;
  });
  return s;
}
function render() {
  const A = ACTS[cur];
  let s = "";
  if (showGuide)
    A.nets.forEach((n) => {
      for (let i = 0; i < n.length - 1; i++)
        s += `<path class="guide" d="${path(n[i], n[i + 1])}"/>`;
    });
  const on = lit();
  wires.forEach(([a, b], i) => {
    s += `<path class="wire${on ? " on" : ""}" d="${path(a, b)}"/><path class="hit" data-w="${i}" d="${path(a, b)}" tabindex="0" role="button" aria-label="Remove wire from ${nameOf(a)} to ${nameOf(b)}"/>`;
  });
  s +=
    A.comps.map(drawComp).join("") +
    '<path id="tmp" class="wire" style="opacity:.5" d=""/>';
  const f = document.activeElement,
    k =
      f && svg.contains(f)
        ? ["data-t", "data-tog", "data-w"].find((n) => f.hasAttribute(n))
        : null,
    v = k && f.getAttribute(k);
  svg.innerHTML = s;
  if (k) {
    const el = svg.querySelector(`[${k}="${v}"]`) || svg.querySelector(".term");
    el.focus({ preventScroll: true });
  }
  const st = $("status");
  if (done) {
    st.className = "ok";
    st.textContent = doneText();
  } else if (A.kind === "sandbox") {
    st.className = "";
    st.textContent =
      "Sandbox: connect any terminals. Press a switch to explore the circuit.";
  } else {
    const need = A.nets.reduce((n, x) => n + x.length - 1, 0),
      full = wires.length >= need,
      short = shorted(),
      problem = short || full ? problemText() : "";
    st.className = short || full ? "bad" : "";
    st.textContent =
      problem ||
      (full
        ? "Something is wired wrong. Tap a wire to remove it, or show the guide."
        : sel
          ? "Now tap another terminal to connect it."
          : wires.length
            ? `Wires placed: ${wires.length} of ${need}`
            : "Tap two terminals to connect them.");
  }
  $("guide").textContent = showGuide ? "Hide guide" : "Show guide";
  $("next").hidden = !(done && cur < ACTS.length - 1);
  if (done && A.kind !== "sandbox") solved.add(cur);
  [...$("tabs").children].forEach((b, i) => {
    b.setAttribute("aria-current", i === cur);
    b.classList.toggle("done", solved.has(i));
    b.setAttribute("aria-label", a_label(i));
  });
  if (done && $("explanation"))
    $("explanation").textContent = explanationText();
  persist();
}
function a_label(i) {
  return ACTS[i].title + (solved.has(i) ? ", completed" : "");
}
function update() {
  done = check();
  render();
}
function load(i, reset = false) {
  cur = i;
  const saved = !reset && snapshots[i];
  wires =
    saved && Array.isArray(saved.wires)
      ? saved.wires
      : (ACTS[i].initial || []).map((w) => [...w]);
  sel = null;
  state =
    saved && saved.state && typeof saved.state === "object" ? saved.state : {};
  done = false;
  showGuide = false;
  const A = ACTS[i];
  $("title").textContent = A.title;
  $("goal").textContent = A.goal;
  $("tip").textContent = "Tip: " + A.tip;
  $("steps").innerHTML = A.steps.map((x) => `<li>${x}</li>`).join("");
  $("explanation").textContent = "";
  $("interactionHelp").textContent =
    A.kind === "button"
      ? "How to wire: drag or tap between terminals. When the circuit is complete, press and hold the button to light the lamp; release it to turn the lamp off. Use Tab and Enter on a keyboard."
      : A.kind === "sandbox"
        ? "How to wire: drag or tap between terminals. Tap a wire to remove it. In this sandbox, switches toggle freely and there is no pass or fail goal."
        : "How to wire: drag from one terminal (circle) to another, or tap one then the other. Tap a wire to remove it. When the circuit is complete, tap the switch or breaker to turn it on. On a keyboard, use Tab and Enter.";
  const ys = A.comps.map((c) => c.y + (c.h || 50) / 2);
  svg.setAttribute("viewBox", `0 0 360 ${Math.max(...ys) + 8}`);
  done = check();
  render();
}
function pt(e) {
  const r = svg.getBoundingClientRect(),
    v = svg.viewBox.baseVal;
  return {
    x: ((e.clientX - r.left) * v.width) / r.width,
    y: ((e.clientY - r.top) * v.height) / r.height,
  };
}
function addWire(a, b) {
  if (a === b) return;
  if (
    wires.some((w) => (w[0] === a && w[1] === b) || (w[0] === b && w[1] === a))
  )
    return;
  wires.push([a, b]);
}
let pressedButton = false;
svg.addEventListener("pointerdown", (e) => {
  const g = e.target.closest('[data-tog="btn"]');
  if (g && done) {
    e.preventDefault();
    state.btn = true;
    pressedButton = true;
    render();
    return;
  }
  const t = e.target.closest(".term");
  if (!t) return;
  e.preventDefault();
  drag = { id: t.dataset.t, moved: false };
});
svg.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const p = pt(e),
    a = pos(drag.id),
    tmp = $("tmp");
  drag.moved = true;
  if (tmp) tmp.setAttribute("d", `M${a.x} ${a.y}L${p.x} ${p.y}`);
});
window.addEventListener("pointerup", (e) => {
  if (pressedButton) {
    pressedButton = false;
    state.btn = false;
    render();
  }
  if (!drag) return;
  const d = drag;
  drag = null;
  const el = document.elementFromPoint(e.clientX, e.clientY),
    t = el && el.closest && el.closest(".term"),
    id = t && svg.contains(t) ? t.dataset.t : null;
  if (id && id !== d.id) {
    addWire(d.id, id);
    sel = null;
  } else if (id === d.id) {
    if (sel && sel !== id) {
      addWire(sel, id);
      sel = null;
    } else sel = sel === id ? null : id;
  } else sel = null;
  update();
});
svg.addEventListener("click", (e) => {
  const w = e.target.closest("[data-w]");
  if (w) {
    wires.splice(+w.dataset.w, 1);
    sel = null;
    update();
    return;
  }
  const g = e.target.closest("[data-tog]");
  if (g && g.dataset.tog === "btn") return;
  if (g && (done || ACTS[cur].kind === "sandbox")) {
    state[g.dataset.tog] = !state[g.dataset.tog];
    render();
  } else if (g && !done && !shorted()) {
    $("status").className = "bad";
    $("status").textContent = "Finish the wiring first, then switch it on.";
  }
});
svg.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const el = e.target.closest(".term,.hit,.tog");
  if (!el) return;
  e.preventDefault();
  if (e.repeat) return;
  if (el.dataset.tog === "btn" && done) {
    state.btn = true;
    render();
    return;
  }
  if (el.dataset.t) {
    const id = el.dataset.t;
    if (sel && sel !== id) {
      addWire(sel, id);
      sel = null;
    } else sel = sel === id ? null : id;
    update();
  } else el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
});
svg.addEventListener("keyup", (e) => {
  if (
    (e.key === "Enter" || e.key === " ") &&
    ACTS[cur].kind === "button" &&
    state.btn
  ) {
    state.btn = false;
    render();
  }
});
// A finger on a terminal draws a wire; anywhere else on the board scrolls the page
svg.addEventListener(
  "touchstart",
  (e) => {
    if (e.target.closest(".term")) e.preventDefault();
  },
  { passive: false },
);
window.addEventListener("pointercancel", () => {
  if (drag) {
    drag = null;
    render();
  }
});
$("how").open = matchMedia("(min-width:52rem)").matches;
$("undo").onclick = () => {
  wires.pop();
  sel = null;
  update();
};
$("reset").onclick = () => load(cur, true);
$("guide").onclick = () => {
  showGuide = !showGuide;
  render();
};
$("explain").onclick = explain;
$("next").onclick = () => load(cur + 1);
$("defBtn").onclick = () => {
  const d = DEFS[cur];
  $("defTitle").textContent = ACTS[cur].title;
  $("defText").textContent = d.text;
  $("defTerms").innerHTML = d.terms
    .map(([t, m]) => `<dt>${t}</dt><dd>${m}</dd>`)
    .join("");
  $("def").showModal();
  $("def").scrollTop = 0;
};
$("defClose").onclick = () => $("def").close();
$("def").addEventListener("click", (e) => {
  if (e.target === $("def")) $("def").close();
});
ACTS.forEach((a, i) => {
  const b = document.createElement("button");
  const [n, l] = a.name.split(". "),
    label = l || a.title;
  b.innerHTML = `<b>${n}</b><small>${label.replace(/ (switch|wiring)$/, "").replace("Three-way", "3-way")}</small>`;
  b.setAttribute("aria-label", a.title);
  b.onclick = () => load(i);
  $("tabs").appendChild(b);
});
// Activity symbols
const ICONS = [
  '<path d="M5 8H27V24H5Z"/><circle cx="12" cy="8" r="3" fill="var(--card)"/><circle cx="20" cy="8" r="3" fill="var(--card)"/><path d="M14 20V28M18 22V26" stroke-width="3"/>',
  '<path d="M6 5V27M26 5V27M6 10H26M6 22H26"/><circle cx="16" cy="10" r="3" fill="var(--card)"/><circle cx="16" cy="22" r="3" fill="var(--card)"/>',
  '<path d="M2 22H6M26 22H30M6 22L22 10"/><circle cx="6" cy="22" r="2.5" fill="var(--card)"/><circle cx="26" cy="22" r="2.5" fill="var(--card)"/>',
  '<path d="M2 16H6M26 8H30M26 24H30M6 16L22 9"/><circle cx="6" cy="16" r="2.5" fill="var(--card)"/><circle cx="26" cy="8" r="2.5" fill="var(--card)"/><circle cx="26" cy="24" r="2.5" fill="var(--card)"/>',
  '<path d="M4 16L16 5L28 16M8 14V27H24V14"/><path d="M17 15L13 22H18L15 27"/>',
  '<path d="M5 16H10M22 16H27M10 16V12A6 6 0 0 1 22 12V16"/><rect x="10" y="16" width="12" height="9" rx="3"/><path d="M16 19V22"/>',
  '<path d="M4 16H11M21 16H28M11 16L14 13M18 19L21 16"/><circle cx="16" cy="15" r="8"/><path d="M22 21L28 27"/><path d="M13 15H15M17 15H19"/>',
];
const ico = (i) =>
  `<svg class="ico" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[i]}</svg>`;
// Pages: homepage, activity menu, wiring screen
function show(view, focusId) {
  ["home", "menu", "app"].forEach((v) => ($(v).hidden = v !== view));
  window.scrollTo(0, 0);
  if (focusId) $(focusId).focus({ preventScroll: true });
}
function openApp(i) {
  if (i !== cur) load(i);
  started = true;
  persist();
  show("app", "appTitle");
}
function openMenu() {
  [...$("list").children].forEach((li, i) =>
    li.firstChild.classList.toggle("done", solved.has(i)),
  );
  $("progress").textContent = solved.size
    ? `${solved.size} of ${activityCount()} activities completed`
    : "Start with any activity.";
  $("progressDetail").textContent = solved.size
    ? `Completed ${solved.size} of ${activityCount()} activities. ${activityCount() - solved.size} left to explore.`
    : "Your completed activities will appear here and be saved on this device.";
  $("resume").hidden = !started;
  show("menu", "menuTitle");
}
function openSandbox() {
  load(ACTS.findIndex((a) => a.kind === "sandbox"));
  openApp(cur);
}
ACTS.forEach((a, i) => {
  if (a.kind === "sandbox") return;
  const html = `${ico(i)}<div><strong>${i + 1}. ${a.title}</strong><span>${a.goal}</span></div>`;
  const li = document.createElement("li"),
    b = document.createElement("button");
  b.innerHTML = html;
  b.onclick = () => openApp(i);
  li.appendChild(b);
  $("list").appendChild(li);
  if (i < 3) {
    const f = document.createElement("li"),
      fb = document.createElement("button");
    fb.innerHTML = html;
    fb.onclick = () => openApp(i);
    f.appendChild(fb);
    $("feat").appendChild(f);
  }
});
$("start").onclick = openMenu;
$("activitiesLink").onclick = openMenu;
$("exploreActivities").onclick = openMenu;
$("trySimulator").onclick = () => openApp(0);
$("homeSandboxOpen").onclick = openSandbox;
$("homeTutorialOpen").onclick = startTutorial;
$("resume").onclick = () => openApp(cur);
$("menuBtn").onclick = openMenu;
$("homeBtn").onclick = () => show("home", "homeTitle");
function startTutorial() {
  load(0, true);
  openApp(0);
  tutorialStep = 0;
  showTutorialStep();
  $("tutorial").showModal();
}
const tutorialSteps = [
  "Welcome! Connect the battery positive terminal (+) to the switch terminal A.",
  "Now connect switch B to Lamp 1 terminal A.",
  "Connect Lamp 1 terminal B to Lamp 2 terminal A.",
  "Complete the loop by connecting Lamp 2 terminal B to battery negative (−). Then turn on the switch.",
];
function showTutorialStep() {
  $("tutorialText").textContent =
    tutorialSteps[tutorialStep] ||
    "You have built your first series circuit. Try switching it on, then continue exploring!";
  $("tutorialHint").hidden = tutorialStep >= tutorialSteps.length;
}
$("tutorialNext").onclick = () => {
  tutorialStep++;
  if (tutorialStep > tutorialSteps.length) {
    $("tutorial").close();
    return;
  }
  showTutorialStep();
};
$("tutorialHint").onclick = () => {
  $("tutorialText").textContent = "Hint: " + ACTS[0].steps[tutorialStep];
  showGuide = true;
  render();
};
$("tutorialClose").onclick = () => $("tutorial").close();
$("tutorialOpen").onclick = startTutorial;
$("sandboxOpen").onclick = openSandbox;
$("clearProgress").onclick = clearProgress;
restore();
load(cur);
show("home");
