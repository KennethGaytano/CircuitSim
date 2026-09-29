// =====================================================================
// CircuitSim (full structure) - study version
// Read from top to bottom. The sections are numbered 1 to 10.
//
// Big ideas:
//   1. DATA: the site menu, lessons, questions and activities are plain objects and arrays.
//   2. MODEL: a circuit is a small object, and solve() applies Ohm's law to it.
//   3. RENDER: functions turn data into HTML or SVG strings.
//   4. EVENTS: clicks and drags change the data, then the screen is redrawn.
//
// Try this: in solve(), change V = 9 to another voltage and see every page follow.
// =====================================================================
/* ---------- data: site structure ---------- */
// ===== 1. SITE STRUCTURE =====
// SECS is the menu. Each section has a key (k), a name (n), a description (d) and a list of pages.
// Each page is [id, label]. The id is used everywhere else: nav buttons, progress, and the PG table.
var SECS = [
    { k: 'home', n: 'Home', p: [['home', 'Home']] },
    { k: 'learn', n: 'Learn', d: 'Short lessons on the key ideas.', p: [['learn.parts', 'Circuit Components'], ['learn.v', 'Voltage'], ['learn.i', 'Current'], ['learn.r', 'Resistance'], ['learn.o', "Ohm's Law"], ['learn.s', 'Circuit Safety']] },
    { k: 'con', n: 'Construction', d: 'Drag parts to build circuits.', p: [['con.basic', 'Basic Circuit'], ['con.series', 'Series Circuit'], ['con.par', 'Parallel Circuit'], ['con.sp', 'Series-Parallel Circuit'], ['con.dia', 'Build From Diagram']] },
    { k: 'ana', n: 'Analysis', d: 'Calculate first, then check.', p: [['ana.o', "Ohm's Law"], ['ana.v', 'Voltage'], ['ana.i', 'Current'], ['ana.r', 'Resistance'], ['ana.p', 'Power'], ['ana.pv', 'Predict and Verify']] },
    { k: 'mea', n: 'Measurement', d: 'Use meters correctly.', p: [['mea.v', 'Voltmeter'], ['mea.a', 'Ammeter'], ['mea.m', 'Multimeter']] },
    { k: 'tro', n: 'Troubleshooting', d: 'Find and fix faults.', p: [['tro.find', 'Find the Fault'], ['tro.fix', 'Repair the Circuit'], ['tro.multi', 'Multiple Faults'], ['tro.diag', 'Diagnostic Challenge']] },
    { k: 'asm', n: 'Assessment', d: 'Tests and the final challenge.', p: [['asm.pre', 'Pre-Test'], ['asm.prac', 'Practice'], ['asm.post', 'Post-Test'], ['asm.fin', 'Final Challenge']] }
];
// Text for the Learn pages. Each entry is [title, [paragraphs], formula].
var LN = {
    'learn.parts': ['Circuit Components', ['A circuit is a closed path for current. A <b>battery</b> supplies the push. <b>Wires</b> carry current. A <b>resistor</b> limits current. A <b>bulb</b> turns current into light. A <b>switch</b> opens or closes the path.', 'If the path is broken anywhere, current stops.'], 'Closed loop = current flows'],
    'learn.v': ['Voltage', ['Voltage (V, volts) is the push that moves charge around a circuit. A battery gives a fixed voltage, such as 9 V.', 'Voltage is measured <b>across</b> a part. In a series circuit the voltages share out. In a parallel circuit each branch gets the full voltage.'], 'V = volts'],
    'learn.i': ['Current', ['Current (I, amps) is how much charge flows each second. Small currents are given in milliamps: 1 A = 1000 mA.', 'In a series circuit the current is the same everywhere. In a parallel circuit the current splits between the branches.'], '1 A = 1000 mA'],
    'learn.r': ['Resistance', ['Resistance (R, ohms) opposes current. A bigger resistance means less current.', 'Series resistors add: R = R1 + R2. Parallel resistors give a total that is smaller than the smallest branch.'], 'Series: R = R1 + R2'],
    'learn.o': ["Ohm's Law", ["Ohm's law links voltage, current and resistance. Rearrange it to find any one of them.", 'Example: 9 V across 300 ohm gives I = 9 / 300 = 0.03 A = 30 mA. Power is P = V x I.'], 'V = I x R'],
    'learn.s': ['Circuit Safety', ['Never connect a wire straight across a battery. This is a <b>short circuit</b>. It can overheat the wire and the battery.', 'Turn the power off before changing parts. Use a resistor to limit current. Never touch mains electricity. Ask your instructor if unsure.'], 'Power off before you change parts']
};
// Question bank for the tests. Each question is [text, [options], index of the correct option].
var QZ = [['What is the unit of resistance?', ['Volt', 'Ohm', 'Ampere'], 1], ["Which is Ohm's law?", ['V = I x R', 'V = I + R', 'V = R / I'], 0], ['A 9 V battery is connected to 300 ohm. What is the current?', ['3 mA', '30 mA', '300 mA'], 1], ['In a series circuit the current is...', ['different at each part', 'the same everywhere', 'zero'], 1], ['In a parallel circuit the voltage across each branch is...', ['the same', 'shared out', 'zero'], 0], ['An ammeter is connected...', ['in series', 'in parallel', 'across the battery only'], 0], ['A voltmeter is connected...', ['in series', 'in parallel (across the part)', 'after the switch only'], 1], ['A wire joined straight across a battery causes...', ['a brighter bulb', 'a short circuit', 'nothing'], 1]];
/* ---------- data: circuit model ---------- */
// ===== 2. THE CIRCUIT MODEL =====
// A circuit board is an object: { topo, s, l }.
//   topo = 'series' | 'par' | 'sp' (series-parallel)
//   s = parts in series along the top wire, l = parts in parallel branches (legs)
// A part is a small object such as { t:'res', R:220 }. null means an empty slot.
// These helper functions create parts. A part with dead:true looks normal but behaves as open (a failed part).
var R = function (v) { return { t: 'res', R: v }; }, BU = function () { return { t: 'bulb' }; }, SW = function (o) { return { t: 'sw', on: o }; }, WI = function () { return { t: 'wire' }; };
var DB = function () { return { t: 'bulb', dead: true, fault: true }; };
// B() builds a board object.
function B(topo, s, l) { return { topo: topo, s: s, l: l || [] }; }
// rOf() returns the resistance of a part in ohms. Infinity = open (no current can pass). 0 = a plain wire.
function rOf(p) { if (!p || p.dead)
    return Infinity; if (p.short)
    return 0; if (p.t === 'res')
    return p.R; if (p.t === 'bulb')
    return 100; if (p.t === 'sw')
    return p.on ? 0 : Infinity; return 0; }
