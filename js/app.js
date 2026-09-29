// =====================================================================
// CircuitSim - study version
// Read the file from top to bottom. The sections are numbered.
//
// Big ideas you will see:
//   1. STATE: one object (S) holds what is on the board.
//   2. RENDER: draw() rebuilds the picture from that state.
//   3. EVENTS: clicks and drags change the state, then call draw().
//   4. LOGIC: solve() applies Ohm's law to the state.
//
// Try this: change the 2 in solve() (the LED voltage drop) and watch the current change.
// =====================================================================
// ===== 1. CONSTANTS =====
// SX = x position of each of the 4 slots on the breadboard. Y = row height.
// RV = the resistor values a tap cycles through.
var SX = [140, 260, 380, 500],
  Y = 181,
  RV = [100, 220, 470, 1000];
// Resistor color bands (brown/black/brown = 100 ohm). One set of 3 colors per value.
var BANDS = {
  100: ["#7B4A1E", "#1A1A1A", "#7B4A1E"],
  220: ["#C8382E", "#C8382E", "#7B4A1E"],
  470: ["#E3C230", "#7A3FA0", "#7B4A1E"],
  1000: ["#7B4A1E", "#1A1A1A", "#C8382E"],
};
// The parts tray. Each entry says where it sits (x), its label (l), and the part object (p) that is copied when you drag it out.
// t = type of part: res, led, sw (switch) or wire.
var TRAY = [
  { k: "r100", x: 100, l: "100 ohm", p: { t: "res", R: 100 } },
  { k: "r470", x: 210, l: "470 ohm", p: { t: "res", R: 470 } },
  { k: "led", x: 320, l: "LED", p: { t: "led", rev: false } },
  { k: "sw", x: 430, l: "Switch", p: { t: "sw", on: true } },
  { k: "wire", x: 540, l: "Wire", p: { t: "wire" } },
];
// ===== 2. CHALLENGES =====
// One challenge per skill. pre() returns the starting board (null = empty slot). ask:true means the student types an answer.
var CH = [
  {
    id: "c1",
    skill: "Construction",
    title: "Light the LED",
    text: "Build a circuit that lights the LED without burning it. Fill all four slots.",
    pre: function () {
      return [null, null, null, null];
    },
  },
  {
    id: "c2",
    skill: "Analysis",
    title: "Predict the current",
    text: "This circuit has a 9 V battery. The LED drops about 2 V. Work out the current with Ohm's law, then enter it in mA.",
    pre: function () {
      return [
        { t: "res", R: 470 },
        { t: "led", rev: false },
        { t: "wire" },
        { t: "wire" },
      ];
    },
    ask: true,
  },
  {
    id: "c3",
    skill: "Troubleshooting",
    title: "Fix the broken circuit",
    text: "The LED will not light. Find what is wrong and fix it.",
    pre: function () {
      return [
        { t: "res", R: 470 },
        { t: "led", rev: true },
        { t: "sw", on: true },
        null,
      ];
    },
  },
];
// ===== 3. STATE =====
// S.slots = what is in each of the 4 slots. S.V = battery volts. S.cur = which challenge is open.
// D = the drag in progress (null when not dragging). done = completed challenges. stats = activity counters.
var S = { slots: [null, null, null, null], V: 9, cur: 0 },
  D = null,
  hot = -1,
  done = {},
  stats = { place: 0, tap: 0, remove: 0 };
var svg = document.getElementById("svg"),
  $ = function (i) {
    return document.getElementById(i);
  };