// lay() decides where each slot sits on the SVG. Slot ids are 's0','s1'... (series) and 'l0','l1'... (legs).
function lay(b) {
    var sx = b.topo === 'sp' ? [190] : (b.s.length === 2 ? [300, 460] : [220, 360, 500]), lx = b.topo === 'sp' ? [350, 500] : [300, 480], L = {};
    b.s.forEach(function (p, i) { L['s' + i] = { x: sx[i], y: 50 }; });
    b.l.forEach(function (p, i) { L['l' + i] = { x: lx[i], y: 150 }; });
    return { L: L, lx: lx, end: b.l.length ? lx[lx.length - 1] : 620 };
}
// get, put and cell read or write a slot by its id ('s0', 'l1'...).
function get(b, id) { return (id[0] === 's' ? b.s : b.l)[+id.slice(1)]; }
function put(b, id, p) { (id[0] === 's' ? b.s : b.l)[+id.slice(1)] = p; }
function cell(o, id) { return (id[0] === 's' ? o.s : o.l)[+id.slice(1)]; }
// ===== 3. THE PHYSICS =====
// solve() is the heart of the simulator.
//   Step 1: add the series resistances (rs). Any open part opens the whole loop.
//   Step 2: combine the parallel legs: 1/Rp = 1/R1 + 1/R2 ... (an open leg is skipped, a wire leg shorts the group)
//   Step 3: total R = rs + Rp, then Ohm's law: I = V / R.
//   Step 4: work out the voltage, current and power for every part, so meters and bulbs can use them.
// Units: current in mA, voltage in V, power in mW (V x mA).
function solve(b) {
    var V = 9, s = b.s.map(rOf), l = b.l.map(rOf), rs = 0, open = false, k = 0, Rp = 0, legOpen = false;
    s.forEach(function (r) { if (r === Infinity) {
        open = true;
        k++;
    }
    else
        rs += r; });
    if (l.length) {
        if (l.some(function (r) { return r === 0; }))
            Rp = 0;
        else {
            var g = 0;
            l.forEach(function (r) { if (r !== Infinity)
                g += 1 / r; });
            if (g === 0) {
                open = true;
                legOpen = true;
                k++;
            }
            else
                Rp = 1 / g;
        }
    }
    var Rt = rs + Rp, I = 0, Vp = 0;
    if (!open) {
        I = V / Math.max(Rt, 0.5) * 1000;
        Vp = I * Rp / 1000;
    }
    else if (legOpen)
        Vp = V / k;
    var o = { open: open, I: I, Rt: Rt, short: !open && Rt < 5, s: [], l: [] };
    s.forEach(function (r) { var v = open ? (r === Infinity ? V / k : 0) : I * r / 1000; o.s.push({ R: r, V: v, I: I, P: v * I }); });
    l.forEach(function (r) { var i = (open || r === Infinity) ? 0 : (r === 0 ? I : Vp / r * 1000); o.l.push({ R: r, V: Vp, I: i, P: Vp * i }); });
    return o;
}
// stt() counts bulbs, lit bulbs and switches. Goals use it to decide if a challenge is complete.
function stt(b, o) { var L = lay(b).L, id, p, r = { bulbs: 0, lit: 0, sw: 0 }; for (id in L) {
    p = get(b, id);
    if (!p)
        continue;
    if (p.t === 'bulb') {
        r.bulbs++;
        if (cell(o, id).P / 400 > 0.05)
            r.lit++;
    }
    if (p.t === 'sw')
        r.sw++;
} return r; }
/* ---------- drawing ---------- */
// ===== 4. DRAWING =====
// pv() returns the SVG picture of one part. A bulb glows more when it has more power.
function pv(p, c) {
    if (p.t === 'wire')
        return '<path d="M-40 0H40" stroke="#3BAA5E" stroke-width="4" stroke-linecap="round"/>';
    if (p.t === 'res')
        return '<rect x="-38" y="-13" width="76" height="26" rx="8" fill="#D9B382" stroke="#B48F5E"/><text class="dk" y="4" text-anchor="middle">' + (p.R >= 1000 ? '1k' : p.R) + ' ohm</text>';
    if (p.t === 'sw')
        return '<rect x="-30" y="-13" width="60" height="26" rx="4" fill="#4A4F57"/><text class="lt" y="4" text-anchor="middle">' + (p.on ? 'ON' : 'OFF') + '</text>';
    var b = c ? Math.min(1, c.P / 400) : 0;
    return '<circle r="24" fill="#FFD54A" opacity="' + (b * 0.5).toFixed(2) + '"/><circle r="14" fill="' + (b > 0.05 ? '#FFD54A' : '#CFCBB8') + '" stroke="#8A8478"/><path d="M-6 6L-3 -3L3 -3L6 6" fill="none" stroke="#8A8478"/>';
}
// The parts tray.
var TR = [{ k: 'r', p: R(100), x: 130, l: 'Resistor' }, { k: 'b', p: BU(), x: 290, l: 'Bulb' }, { k: 's', p: SW(true), x: 450, l: 'Switch' }, { k: 'w', p: WI(), x: 590, l: 'Wire' }];
// boardSVG() draws the whole board: wires, battery, slots, parts and (optionally) the tray.
// Notice it only returns a string of SVG. The caller puts it on the page.
function boardSVG(b, o, x) {
    x = x || {};
    var m = lay(b), h = '<g fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">';
    h += b.l.length ? '<path d="M90 100V50H' + m.end + 'M' + m.end + ' 250H90V200' + m.lx.map(function (v) { return 'M' + v + ' 50V250'; }).join('') + '"/>' : '<path d="M90 100V50H620V250H90V200"/>';
    h += '<path d="M74 140H106"/><path d="M82 152H98" stroke-width="5"/><path d="M90 100V140M90 152V200"/></g>';
    b.l.length && m.lx.forEach(function (v) { h += '<circle cx="' + v + '" cy="50" r="4" fill="var(--muted)"/><circle cx="' + v + '" cy="250" r="4" fill="var(--muted)"/>'; });
    h += '<text class="sl" x="50" y="150" text-anchor="middle">9 V</text>';
    var id, p, c, lb;
    for (id in m.L) {
        p = get(b, id);
        c = cell(o, id);
        lb = (id[0] === 's' ? 'S' : 'L') + (+id.slice(1) + 1);
        h += '<g transform="translate(' + m.L[id].x + ' ' + m.L[id].y + ')" data-slot="' + id + '" style="cursor:pointer"><rect x="-46" y="-19" width="92" height="38" rx="6" fill="var(--card)" stroke="' + (x.sel === id ? 'var(--accent)' : x.hot === id ? 'var(--accent)' : 'var(--line)') + '" stroke-width="' + (x.sel === id ? 3 : 1.5) + '" stroke-dasharray="' + (p ? '0' : '4 3') + '"/>' + (p ? pv(p, c) : '<text class="sl" y="4" text-anchor="middle">drop here</text>') + '<text class="sl" x="-46" y="-24">' + lb + '</text></g>';
    }
    if (x.tray) {
        h += '<rect x="40" y="300" width="600" height="88" rx="10" fill="var(--card)" stroke="var(--line)"/><text class="sl" x="54" y="320">Parts tray</text>';
        TR.forEach(function (t) { h += '<g transform="translate(' + t.x + ' 350)" data-tray="' + t.k + '" style="cursor:grab"><rect x="-50" y="-24" width="100" height="48" fill="transparent"/>' + pv(t.p, { P: 0 }) + '</g><text class="sl" x="' + t.x + '" y="380" text-anchor="middle">' + t.l + '</text>'; });
    }
    return h;
}
/* ---------- state + nav ---------- */
// ===== 5. STATE AND NAVIGATION =====
// cur = current page id. done = completed pages. sc = test scores.
var $ = function (i) { return document.getElementById(i); }, cur = 'home', done = {}, sc = {};
// Load saved progress. try/catch because browser storage can be blocked.
try {
    var sv = JSON.parse(localStorage.getItem('circuitsim-structure') || '{}');
    done = sv.d || {};
    sc = sv.s || {};
}
catch (e) { }
// Save progress in the browser.
function save() { try {
    localStorage.setItem('circuitsim-structure', JSON.stringify({ d: done, s: sc }));
}
catch (e) { } }
// mark() records a page as complete and refreshes the menu ticks.
function mark(id) { if (!done[id]) {
    done[id] = 1;
    save();
    nav();
} }
// secOf() finds which section a page id belongs to.
function secOf(id) { return SECS.filter(function (s) { return s.p.some(function (q) { return q[0] === id; }); })[0]; }
// nav() draws the top menu and the sub menu for the current section.
function nav() {
    var s = secOf(cur), h = '', g = '';
    SECS.forEach(function (x) { h += '<button data-go="' + x.p[0][0] + '" class="' + (x === s ? 'on' : '') + '">' + x.n + '</button>'; });
    $('top').innerHTML = h;
    if (s.k !== 'home')
        s.p.forEach(function (q) { g += '<button data-go="' + q[0] + '" class="' + (q[0] === cur ? 'on' : '') + '">' + (done[q[0]] ? '&#10003; ' : '') + q[1] + '</button>'; });
    $('sub').innerHTML = g;
    $('sub').style.display = g ? 'flex' : 'none';
}
// go() switches page: set cur, redraw the menu, render the page.
function go(id) {
    cur = id;
    SPS = null; // ===== 10. START-UP =====
    // Draw the menu and open the Home page.
    nav();
    render();
    window.scrollTo(0, 0);
}
// fb() shows a feedback message. c = ok, warn, bad or info (a color class).
function fb(t, c) { var f = $('cf'); if (!f)
    return; f.style.display = 'block'; f.className = 'pill ' + c; f.innerHTML = t; }
// pk() picks a random item from an array.
function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
// total() counts finished pages for the Home progress bar.
function total() { var n = 0, d = 0; SECS.forEach(function (s) { if (s.k !== 'home')
    s.p.forEach(function (q) { n++; if (done[q[0]])
        d++; }); }); return [d, n]; }
/* ---------- pages ---------- */
// ===== 6. PAGES =====
// render() looks at the page id and chooses the right page type: home, learn, calculator, quiz or simulator.
function find(id) { return secOf(id).p.filter(function (q) { return q[0] === id; })[0]; }
// render() chooses which page function to run.
function render() {
    var m = $('main');
    if (cur === 'home')
        return home(m);
    if (LN[cur])
        return learn(m);
    if (cur.indexOf('ana.') === 0 && cur !== 'ana.pv')
        return calc(m);
    if (cur === 'asm.pre' || cur === 'asm.post' || cur === 'asm.prac')
        return quiz(m);
    sim(m, PG[cur]);
}
// home() builds the Home page.
function home(m) {
    var t = total(), h = '<div class="card" style="padding:28px 20px"><span class="tag">For first-year Industrial Art students</span><h1>Build, measure and fix circuits safely</h1><p class="mut">CircuitSim is a hands-on simulator for learning basic circuit construction, analysis and troubleshooting.</p><div class="row"><button class="pri" data-go="learn.parts">Start with Learn</button><button data-go="con.basic">Jump to building</button></div></div>';
    h += '<div class="card"><div class="row" style="margin:0;justify-content:space-between"><h3>Your progress</h3><span class="mut">' + t[0] + ' of ' + t[1] + ' activities</span></div><div class="bar" style="margin-top:8px"><div style="width:' + (t[0] / t[1] * 100) + '%"></div></div></div><div class="g3">';
    SECS.forEach(function (s) { if (s.k === 'home')
        return; var d = s.p.filter(function (q) { return done[q[0]]; }).length; h += '<div class="card" style="margin:0"><h3>' + s.n + '</h3><p class="mut">' + s.d + '</p><div class="bar"><div style="width:' + (d / s.p.length * 100) + '%"></div></div><div class="row"><span class="mut">' + d + ' of ' + s.p.length + '</span><button data-go="' + s.p[0][0] + '">Open</button></div></div>'; });
    m.innerHTML = h + '</div>';
}
// learn() builds a Learn page from the LN data and marks it complete.
function learn(m) {
    var d = LN[cur];
    mark(cur);
    m.innerHTML = '<div class="card"><span class="tag">Learn</span><h1>' + d[0] + '</h1>' + d[1].map(function (x) { return '<p>' + x + '</p>'; }).join('') + '<div class="formula">' + d[2] + '</div><div class="row"><button data-go="' + (cur === 'learn.s' ? 'con.basic' : 'ana.o') + '" class="pri">' + (cur === 'learn.s' ? 'Try building' : 'Practice this') + '</button></div></div>';
}
/* analysis calculators */
// Each Analysis page has a function that makes a random problem: q = question, u = unit, a = answer, h = hint.
var CALC = {
    'ana.o': function () { var v = pk([3, 6, 9, 12]), r = pk([100, 220, 330, 470, 1000]); return { q: 'A ' + v + ' V battery is connected to a ' + r + ' ohm resistor. What current flows?', u: 'mA', a: v / r * 1000, h: 'I = V / R. Multiply by 1000 to get mA.' }; },
    'ana.v': function () { var i = pk([10, 20, 30, 50]), r = pk([100, 220, 470]); return { q: 'A current of ' + i + ' mA flows through a ' + r + ' ohm resistor. What is the voltage across it?', u: 'V', a: i * r / 1000, h: 'V = I x R, with I in amps (mA / 1000).' }; },
    'ana.i': function () { var v = pk([6, 9, 12]), a = pk([100, 220]), b = pk([100, 330]); return { q: 'Resistors of ' + a + ' and ' + b + ' ohm are in series with a ' + v + ' V battery. What current flows?', u: 'mA', a: v / (a + b) * 1000, h: 'Add the resistors first (R = R1 + R2), then I = V / R.' }; },
    'ana.r': function () { var t = pk([[9, 30], [12, 20], [6, 20], [9, 90], [6, 60], [12, 40]]); return { q: 'A circuit has ' + t[0] + ' V across it and carries ' + t[1] + ' mA. What is its resistance?', u: 'ohm', a: t[0] / t[1] * 1000, h: 'R = V / I, with I in amps.' }; },
    'ana.p': function () { var v = pk([3, 6, 9, 12]), i = pk([10, 20, 50]); return { q: 'A part has ' + v + ' V across it and ' + i + ' mA through it. How much power does it use?', u: 'mW', a: v * i, h: 'P = V x I. Volts times milliamps gives milliwatts.' }; }
};
// calc() shows the current problem. 3 correct answers complete the page.
var CQ = null, cc = 0;
function calc(m) {
    cc = 0;
    CQ = CALC[cur]();
    m.innerHTML = '<div class="card"><span class="tag">Analysis</span><h2>' + find(cur)[1] + '</h2><p id="cq"></p><div class="row"><input id="av" type="number" step="any" style="width:150px" placeholder="Your answer"><span class="mut" id="cu"></span><button id="ab" class="pri">Check</button><button id="nq">New problem</button></div><div id="cf" class="pill info" style="display:none"></div><p class="hint" id="cn"></p></div>';
    showQ();
}
function showQ() { $('cq').textContent = CQ.q; $('cu').textContent = CQ.u; $('av').value = ''; $('cf').style.display = 'none'; $('cn').textContent = 'Get 3 right to complete this activity. Correct so far: ' + cc; }
/* quizzes */
// Quizzes: QA stores the chosen answers. Practice gives instant feedback, Pre-Test and Post-Test wait for Submit.
var QA = [], QD = false;
function quiz(m) {
    QA = [];
    QD = false;
    var pr = cur === 'asm.prac', h = '<div class="card"><span class="tag">Assessment</span><h2>' + find(cur)[1] + '</h2><p class="mut">' + (pr ? 'Answer each question. You get feedback straight away.' : 'Answer all 8 questions, then submit.') + '</p></div>';
    QZ.forEach(function (q, i) { h += '<div class="card"><h3>' + (i + 1) + '. ' + q[0] + '</h3>' + q[1].map(function (o, j) { return '<button class="opt" data-q="' + i + '" data-o="' + j + '">' + o + '</button>'; }).join('') + '</div>'; });
    h += pr ? '' : '<div class="card"><button id="qs" class="pri">Submit</button><div id="cf" class="pill info" style="display:none"></div></div>';
    m.innerHTML = h;
}
// pickOpt() handles a click on an answer option.
function pickOpt(b) {
    var i = +b.dataset.q, j = +b.dataset.o, pr = cur === 'asm.prac';
    if (QD)
        return;
    [].forEach.call(b.parentNode.querySelectorAll('.opt'), function (k) { k.className = 'opt'; });
    if (pr) {
        b.className = 'opt ' + (j === QZ[i][2] ? 'right' : 'wrong');
        QA[i] = j;
        if (QZ.every(function (q, x) { return QA[x] === q[2]; }))
            mark('asm.prac');
        return;
    }
    b.className = 'opt sel';
    QA[i] = j;
}
// submitQ() scores the test, saves it, and shows the change from pre-test to post-test.
function submitQ() {
    var n = 0;
    if (QZ.some(function (q, i) { return QA[i] === undefined; }))
        return fb('Please answer every question first.', 'warn');
    QZ.forEach(function (q, i) { if (QA[i] === q[2])
        n++; });
    QD = true;
    sc[cur] = n;
    mark(cur);
    save();
    var t = 'You scored ' + n + ' out of ' + QZ.length + '.';
    if (cur === 'asm.post' && sc['asm.pre'] !== undefined) {
        var d = n - sc['asm.pre'];
        t += ' Your pre-test score was ' + sc['asm.pre'] + '. Change: ' + (d > 0 ? '+' : '') + d + '.';
    }
    fb(t, n >= 6 ? 'ok' : 'warn');
}
/* simulator pages */
// ===== 7. SIMULATOR PAGES =====
// SPS = the state of the open simulator page (its board, selected part...). D = the drag in progress.
var SPS = null, D = null;
// PG describes every simulator page as data. Read these entries to see how one engine gives many activities:
//   tray:1   -> show the parts tray (build mode)
//   probe    -> show a meter and let the student tap parts to measure them
//   goal     -> function that returns true when the challenge is complete
//   ask      -> a question the student answers with a number
//   dx       -> show the diagnosis dropdown (find the fault)
//   spec     -> a target board to copy
var PG = {
    'con.basic': { tag: 'Construction', tray: 1, b: function () { return B('series', [null, null]); }, task: 'Build a basic circuit: one bulb and one switch in series. Make the bulb light.', goal: function (b, o, s) { return s.bulbs === 1 && s.sw === 1 && s.lit === 1; } },
    'con.series': { tag: 'Construction', tray: 1, b: function () { return B('series', [null, null, null]); }, task: 'Build a series circuit with two bulbs and a switch. Both bulbs must light.', goal: function (b, o, s) { return s.bulbs === 2 && s.sw === 1 && s.lit === 2; } },
    'con.par': { tag: 'Construction', tray: 1, b: function () { return B('par', [], [null, null]); }, task: 'Build a parallel circuit with a bulb in each branch. Both bulbs must light.', goal: function (b, o, s) { return s.bulbs === 2 && s.lit === 2; } },
    'con.sp': { tag: 'Construction', tray: 1, b: function () { return B('sp', [null], [null, null]); }, task: 'Build a series-parallel circuit: a resistor in series, then two bulbs in parallel. Both bulbs must light.', goal: function (b, o, s) { return b.s[0] && b.s[0].t === 'res' && s.bulbs === 2 && s.lit === 2; } },
    'con.dia': { tag: 'Construction', tray: 1, b: function () { return B('sp', [null], [null, null]); }, spec: function () { return B('sp', [R(220)], [BU(), R(470)]); }, task: 'Copy the target diagram exactly. Match every part type and resistor value. Tap a resistor to change its value.', goal: function (b) { return b.s[0] && b.s[0].t === 'res' && b.s[0].R === 220 && b.l[0] && b.l[0].t === 'bulb' && b.l[1] && b.l[1].t === 'res' && b.l[1].R === 470; } },
    'ana.pv': { tag: 'Analysis', ro: 1, b: function () { return pk([B('sp', [R(220)], [BU(), BU()]), B('series', [R(100), BU(), R(470)]), B('par', [], [R(220), R(470)])]); }, task: 'Predict the total current from the battery, then verify it against the simulation.', ask: { q: 'What is the total current in mA?', u: 'mA', tol: 1, ans: function (o) { return o.I; } } },
    'mea.v': { tag: 'Measurement', probe: 'V', b: function () { return B('sp', [R(220)], [BU(), BU()]); }, task: 'Tap a part to read its voltage. This meter is a voltmeter: it measures across a part.', ask: { q: 'What is the voltage across the resistor (S1)?', u: 'V', tol: 0.15, ans: function (o) { return o.s[0].V; } } },
    'mea.a': { tag: 'Measurement', probe: 'A', b: function () { return B('sp', [R(220)], [BU(), BU()]); }, task: 'Tap a part to read the current through it. This meter is an ammeter: it measures through a part.', ask: { q: 'What current flows through the bulb in branch L1?', u: 'mA', tol: 1, ans: function (o) { return o.l[0].I; } } },
    'mea.m': { tag: 'Measurement', probe: 'M', b: function () { return B('series', [R(100), BU(), R(470)]); }, task: 'Tap a part, then choose volts, current or resistance on the multimeter.', ask: { q: 'What is the total current in the circuit (mA)?', u: 'mA', tol: 1, ans: function (o) { return o.I; } } },
    'tro.find': { tag: 'Troubleshooting', probe: 'M', dx: 1, b: function () { return pk([B('series', [R(100), DB(), R(220)]), B('sp', [R(220)], [BU(), DB()])]); }, task: 'A bulb is not lighting. Use the multimeter to find the faulty part, then choose it below.' },
    'tro.fix': { tag: 'Troubleshooting', tray: 1, b: function () { return B('series', [R(100), DB(), SW(true)]); }, task: 'One part has failed. Replace it by dragging a new one into the slot so the bulb lights again.' },
    'tro.multi': { tag: 'Troubleshooting', tray: 1, b: function () { return B('sp', [{ t: 'sw', on: false, fault: true }], [DB(), BU()]); }, task: 'This circuit has more than one fault. Repair all of them so every bulb lights. Tap a switch to toggle it.' },
    'tro.diag': { tag: 'Troubleshooting', probe: 'M', dx: 1, nw: 1, b: function () { return pk([B('series', [R(100), DB(), R(220)]), B('sp', [R(220)], [BU(), DB()]), B('series', [R(220), { t: 'res', R: 100, fault: true, dead: true }, BU()]), B('par', [], [BU(), DB()])]); }, task: 'Diagnostic challenge: find the fault in a new circuit each time. Solve 2 circuits to complete it.' },
    'asm.fin': { tag: 'Assessment', tray: 1, b: function () { return B('sp', [null], [null, null]); }, task: 'Final challenge: build a series-parallel circuit with two bulbs in parallel so the total current is between 20 and 50 mA. Both bulbs must light.', goal: function (b, o, s) { return o.I >= 20 && o.I <= 50 && s.bulbs === 2 && s.lit === 2; } }
};
// Both repair pages share one goal: every bulb lit, circuit not open, no short.
PG['tro.fix'].goal = PG['tro.multi'].goal = function (b, o, s) { return s.bulbs > 0 && s.lit === s.bulbs && !o.open && !o.short; };
// sim() builds the HTML for a simulator page from its PG entry.
function sim(m, pg) {
    SPS = { pg: pg, b: pg.b(), sel: null, hot: null, asked: false, solved: 0 };
    var h = '<div class="card"><span class="tag">' + pg.tag + '</span><h2>' + find(cur)[1] + '</h2><p>' + pg.task + '</p>' + (pg.spec ? '<h3>Target diagram</h3><svg id="dg" class="mini" viewBox="0 0 680 300"></svg>' : '') + '</div>';
    h += '<div class="card"><svg id="bd" viewBox="0 0 680 ' + (pg.tray ? 400 : 300) + '" role="application" aria-label="Circuit board"><g id="bg"></g><g id="gh" pointer-events="none"></g></svg><p class="hint">' + (pg.tray ? 'Drag parts from the tray into the slots. Tap a part to change it. Drag a part off the board to remove it.' : 'Tap a part to select it for measuring.') + '</p></div><div class="g2"><div class="card"><h3>Readings</h3><div class="kv" id="kv"></div><div class="pill info" id="ms"></div></div><div class="card">';
    if (pg.probe)
        h += '<h3>Meter</h3><div class="row" style="margin:0 0 6px">' + (pg.probe === 'M' ? '<select id="mm"><option value="V">Volts</option><option value="A">Current (mA)</option><option value="R">Resistance</option></select>' : '<span class="mut">' + (pg.probe === 'V' ? 'Voltmeter' : 'Ammeter') + '</span>') + '</div><div class="big" id="mr">-</div><p class="hint" id="mh"></p>';
    if (pg.dx)
        h += '<h3 style="margin-top:12px">Diagnosis</h3><div class="row" style="margin:0"><select id="dx"></select><button id="dxb" class="pri">Check</button>' + (pg.nw ? '<button id="nw">New circuit</button>' : '') + '</div>';
    if (pg.ask)
        h += '<h3 style="margin-top:12px">' + pg.ask.q + '</h3><div class="row" style="margin:0"><input id="av" type="number" step="any" style="width:130px" placeholder="' + pg.ask.u + '"><button id="ab" class="pri">Check</button></div>';
    h += '<div class="pill info" id="cf" style="display:none"></div><div class="row"><button id="rs">Reset</button></div></div></div>';
    m.innerHTML = h;
    setDx();
    draw();
}
// setDx() fills the diagnosis dropdown with the slots of the current board.
function setDx() { var d = $('dx'); if (!d)
    return; var L = lay(SPS.b).L, h = '<option value="">Faulty part...</option>', id; for (id in L)
    h += '<option value="' + id + '">' + (id[0] === 's' ? 'S' : 'L') + (+id.slice(1) + 1) + '</option>'; d.innerHTML = h; }