// Load saved progress. try/catch is needed because storage can be blocked.
try {
  done = JSON.parse(localStorage.getItem("circuitsim-done") || "{}");
} catch (e) {}
// Save progress in the browser so it survives a page refresh.
function save() {
  try {
    localStorage.setItem("circuitsim-done", JSON.stringify(done));
  } catch (e) {}
}
// Make an independent copy of an object, so dragging from the tray never changes the tray part itself.
function copy(p) {
  return JSON.parse(JSON.stringify(p));
}
// ===== 4. DRAWING =====
// part() returns SVG markup for one component, centered on (0,0).
// c = the circuit result, used to light or burn the LED.
function part(p, c) {
  var lg = 'stroke="#9A9A9A" stroke-width="2" fill="none"';
  if (p.t === "wire")
    return '<path d="M-50 0H50" stroke="#3BAA5E" stroke-width="4" stroke-linecap="round" fill="none"/>';
  if (p.t === "sw")
    return (
      '<path d="M-50 0H-25M25 0H50" ' +
      lg +
      '/><rect x="-25" y="-14" width="50" height="28" rx="3" fill="#4A4F57"/><rect x="' +
      (p.on ? -17 : -1) +
      '" y="-6" width="18" height="12" rx="2" fill="#C9CDD3"/>'
    );
  if (p.t === "res") {
    var b = BANDS[p.R];
    return (
      '<path d="M-50 0H-19M19 0H50" ' +
      lg +
      '/><rect x="-19" y="-8" width="38" height="16" rx="8" fill="#D9B382" stroke="#B48F5E" stroke-width="0.5"/><rect x="-13" y="-8" width="4" height="16" fill="' +
      b[0] +
      '"/><rect x="-5" y="-8" width="4" height="16" fill="' +
      b[1] +
      '"/><rect x="3" y="-8" width="4" height="16" fill="' +
      b[2] +
      '"/><rect x="11" y="-8" width="3" height="16" fill="#C9A227"/>'
    );
  }
  var lit = c && c.lit,
    bu = c && c.burnt;
  return (
    '<path d="M-50 0H-13M13 0H50" ' +
    lg +
    '/><circle r="24" fill="#FF6B5B" opacity="' +
    (lit ? (0.15 + 0.45 * c.br).toFixed(2) : 0) +
    '"/><circle r="13" fill="' +
    (bu ? "#555" : lit ? "#FF5A4D" : "#8E3A38") +
    '" stroke="#5E2120"/><circle cx="-5" cy="-5" r="3" fill="#fff" opacity="0.4"/><rect x="' +
    (p.rev ? -14.5 : 11.5) +
    '" y="-6" width="3" height="12" fill="#5E2120"/>'
  );
}
// ===== 5. THE PHYSICS =====
// solve() checks the circuit like a teacher would:
//   empty slot -> open circuit, open switch -> no current, reversed LED -> blocks current.
// Then it uses Ohm's law: current = (battery volts - LED drop) / total resistance.
// It returns an object with the current (I), whether the LED is lit or burnt, and a message to show.
function solve() {
  var r = {
      I: 0,
      lit: false,
      burnt: false,
      br: 0,
      msg: "",
      cls: "info",
      nLED: 0,
    },
    s = S.slots,
    i,
    Rt = 0;
  for (i = 0; i < 4; i++) {
    if (s[i]) {
      if (s[i].t === "res") Rt += s[i].R;
      if (s[i].t === "led") r.nLED++;
    }
  }
  for (i = 0; i < 4; i++)
    if (!s[i]) {
      r.msg =
        "Slot " +
        (i + 1) +
        " is empty, so the circuit is open. Fill every slot.";
      r.cls = "warn";
      return r;
    }
  if (
    s.some(function (p) {
      return p.t === "sw" && !p.on;
    })
  ) {
    r.msg = "The switch is open, so no current flows.";
    r.cls = "warn";
    return r;
  }
  if (
    s.some(function (p) {
      return p.t === "led" && p.rev;
    })
  ) {
    r.msg =
      "An LED is backwards. The flat side must face the minus end (right).";
    r.cls = "warn";
    return r;
  }
  var Vd = 2 * r.nLED;
  if (S.V <= Vd) {
    r.msg = "The battery is too weak to light the LED.";
    r.cls = "warn";
    return r;
  }
  r.I = ((S.V - Vd) / (Rt + (r.nLED ? 10 : 0.5))) * 1000;
  if (!r.nLED && !Rt) {
    r.msg = "Short circuit! Wires join the battery directly.";
    r.cls = "bad";
    return r;
  }
  if (!r.nLED) {
    r.msg = "Current flows, but there is no LED to light.";
    return r;
  }
  if (r.I > 30) {
    r.burnt = true;
    r.msg = "The LED burned out. Add a resistor to limit the current.";
    r.cls = "bad";
    return r;
  }
  r.lit = true;
  r.br = Math.min(1, r.I / 20);
  if (r.I < 5) {
    r.msg = "The LED lights, but only dimly.";
    r.cls = "warn";
  } else {
    r.msg = "Safe current. The LED shines normally.";
    r.cls = "ok";
  }
  return r;
}
// Show a feedback message (fb = feedback) in the challenge card. c is the color class: ok, warn, bad or info.
function fb(t, c) {
  var f = $("cf");
  f.style.display = "block";
  f.className = "pill " + c;
  f.textContent = t;
}
// draw() redraws the slots and the readings from the current state.
// Pattern to notice: change the state first, then call draw(). The screen always follows the state.
function draw() {
  var r = solve(),
    h = "",
    i,
    p,
    c = CH[S.cur];
  for (i = 0; i < 4; i++) {
    p = S.slots[i];
    h +=
      '<g transform="translate(' +
      SX[i] +
      " " +
      Y +
      ')" data-slot="' +
      i +
      '" style="cursor:grab"><rect x="-46" y="-19" width="92" height="38" rx="6" fill="' +
      (hot === i ? "rgba(24,95,165,0.18)" : "transparent") +
      '" stroke="' +
      (hot === i ? "#185FA5" : "#8A8478") +
      '" stroke-width="' +
      (p ? 0.5 : 1.2) +
      '" stroke-dasharray="' +
      (p ? "0" : "4 3") +
      '"/>';
    h += p
      ? part(p, r)
      : '<text class="bl" y="4" text-anchor="middle" style="opacity:.75">Slot ' +
        (i + 1) +
        "</text>";
    h += "</g>";
  }
  $("slots").innerHTML = h;
  $("bt").textContent = S.V + " V";
  var hide = c.ask && !done[c.id];
  $("cur").textContent = hide
    ? "?"
    : (r.I > 1000 ? ">1000" : r.I.toFixed(1)) + " mA";
  $("ledst").textContent = r.burnt ? "Burned out" : r.lit ? "On" : "Off";
  $("st").textContent = r.msg;
  $("st").className = "pill " + r.cls;
  if (!c.ask && r.lit && !done[c.id]) {
    done[c.id] = 1;
    save();
    fb("Challenge complete. Nice work.", "ok");
    renderChips();
    renderProg();
  }
}
// Draw the parts tray once at start-up.
function tray() {
  var h = "";
  TRAY.forEach(function (t) {
    h +=
      '<g transform="translate(' +
      t.x +
      ' 356)" data-tray="' +
      t.k +
      '" style="cursor:grab"><rect x="-50" y="-26" width="100" height="52" fill="transparent"/>' +
      part(t.p) +
      '</g><text class="sl" x="' +
      t.x +
      '" y="398" text-anchor="middle">' +
      t.l +
      "</text>";
  });
  $("tray").innerHTML = h;
}
// Open challenge number n: set up its board, text and answer box.
function load(n) {
  S.cur = n;
  var c = CH[n];
  S.slots = c.pre();
  S.V = 9;
  $("bv").value = 9;
  $("cs").textContent = c.skill;
  $("ct").textContent = c.title;
  $("cx").textContent = c.text;
  $("ans").style.display = c.ask ? "flex" : "none";
  $("av").value = "";
  $("cf").style.display = "none";
  if (done[c.id]) fb("You have already completed this challenge.", "ok");
  renderChips();
  draw();
}
// Build the row of challenge buttons. A tick shows completed ones.
function renderChips() {
  var h = "";
  CH.forEach(function (c, i) {
    h +=
      '<button data-ch="' +
      i +
      '" class="' +
      (i === S.cur ? "on" : "") +
      '">' +
      (done[c.id] ? "&#10003; " : "") +
      c.skill +
      "</button>";
  });
  $("chips").innerHTML = h;
}
// Fill in the My progress page from the done object and stats.
function renderProg() {
  var n = CH.filter(function (c) {
      return done[c.id];
    }).length,
    h = "";
  CH.forEach(function (c, i) {
    h +=
      '<div class="row"><div><h3 style="margin:0">' +
      c.skill +
      '</h3><span class="mut">' +
      c.title +
      '</span></div><div style="display:flex;gap:10px;align-items:center"><span class="pill ' +
      (done[c.id] ? "ok" : "warn") +
      '" style="margin:0;padding:4px 12px">' +
      (done[c.id] ? "Complete" : "Not yet") +
      '</span><button data-open="' +
      i +
      '">' +
      (done[c.id] ? "Retry" : "Start") +
      "</button></div></div>";
  });
  $("plist").innerHTML = h;
  $("ov").textContent = n + " of 3 challenges complete";
  $("pc").textContent = Math.round((n / 3) * 100) + "%";
  $("pb").style.width = (n / 3) * 100 + "%";
  $("act").textContent =
    "This session: " +
    stats.place +
    " parts placed, " +
    stats.tap +
    " parts adjusted, " +
    stats.remove +
    " parts removed.";
}
// ===== 6. PAGE NAVIGATION =====
// Show one page section and hide the others. Pages are just <section class="v"> elements.
function go(v) {
  [].forEach.call(document.querySelectorAll(".v"), function (s) {
    s.className = "v" + (s.id === v ? " on" : "");
  });
  [].forEach.call($("nav").children, function (b) {
    b.className = b.dataset.go === v ? "on" : "";
  });
  if (v === "prog") renderProg();
  window.scrollTo(0, 0);
}
// ===== 7. DRAG AND DROP =====
// pt() converts the mouse or finger position on screen into SVG coordinates.
function pt(e) {
  var q = svg.createSVGPoint();
  q.x = e.clientX;
  q.y = e.clientY;
  return q.matrixTransform(svg.getScreenCTM().inverse());
}
// near() finds which slot (0 to 3) is close to a point. Returns -1 when none is close.
function near(q) {
  for (var i = 0; i < 4; i++)
    if (Math.abs(q.x - SX[i]) < 58 && Math.abs(q.y - Y) < 50) return i;
  return -1;
}
// Drag step 1: pointer down. Remember what was grabbed (a tray part or a part already in a slot).
// Pointer events work for mouse, touch and pen with the same code.
svg.addEventListener("pointerdown", function (e) {
  var el = e.target.closest("[data-tray],[data-slot]");
  if (!el) return;
  var tk = el.getAttribute("data-tray"),
    si = el.getAttribute("data-slot");
  D = {
    q0: pt(e),
    moved: false,
    tray: tk,
    slot: si === null ? null : +si,
    part: null,
  };
  if (tk)
    D.part = copy(
      TRAY.filter(function (t) {
        return t.k === tk;
      })[0].p,
    );
  else {
    D.part = S.slots[D.slot];
    if (!D.part) {
      D = null;
      return;
    }
  }
  svg.setPointerCapture(e.pointerId);
  e.preventDefault();
});
// Drag step 2: pointer move. After moving a few pixels it counts as a drag, so show the floating 'ghost' part and highlight the closest slot.
svg.addEventListener("pointermove", function (e) {
  if (!D) return;
  var q = pt(e);
  if (!D.moved && Math.hypot(q.x - D.q0.x, q.y - D.q0.y) > 6) {
    D.moved = true;
    $("ghost").innerHTML = part(D.part);
    if (D.slot !== null) {
      S.slots[D.slot] = null;
      draw();
    }
  }
  if (D.moved) {
    $("ghost").setAttribute("transform", "translate(" + q.x + " " + q.y + ")");
    var n = near(q);
    if (n !== hot) {
      hot = n;
      draw();
    }
  }
});
// Drag step 3: pointer up. Dropped near a slot = place it. Dropped elsewhere = remove it.
// If the pointer never moved it was a tap: tap a tray part to auto-place it, tap a board part to change it.
function end(e, cancel) {
  if (!D) return;
  var n = near(pt(e));
  if (D.moved) {
    $("ghost").innerHTML = "";
    if (n >= 0 && !cancel) {
      S.slots[n] = D.part;
      stats.place++;
    } else if (D.slot !== null) stats.remove++;
  } else if (D.tray) {
    var f = S.slots.indexOf(null);
    if (f >= 0) {
      S.slots[f] = D.part;
      stats.place++;
    }
  } else {
    var p = D.part;
    if (p.t === "led") p.rev = !p.rev;
    else if (p.t === "sw") p.on = !p.on;
    else if (p.t === "res") p.R = RV[(RV.indexOf(p.R) + 1) % 4];
    stats.tap++;
  }
  D = null;
  hot = -1;
  draw();
}
// Both pointerup and pointercancel finish the drag.
svg.addEventListener("pointerup", function (e) {
  end(e, false);
});
svg.addEventListener("pointercancel", function (e) {
  end(e, true);
});
// ===== 8. BUTTON EVENTS =====
// Event delegation: one click listener handles every button that has a data-go, data-ch or data-open attribute.
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-go],[data-ch],[data-open]");
  if (!b) return;
  if (b.dataset.go) go(b.dataset.go);
  else if (b.dataset.ch !== undefined) load(+b.dataset.ch);
  else {
    go("sim");
    load(+b.dataset.open);
  }
});
// Battery selector, reset button and the Analysis answer check.
$("bv").onchange = function () {
  S.V = +this.value;
  draw();
};
$("reset").onclick = function () {
  load(S.cur);
};
$("ab").onclick = function () {
  var v = parseFloat($("av").value);
  if (isNaN(v)) {
    fb("Enter a number first.", "warn");
    return;
  }
  var I = solve().I;
  if (Math.abs(v - I) <= 1) {
    done[CH[S.cur].id] = 1;
    save();
    fb("Correct. The current is about " + I.toFixed(1) + " mA.", "ok");
    renderChips();
    draw();
  } else
    fb(
      "Not quite. Use I = (battery voltage minus LED drop) divided by the resistor value.",
      "bad",
    );
};
// ===== 9. START-UP =====
// Draw the tray and chips, then open the first challenge.
tray();
renderChips();
load(0);