// draw() redraws the board and the readings from the current state.
// Pattern: change the board first, then call draw(). The screen always follows the data.
function draw() {
    var pg = SPS.pg, b = SPS.b, o = solve(b), s = stt(b, o), h, hide = pg.probe || pg.dx || (pg.ro && !SPS.asked);
    $('bg').innerHTML = boardSVG(b, o, { tray: pg.tray, sel: SPS.sel, hot: SPS.hot });
    if (pg.spec) {
        var sp = pg.spec();
        $('dg').innerHTML = boardSVG(sp, solve(sp));
    }
    h = hide ? '<div><small>Bulbs lit</small><b>' + s.lit + ' of ' + s.bulbs + '</b></div>' : '<div><small>Total current</small><b>' + (o.I > 1000 ? '>1000' : o.I.toFixed(1)) + ' mA</b></div><div><small>Total resistance</small><b>' + (o.open ? 'open' : Math.round(o.Rt) + ' ohm') + '</b></div>';
    $('kv').innerHTML = h;
    $('ms').textContent = o.short ? 'Short circuit! The battery is joined straight to a wire.' : hide ? (s.bulbs ? 'The bulbs are ' + (s.lit === s.bulbs ? 'all on.' : s.lit ? 'not all on.' : 'off.') : 'No bulbs in this circuit.') : o.open ? 'The circuit is open. A slot is empty or a part is off or broken.' : 'Current flows. ' + (s.bulbs ? s.lit + ' of ' + s.bulbs + ' bulbs lit.' : 'Add a bulb to see light.');
    $('ms').className = 'pill ' + (o.short ? 'bad' : 'info');
    var mr = $('mr');
    if (mr) {
        var mode = $('mm') ? $('mm').value : pg.probe, c = SPS.sel && cell(o, SPS.sel);
        mr.textContent = !c ? '-' : mode === 'V' ? c.V.toFixed(2) + ' V' : mode === 'A' ? c.I.toFixed(1) + ' mA' : (c.R === Infinity ? 'OL (open)' : Math.round(c.R) + ' ohm');
        $('mh').textContent = c ? 'Reading for ' + (SPS.sel[0] === 's' ? 'S' : 'L') + (+SPS.sel.slice(1) + 1) + '.' : 'Tap a part to measure it.';
    }
    if (pg.goal && !done[cur] && pg.goal(b, o, s)) {
        mark(cur);
        fb('Challenge complete. Well done.', 'ok');
    }
}
/* drag and drop */
// ===== 8. DRAG AND DROP =====
// q2() converts the mouse or finger position to SVG coordinates.
function q2(e, sv) { var q = sv.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(sv.getScreenCTM().inverse()); }
// nearS() finds the slot close to a point, or null.
function nearS(q) { var L = lay(SPS.b).L, id, r = null; for (id in L)
    if (Math.abs(q.x - L[id].x) < 56 && Math.abs(q.y - L[id].y) < 30)
        r = id; return r; }
// Drag step 1: pointer down. Remember what was grabbed (a tray part or a part in a slot).
document.addEventListener('pointerdown', function (e) {
    var sv = e.target.closest && e.target.closest('#bd');
    if (!sv || !SPS)
        return;
    var el = e.target.closest('[data-tray],[data-slot]');
    if (!el)
        return;
    var tk = el.getAttribute('data-tray'), sid = el.getAttribute('data-slot');
    D = { sv: sv, q0: q2(e, sv), moved: false, slot: sid };
    if (tk) {
        D.part = JSON.parse(JSON.stringify(TR.filter(function (t) { return t.k === tk; })[0].p));
        D.tray = 1;
    }
    else
        D.part = get(SPS.b, sid);
    sv.setPointerCapture(e.pointerId);
    e.preventDefault();
});
// Drag step 2: pointer move. After a few pixels it becomes a drag, so show the floating part and highlight the nearest slot.
document.addEventListener('pointermove', function (e) {
    if (!D || !SPS)
        return;
    var q = q2(e, D.sv);
    if (!D.moved && SPS.pg.tray && D.part && Math.hypot(q.x - D.q0.x, q.y - D.q0.y) > 6) {
        D.moved = true;
        $('gh').innerHTML = pv(D.part, { P: 0 });
        if (!D.tray) {
            put(SPS.b, D.slot, null);
            draw();
        }
    }
    if (D.moved) {
        $('gh').setAttribute('transform', 'translate(' + q.x + ' ' + q.y + ')');
        var n = nearS(q);
        if (n !== SPS.hot) {
            SPS.hot = n;
            draw();
        }
    }
});
// Drag step 3: pointer up. Drop near a slot = place it. Drop elsewhere = remove it.
// No movement = a tap: tap a tray part to auto-place it, tap a part to change it, or tap to select it for the meter.
function endDrag(e, cancel) {
    if (!D || !SPS)
        return;
    var n = nearS(q2(e, D.sv)), p = D.part, RV = [100, 220, 470, 1000];
    if (D.moved) {
        $('gh').innerHTML = '';
        if (n && !cancel)
            put(SPS.b, n, p);
    }
    else if (D.tray) {
        for (var id in lay(SPS.b).L)
            if (!get(SPS.b, id)) {
                put(SPS.b, id, p);
                break;
            }
    }
    else if (SPS.pg.probe) {
        SPS.sel = D.slot;
    }
    else if (p) {
        if (p.t === 'res')
            put(SPS.b, D.slot, { t: 'res', R: RV[(RV.indexOf(p.R) + 1) % 4] });
        else if (p.t === 'sw')
            put(SPS.b, D.slot, { t: 'sw', on: !p.on });
    }
    D = null;
    SPS.hot = null;
    draw();
}
// Both pointerup and pointercancel finish a drag.
document.addEventListener('pointerup', function (e) { endDrag(e, false); });
document.addEventListener('pointercancel', function (e) { endDrag(e, true); });
/* buttons */
// ===== 9. BUTTONS =====
// Event delegation: one click listener handles every button by looking at its data-go attribute or its id.
document.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b)
        return;
    if (b.dataset.go)
        return go(b.dataset.go);
    if (b.classList.contains('opt'))
        return pickOpt(b);
    if (b.id === 'qs')
        return submitQ();
    if (b.id === 'nq') {
        CQ = CALC[cur]();
        return showQ();
    }
    if (b.id === 'ab') {
        var v = parseFloat($('av').value);
        if (isNaN(v))
            return fb('Enter a number first.', 'warn');
        if (CQ) {
            if (Math.abs(v - CQ.a) <= Math.abs(CQ.a) * 0.02 + 0.05) {
                cc++;
                fb('Correct! The answer is ' + (+CQ.a.toFixed(2)) + ' ' + CQ.u + '.', 'ok');
                $('cn').textContent = 'Correct so far: ' + cc;
                if (cc >= 3)
                    mark(cur);
            }
            else
                fb('Not quite. Hint: ' + CQ.h, 'bad');
            return;
        }
        if (SPS) {
            var a = SPS.pg.ask, ans = a.ans(solve(SPS.b));
            if (Math.abs(v - ans) <= a.tol) {
                SPS.asked = true;
                mark(cur);
                fb('Correct. Measured value: ' + ans.toFixed(1) + ' ' + a.u + '.', 'ok');
                draw();
            }
            else
                fb('Not quite. Check the meter and the part you are measuring.', 'bad');
        }
        return;
    }
    if (b.id === 'rs') {
        SPS.b = SPS.pg.b();
        SPS.sel = null;
        SPS.asked = false;
        $('cf').style.display = 'none';
        setDx();
        return draw();
    }
    if (b.id === 'nw') {
        SPS.b = SPS.pg.b();
        SPS.sel = null;
        setDx();
        $('cf').style.display = 'none';
        return draw();
    }
    if (b.id === 'dxb') {
        var id = $('dx').value;
        if (!id)
            return fb('Choose a part first.', 'warn');
        var p = get(SPS.b, id);
        if (p && p.fault) {
            fb('Correct. That part has failed and is open.', 'ok');
            if (SPS.pg.nw) {
                SPS.solved++;
                if (SPS.solved >= 2)
                    mark(cur);
            }
            else
                mark(cur);
        }
        else
            fb('Not that one. Measure each part. A failed part in series shows the full battery voltage.', 'bad');
    }
});
// Changing the multimeter mode redraws the reading.
document.addEventListener('change', function (e) { if (e.target.id === 'mm' && SPS)
    draw(); });
nav();
render();
