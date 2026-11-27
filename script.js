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
const THREE_MODULE_URL =
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
const THREE_CAMERA_HOME = { theta: -0.72, phi: 0.67, radius: 690 };
let threeScene = null;
let threeCamera = null;
let threeRenderer = null;
let threeModel = null;
let threeLoadPromise = null;
let threeResizeObserver = null;
let threeRenderFrame = 0;
let threeDrag = null;
let threeRaycaster = null;
let threeTerminalHitAreas = [];
let threeWireMeshes = [];
let threeSwitchMeshes = [];
let threePreviewWire = null;
let threeSwitchMotions = [];
let threeSwitchAnimationFrame = 0;
let threeRenderedState = null;
let threeRenderedActivity = -1;
let threeCameraState = { ...THREE_CAMERA_HOME };
let view3D = false;

function loadThreeLibrary() {
  if (window.THREE) return Promise.resolve(window.THREE);
  if (threeLoadPromise) return threeLoadPromise;

  // Keep the 2D simulator lightweight until the user asks for 3D.
  threeLoadPromise = import(THREE_MODULE_URL)
    .then((library) => {
      window.THREE = library;
      return library;
    })
    .catch((error) => {
      threeLoadPromise = null;
      throw error;
    });

  return threeLoadPromise;
}

function setThreeMessage(message) {
  const messageElement = $("threeMessage");
  messageElement.textContent = message;
  messageElement.hidden = !message;
}

function updateViewControls() {
  $("stage").classList.toggle("is-3d", view3D);
  $("view2D").setAttribute("aria-pressed", String(!view3D));
  $("view3D").setAttribute("aria-pressed", String(view3D));
  $("threeControls").hidden = !view3D;
  $("svg").inert = view3D;
  $("svg").setAttribute("aria-hidden", String(view3D));
  $("threeCanvas").setAttribute("aria-hidden", String(!view3D));
  $("threeCanvas").setAttribute(
    "aria-label",
    `3D model of ${ACTS[cur].title}. Click a switch or breaker to toggle it, drag between terminals to connect wires, drag a wire to remove it, or drag elsewhere to rotate.`,
  );
}

function setCameraPosition() {
  if (!threeCamera) return;
  const { theta, phi, radius } = threeCameraState;
  const sinPhi = Math.sin(phi);
  threeCamera.position.set(
    radius * sinPhi * Math.cos(theta),
    radius * sinPhi * Math.sin(theta),
    radius * Math.cos(phi),
  );
  threeCamera.up.set(0, 0, 1);
  threeCamera.lookAt(0, 0, 0);
  requestThreeDraw();
}

function init3D() {
  const T = window.THREE;
  const canvas = $("threeCanvas");
  const stage = $("stage");
  if (!T || !canvas || !stage) {
    throw new Error("The 3D canvas or Three.js library is unavailable.");
  }

  const bounds = stage.getBoundingClientRect();
  if (!bounds.width || !bounds.height) {
    throw new Error("The 3D canvas does not have a visible size.");
  }

  threeScene = new T.Scene();
  threeScene.background = new T.Color("#071426");
  threeCamera = new T.PerspectiveCamera(
    42,
    bounds.width / bounds.height,
    1,
    1800,
  );
  threeCamera.up.set(0, 0, 1);
  threeModel = new T.Group();
  threeScene.add(threeModel);
  threeRaycaster = new T.Raycaster();

  threeRenderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "low-power",
  });
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  threeRenderer.setSize(bounds.width, bounds.height, false);
  threeRenderer.outputColorSpace = T.SRGBColorSpace;
  threeRenderer.toneMapping = T.ACESFilmicToneMapping;
  threeRenderer.toneMappingExposure = 1.1;
  threeRenderer.shadowMap.enabled = true;
  threeRenderer.shadowMap.type = T.PCFSoftShadowMap;

  threeScene.add(new T.AmbientLight(0xc8e3ff, 1.5));

  const keyLight = new T.DirectionalLight(0x9beaff, 2.2);
  keyLight.position.set(-180, -220, 360);
  keyLight.castShadow = true;
  threeScene.add(keyLight);

  const warmLight = new T.DirectionalLight(0xffb84a, 1.4);
  warmLight.position.set(180, 90, 260);
  threeScene.add(warmLight);

  const rimLight = new T.PointLight(0x00caff, 65, 520);
  rimLight.position.set(-10, 170, 140);
  threeScene.add(rimLight);

  threeCameraState = { ...THREE_CAMERA_HOME };
  setCameraPosition();
  setupThreeControls(canvas);

  if (window.ResizeObserver) {
    threeResizeObserver = new ResizeObserver(resize3D);
    threeResizeObserver.observe(stage);
  }
  window.addEventListener("resize", resize3D);
}

function resize3D() {
  if (!threeCamera || !threeRenderer) return;
  const bounds = $("stage").getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  threeCamera.aspect = bounds.width / bounds.height;
  threeCamera.updateProjectionMatrix();
  threeRenderer.setSize(bounds.width, bounds.height, false);
  requestThreeDraw();
}

function setupThreeControls(canvas) {
  canvas.addEventListener("pointerdown", (event) => {
    if (!view3D || event.button !== 0 || !threeCamera || !threeRaycaster) return;
    let mode = "camera";
    let terminalId = null;
    let wireIndex = null;
    let toggleId = null;

    terminalId = terminalAt3D(event, canvas);
    if (terminalId) {
      mode = "connect";
    } else {
      wireIndex = wireAt3D(event, canvas);
      if (Number.isInteger(wireIndex)) mode = "remove";
      else {
        toggleId = switchAt3D(event, canvas);
        if (toggleId) mode = "switch";
      }
    }

    threeDrag = {
      pointerId: event.pointerId,
      mode,
      x: event.clientX,
      y: event.clientY,
      terminalId,
      wireIndex,
      toggleId,
    };
    if (mode === "connect") {
      canvas.style.cursor = "crosshair";
      createPreviewWire3D(pos3D(terminalId));
    } else if (mode === "remove") {
      canvas.style.cursor = "pointer";
    } else if (mode === "switch") {
      canvas.style.cursor = "pointer";
    }
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!view3D || !threeDrag || threeDrag.pointerId !== event.pointerId) return;
    if (
      threeDrag.mode === "switch" &&
      Math.hypot(event.clientX - threeDrag.x, event.clientY - threeDrag.y) >= 7
    ) {
      threeDrag.mode = "camera";
      canvas.style.cursor = "grabbing";
    }
    if (threeDrag.mode === "camera") {
      const dx = event.clientX - threeDrag.x;
      const dy = event.clientY - threeDrag.y;
      threeDrag.x = event.clientX;
      threeDrag.y = event.clientY;
      threeCameraState.theta -= dx * 0.008;
      threeCameraState.phi = Math.max(
        0.2,
        Math.min(1.42, threeCameraState.phi + dy * 0.006),
      );
      setCameraPosition();
    } else if (threeDrag.mode === "connect") {
      const targetId = terminalAt3D(event, canvas);
      const end = targetId
        ? pos3D(targetId)
        : pointerPoint3D(event, canvas);
      if (end) updatePreviewWire3D(end);
    }
  });

  canvas.addEventListener("pointerup", (event) => {
    if (!threeDrag || threeDrag.pointerId !== event.pointerId) return;
    const drag = threeDrag;
    threeDrag = null;
    canvas.style.cursor = "";

    if (drag.mode === "connect") {
      const targetId = terminalAt3D(event, canvas);
      clearPreviewWire3D();
      if (targetId && targetId !== drag.terminalId) {
        const previousCount = wires.length;
        addWire(drag.terminalId, targetId);
        if (wires.length !== previousCount) {
          sel = null;
          update();
          return;
        }
      }
      requestThreeDraw();
    } else if (drag.mode === "switch") {
      toggleCircuitSwitch(drag.toggleId);
    } else if (
      drag.mode === "remove" &&
      Number.isInteger(drag.wireIndex) &&
      drag.wireIndex >= 0 &&
      drag.wireIndex < wires.length
    ) {
      wires.splice(drag.wireIndex, 1);
      sel = null;
      update();
    }
  });

  canvas.addEventListener("pointercancel", (event) => {
    if (!threeDrag || threeDrag.pointerId !== event.pointerId) return;
    if (threeDrag.mode === "connect") clearPreviewWire3D();
    threeDrag = null;
    canvas.style.cursor = "";
    requestThreeDraw();
  });
  canvas.addEventListener("wheel", (event) => {
    if (!view3D) return;
    event.preventDefault();
    zoom3D(event.deltaY < 0 ? 0.9 : 1.1);
  }, { passive: false });
}

function setThreePointerRay(event, canvas) {
  if (!threeRaycaster || !threeCamera) return false;
  const bounds = canvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return false;
  const pointer = new window.THREE.Vector2(
    ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
    -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
  );
  threeRaycaster.setFromCamera(pointer, threeCamera);
  return true;
}

function terminalAt3D(event, canvas) {
  if (!setThreePointerRay(event, canvas)) return null;
  const hit = threeRaycaster.intersectObjects(threeTerminalHitAreas, false)[0];
  return hit ? hit.object.userData.terminalId : null;
}

function wireAt3D(event, canvas) {
  if (!setThreePointerRay(event, canvas)) return null;
  const hit = threeRaycaster.intersectObjects(threeWireMeshes, false)[0];
  return hit ? hit.object.userData.wireIndex : null;
}

function switchAt3D(event, canvas) {
  if (!setThreePointerRay(event, canvas)) return null;
  const hit = threeRaycaster.intersectObjects(threeSwitchMeshes, false)[0];
  return hit ? hit.object.userData.toggleId : null;
}

function pointerPoint3D(event, canvas) {
  if (!setThreePointerRay(event, canvas)) return null;
  const T = window.THREE;
  const boardPlane = new T.Plane(new T.Vector3(0, 0, 1), -26);
  return threeRaycaster.ray.intersectPlane(boardPlane, new T.Vector3());
}

function createPreviewWire3D(start) {
  const T = window.THREE;
  const initialEnd = start.clone().add(new T.Vector3(0, 0, 1));
  const curve = new T.CatmullRomCurve3([start, initialEnd]);
  threePreviewWire = new T.Mesh(
    new T.TubeGeometry(curve, 20, 1.8, 8, false),
    material3D("#72eaff", {
      roughness: 0.24,
      emissive: "#00a9d2",
      emissiveIntensity: 0.8,
    }),
  );
  threePreviewWire.frustumCulled = false;
  threeModel.add(threePreviewWire);
  requestThreeDraw();
}

function updatePreviewWire3D(end) {
  if (!threePreviewWire || !threeDrag || !threeDrag.terminalId) return;
  const T = window.THREE;
  const start = pos3D(threeDrag.terminalId);
  const arc = new T.Vector3(
    (start.x + end.x) / 2,
    (start.y + end.y) / 2,
    34 + Math.min(10, Math.abs(start.x - end.x) * 0.025),
  );
  const curve = new T.CatmullRomCurve3(
    [start, start.clone().lerp(arc, 0.55), arc, end.clone().lerp(arc, 0.55), end],
    false,
    "centripetal",
  );
  const geometry = new T.TubeGeometry(curve, 20, 1.8, 8, false);
  threePreviewWire.geometry.dispose();
  threePreviewWire.geometry = geometry;
  requestThreeDraw();
}

function clearPreviewWire3D() {
  if (!threePreviewWire) return;
  threeModel.remove(threePreviewWire);
  disposeThreeObject(threePreviewWire);
  threePreviewWire = null;
}

function zoom3D(factor) {
  threeCameraState.radius = Math.max(
    440,
    Math.min(1100, threeCameraState.radius * factor),
  );
  setCameraPosition();
}

function requestThreeDraw() {
  if (!view3D || !threeRenderer || threeRenderFrame) return;
  threeRenderFrame = requestAnimationFrame(() => {
    threeRenderFrame = 0;
    if (view3D && threeRenderer) threeRenderer.render(threeScene, threeCamera);
  });
}

function material3D(color, options = {}) {
  return new window.THREE.MeshStandardMaterial({
    color,
    roughness: 0.38,
    metalness: 0.22,
    ...options,
  });
}

function addBox3D(group, size, position, color, options = {}) {
  const T = window.THREE;
  const mesh = new T.Mesh(
    new T.BoxGeometry(size[0], size[1], size[2]),
    material3D(color, options),
  );
  mesh.position.set(position[0], position[1], position[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addCylinder3D(group, radiusTop, radiusBottom, height, position, color, options = {}) {
  const T = window.THREE;
  const mesh = new T.Mesh(
    new T.CylinderGeometry(radiusTop, radiusBottom, height, 24),
    material3D(color, options),
  );
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(position[0], position[1], position[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addLabel3D(group, text, position, size = [52, 11]) {
  const T = window.THREE;
  const label = document.createElement("canvas");
  label.width = 512;
  label.height = 112;
  const context = label.getContext("2d");
  context.fillStyle = "rgba(5, 17, 33, 0.88)";
  context.beginPath();
  if (context.roundRect) context.roundRect(6, 6, 500, 100, 26);
  else context.rect(6, 6, 500, 100);
  context.fill();
  context.fillStyle = "#e7f8ff";
  context.font = "700 54px system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 256, 57, 470);

  const texture = new T.CanvasTexture(label);
  texture.colorSpace = T.SRGBColorSpace;
  const sprite = new T.Sprite(
    new T.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  sprite.position.set(position[0], position[1], position[2]);
  sprite.scale.set(size[0], size[1], 1);
  group.add(sprite);
}

function addBoard3D() {
  const T = window.THREE;
  const shape = new T.Shape();
  const left = -106;
  const right = 106;
  const bottom = -180;
  const top = 180;
  const radius = 16;
  shape.moveTo(left + radius, bottom);
  shape.lineTo(right - radius, bottom);
  shape.quadraticCurveTo(right, bottom, right, bottom + radius);
  shape.lineTo(right, top - radius);
  shape.quadraticCurveTo(right, top, right - radius, top);
  shape.lineTo(left + radius, top);
  shape.quadraticCurveTo(left, top, left, top - radius);
  shape.lineTo(left, bottom + radius);
  shape.quadraticCurveTo(left, bottom, left + radius, bottom);

  const boardGeometry = new T.ExtrudeGeometry(shape, {
    depth: 12,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 2,
    bevelThickness: 2,
  });
  const board = new T.Mesh(
    boardGeometry,
    material3D("#092653", { roughness: 0.3, metalness: 0.45 }),
  );
  board.position.z = -16;
  board.receiveShadow = true;
  threeModel.add(board);

  const edge = new T.LineSegments(
    new T.EdgesGeometry(boardGeometry),
    new T.LineBasicMaterial({ color: 0x00cfff, transparent: true, opacity: 0.72 }),
  );
  edge.position.copy(board.position);
  threeModel.add(edge);

  const holes = [];
  for (let x = -88; x <= 88; x += 22) {
    for (let y = -154; y <= 154; y += 22) {
      holes.push([x, y, -2.8]);
    }
  }
  const holeGeometry = new T.CircleGeometry(2.2, 12);
  const holeMaterial = material3D("#020a16", { roughness: 0.72, metalness: 0.1 });
  const holeMeshes = new T.InstancedMesh(holeGeometry, holeMaterial, holes.length);
  const matrix = new T.Matrix4();
  holes.forEach(([x, y, z], index) => {
    matrix.makeTranslation(x, y, z);
    holeMeshes.setMatrixAt(index, matrix);
  });
  holeMeshes.instanceMatrix.needsUpdate = true;
  threeModel.add(holeMeshes);
}

function addTerminal3D(group, componentId, terminal, color) {
  const T = window.THREE;
  const x = terminal.s === "l" ? -80 : 80;
  const y = -terminal.dy;
  addCylinder3D(group, 5.5, 7, 7, [x, y, 16.5], "#29394c");
  addCylinder3D(group, 5.5, 5.5, 2, [x, y, 21], "#e1a735", {
    color: "#e1a735",
    metalness: 0.8,
    roughness: 0.22,
  });
  const terminalMesh = new window.THREE.Mesh(
    new window.THREE.SphereGeometry(4.5, 16, 12),
    material3D(color, { metalness: 0.72, roughness: 0.2 }),
  );
  terminalMesh.position.set(x, y, 23);
  terminalMesh.castShadow = true;
  group.add(terminalMesh);

  const hitArea = new T.Mesh(
    new T.SphereGeometry(10, 12, 8),
    new T.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      colorWrite: false,
      depthWrite: false,
    }),
  );
  hitArea.position.copy(terminalMesh.position);
  hitArea.userData.terminalId = `${componentId}.${terminal.n}`;
  group.add(hitArea);
  threeTerminalHitAreas.push(hitArea);
}

function setThreeSwitchTransform(object, transform, axis, from, to, animate) {
  object[transform][axis] = animate ? from : to;
  if (animate && from !== to) {
    threeSwitchMotions.push({ object, transform, axis, from, to });
  }
}

function createComponent3D(component, previousState) {
  const T = window.THREE;
  const group = new T.Group();
  const height = component.h || 50;
  const litNow = lit();
  group.position.set(0, 200 - component.y, 0);
  threeModel.add(group);

  addBox3D(group, [144, height - 14, 10], [0, 0, 4], "#102b4b", {
    roughness: 0.48,
    metalness: 0.42,
  });
  addBox3D(group, [132, height - 21, 4], [0, 0, 11], "#0c1a2c");

  if (component.type === "bat") {
    addBox3D(group, [66, 34, 24], [0, 0, 24], "#d9e3f1", {
      roughness: 0.3,
      metalness: 0.28,
    });
    addBox3D(group, [42, 16, 2], [0, 2, 37], "#0a1830", {
      emissive: "#003d5e",
      emissiveIntensity: 0.4,
    });
    addLabel3D(group, "9V", [0, 2, 39], [27, 8]);
  } else if (component.type === "src") {
    addBox3D(group, [82, 46, 34], [0, 0, 29], "#d8e1ee", {
      roughness: 0.32,
      metalness: 0.24,
    });
    addBox3D(group, [51, 20, 2], [0, 5, 47], "#06142b", {
      emissive: "#005577",
      emissiveIntensity: 0.5,
    });
    addLabel3D(group, "5.0 V", [0, 5, 49], [34, 8]);
    addCylinder3D(group, 6, 6, 3, [-20, -14, 48], "#ef594a", {
      metalness: 0.7,
    });
    addCylinder3D(group, 6, 6, 3, [20, -14, 48], "#1d2735", {
      metalness: 0.7,
    });
  } else if (component.type === "sw" || component.type === "sw3") {
    const active = Boolean(state[component.id]);
    const previousActive = previousState
      ? Boolean(previousState[component.id])
      : active;
    const shouldAnimate =
      previousState !== null &&
      previousState !== undefined &&
      previousActive !== active;
    const switchHeight = component.type === "sw3" ? 56 : 30;
    addBox3D(
      group,
      [66, switchHeight, 13],
      [0, 0, 13],
      "#cbd8e8",
      { roughness: 0.3, metalness: 0.3 },
    );
    const rocker = addBox3D(
      group,
      [34, component.type === "sw3" ? 30 : 21, 12],
      [0, 0, 25],
      "#101a2a",
      { roughness: 0.28, metalness: 0.52 },
    );
    const targetRotation = active ? 0.2 : -0.2;
    const startRotation = previousActive ? 0.2 : -0.2;
    setThreeSwitchTransform(
      rocker,
      "rotation",
      "y",
      startRotation,
      targetRotation,
      shouldAnimate,
    );
    rocker.userData.toggleId = component.id;
    threeSwitchMeshes.push(rocker);
    const indicator = addBox3D(group, [24, 3, 1], [0, 0, 31], "#f1b740", {
      metalness: 0.7,
      roughness: 0.24,
    });
    const targetIndicatorY = active ? -5 : 5;
    const startIndicatorY = previousActive ? -5 : 5;
    setThreeSwitchTransform(
      indicator,
      "position",
      "y",
      startIndicatorY,
      targetIndicatorY,
      shouldAnimate,
    );
  } else if (component.type === "brk") {
    const active = Boolean(state[component.id]);
    const previousActive = previousState
      ? Boolean(previousState[component.id])
      : active;
    const shouldAnimate =
      previousState !== null &&
      previousState !== undefined &&
      previousActive !== active;
    addBox3D(group, [68, 36, 20], [0, 0, 17], "#dbe4ef", {
      roughness: 0.32,
      metalness: 0.28,
    });
    const lever = addBox3D(group, [18, 12, 20], [0, 0, 34], "#15243a", {
      roughness: 0.3,
      metalness: 0.42,
    });
    const targetRotation = active ? -0.28 : 0.28;
    const startRotation = previousActive ? -0.28 : 0.28;
    setThreeSwitchTransform(
      lever,
      "rotation",
      "y",
      startRotation,
      targetRotation,
      shouldAnimate,
    );
    lever.userData.toggleId = component.id;
    threeSwitchMeshes.push(lever);
    addBox3D(group, [13, 5, 2], [0, 0, 45], active ? "#4cd2a4" : "#ff9d24", {
      emissive: active ? "#164b39" : "#502600",
    });
  } else if (component.type === "button") {
    addBox3D(group, [58, 38, 17], [0, 0, 12], "#d1dce9", {
      roughness: 0.32,
      metalness: 0.3,
    });
    const pressed = !!state[component.id];
    addCylinder3D(
      group,
      12,
      14,
      9,
      [0, 0, pressed ? 24 : 28],
      pressed ? "#b83342" : "#f25c62",
      { roughness: 0.24, metalness: 0.25, emissive: "#3d1119", emissiveIntensity: 0.18 },
    );
    addCylinder3D(group, 7, 7, 2, [0, 0, pressed ? 29 : 33], "#ffbcc0");
  } else if (component.type === "lamp") {
    addCylinder3D(group, 18, 19, 12, [0, 0, 14], "#c9d6e5", {
      roughness: 0.28,
      metalness: 0.34,
    });
    addCylinder3D(group, 12, 15, 5, [0, 0, 22.5], "#d9a53b", {
      metalness: 0.78,
      roughness: 0.24,
    });
    addCylinder3D(group, 7, 7, 9, [0, 0, 29], "#9aa9bb", {
      metalness: 0.54,
      roughness: 0.28,
    });
    const bulbColor = litNow ? "#ffe39b" : "#66758a";
    const bulb = new T.Mesh(
      new T.SphereGeometry(12, 24, 18),
      material3D(bulbColor, {
        roughness: 0.14,
        metalness: 0.04,
        emissive: litNow ? "#ffae25" : "#101a2a",
        emissiveIntensity: litNow ? 1.5 : 0.08,
        transparent: true,
        opacity: 0.94,
      }),
    );
    bulb.position.set(0, 0, 42);
    bulb.castShadow = true;
    group.add(bulb);
    if (litNow) {
      const glow = new T.PointLight(0xffb83f, 18, 95);
      glow.position.set(0, 0, 43);
      group.add(glow);
    }
  } else if (component.type === "out") {
    addBox3D(group, [76, 43, 13], [0, 0, 13], "#e0e6ef", {
      roughness: 0.32,
      metalness: 0.2,
    });
    [-1, 1].forEach((side) => {
      addCylinder3D(group, 3.2, 3.2, 1.5, [side * 9, 3, 20.5], "#06101e");
      addCylinder3D(group, 3.2, 3.2, 1.5, [side * 9, -5, 20.5], "#06101e");
    });
    addCylinder3D(group, 2.2, 2.2, 1.5, [0, -9, 20.5], "#06101e");
    addCylinder3D(group, 2, 2, 1.5, [0, 13, 20.5], "#8795a7");
  }

  addLabel3D(group, component.name, [0, height / 2 + 7, 18], [62, 12]);
  component.terms.forEach((terminal) => {
    const color =
      terminal.col === "#d32f2f"
        ? "#ff5d4f"
        : terminal.col === "#2563eb"
          ? "#4a9eff"
          : terminal.col === "#555"
            ? "#313b49"
            : "#f3bd55";
    addTerminal3D(group, component.id, terminal, color);
  });
}

function pos3D(id) {
  const point = pos(id);
  return new window.THREE.Vector3(
    point.x - CX,
    200 - point.y,
    23,
  );
}

function wireColor3D(id) {
  const [componentId, terminalName] = id.split(".");
  const terminal = comp(componentId).terms.find((item) => item.n === terminalName);
  if (terminal.col === "#d32f2f") return 0xff5147;
  if (terminal.col === "#2563eb") return 0x398dff;
  if (terminal.col === "#555") return 0x252f3d;
  return 0x31caff;
}

function createWire3D(a, b, isLit, wireIndex) {
  const T = window.THREE;
  const start = pos3D(a);
  const end = pos3D(b);
  const arc = new T.Vector3(
    (start.x + end.x) / 2,
    (start.y + end.y) / 2,
    34 + Math.min(10, Math.abs(start.x - end.x) * 0.025),
  );
  const curve = new T.CatmullRomCurve3(
    [start, start.clone().lerp(arc, 0.55), arc, end.clone().lerp(arc, 0.55), end],
    false,
    "centripetal",
  );
  const color = wireColor3D(a);
  const wire = new T.Mesh(
    new T.TubeGeometry(curve, 32, 2.2, 8, false),
    material3D(color, {
      roughness: 0.24,
      metalness: 0.12,
      emissive: isLit ? 0xffc247 : color,
      emissiveIntensity: isLit ? 0.78 : 0.12,
    }),
  );
  wire.castShadow = true;
  wire.userData.wireIndex = wireIndex;
  threeModel.add(wire);
  threeWireMeshes.push(wire);

  if (isLit) {
    const halo = new T.Mesh(
      new T.TubeGeometry(curve, 32, 4.2, 8, false),
      new T.MeshBasicMaterial({
        color: 0xffb83f,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      }),
    );
    threeModel.add(halo);
  }
}

function disposeThreeObject(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (!child.material) return;
    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    materials.forEach((material) => {
      if (material.map) material.map.dispose();
      material.dispose();
    });
  });
}

function clearThreeModel() {
  while (threeModel.children.length) {
    const child = threeModel.children[0];
    threeModel.remove(child);
    disposeThreeObject(child);
  }
  threeTerminalHitAreas = [];
  threeWireMeshes = [];
  threeSwitchMeshes = [];
  threeSwitchMotions = [];
  threePreviewWire = null;
}

function animateThreeSwitches() {
  if (!threeSwitchMotions.length || !view3D || !threeRenderer) return;
  const motions = threeSwitchMotions;
  const duration = 260;
  let startTime = null;

  const animate = (time) => {
    if (!view3D || !threeRenderer) {
      threeSwitchAnimationFrame = 0;
      return;
    }
    if (startTime === null) startTime = time;
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    motions.forEach((motion) => {
      motion.object[motion.transform][motion.axis] =
        motion.from + (motion.to - motion.from) * eased;
    });
    threeRenderer.render(threeScene, threeCamera);

    if (progress < 1) {
      threeSwitchAnimationFrame = requestAnimationFrame(animate);
    } else {
      threeSwitchAnimationFrame = 0;
      threeSwitchMotions = [];
    }
  };

  threeSwitchAnimationFrame = requestAnimationFrame(animate);
}

function render3D() {
  if (!view3D || !threeScene || !threeModel) return;

  if (threeSwitchAnimationFrame) {
    cancelAnimationFrame(threeSwitchAnimationFrame);
    threeSwitchAnimationFrame = 0;
  }
  const previousState =
    threeRenderedActivity === cur ? threeRenderedState : null;

  try {
    clearThreeModel();
    addBoard3D();
    ACTS[cur].comps.forEach((component) =>
      createComponent3D(component, previousState),
    );
    // Draw only actual connections, not the activity's target wiring.
    wires.forEach(([a, b], index) => createWire3D(a, b, lit(), index));
    threeRenderedState = { ...state };
    threeRenderedActivity = cur;
    if (threeSwitchMotions.length) animateThreeSwitches();
    else requestThreeDraw();
  } catch (error) {
    console.error("The 3D circuit model could not be updated:", error);
    setThreeMessage("The 3D model could not update. Switch to 2D to continue.");
  }
}

async function setViewMode(show3D) {
  if (view3D === show3D && (!show3D || threeRenderer)) return;
  view3D = show3D;
  updateViewControls();

  if (!show3D) {
    if (threeSwitchAnimationFrame) {
      cancelAnimationFrame(threeSwitchAnimationFrame);
      threeSwitchAnimationFrame = 0;
    }
    setThreeMessage("");
    return;
  }

  setThreeMessage("Loading the 3D circuit model…");
  try {
    await loadThreeLibrary();
    if (!view3D) return;
    if (!threeRenderer) init3D();
    resize3D();
    setThreeMessage("");
    render3D();
  } catch (error) {
    console.error("The 3D view could not be started:", error);
    view3D = false;
    updateViewControls();
    setThreeMessage("3D view is unavailable. The 2D simulator is still active.");
  }
}

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
  if (!done && kind !== "sandbox" && kind !== "fault") return false;
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
  const sandbox = A.kind === "sandbox";
  $("guide").hidden = sandbox;
  $("explain").hidden = sandbox;
  $("undo").parentElement.classList.toggle("sandbox-tools", sandbox);
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
        ? "Something is wired wrong. Tap or drag a wire to remove it, or show the guide."
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
  render3D();
}
function a_label(i) {
  return ACTS[i].title + (solved.has(i) ? ", completed" : "");
}
function update() {
  done = check();
  render();
}
function toggleCircuitSwitch(id) {
  const kind = ACTS[cur].kind;
  if (
    done ||
    kind === "sandbox" ||
    (kind === "fault" && !shorted())
  ) {
    state[id] = !state[id];
    render();
  } else if (!done && !shorted()) {
    $("status").className = "bad";
    $("status").textContent = "Finish the wiring first, then switch it on.";
  }
}
function load(i, reset = false) {
  cur = i;
  if (view3D) updateViewControls();
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
      ? "How to wire: drag or tap between terminals. Tap or drag a wire to remove it. When the circuit is complete, press and hold the button to light the lamp; release it to turn the lamp off. Use Tab and Enter on a keyboard."
      : A.kind === "sandbox"
        ? "How to wire: drag or tap between terminals. Tap or drag a wire to remove it. In this sandbox, switches toggle freely and there is no pass or fail goal."
        : "How to wire: drag from one terminal (circle) to another, or tap one then the other. Tap or drag a wire to remove it. When the circuit is complete, tap the switch or breaker to turn it on. On a keyboard, use Tab and Enter.";
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
let pressedButton = false,
skipWireClick = false;
svg.addEventListener("pointerdown", (e) => {
  const g = e.target.closest('[data-tog="btn"]');
  if (g && done) {
    e.preventDefault();
    state.btn = true;
    pressedButton = true;
    render();
    return;
  }
  const w = e.target.closest(".hit[data-w]");
  if (w) {
    drag = {
      wireIndex: +w.dataset.w,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
    return;
  }
  const t = e.target.closest(".term");
  if (!t) return;
  e.preventDefault();
  drag = { id: t.dataset.t, moved: false };
});
window.addEventListener("pointermove", (e) => {
  if (!drag) return;
  if (Number.isInteger(drag.wireIndex)) {
    if (
      !drag.moved &&
      Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) >= 8
    )
      drag.moved = true;
    if (drag.moved) $("status").textContent = "Release to remove this wire.";
    return;
  }
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
  if (drag && Number.isInteger(drag.wireIndex)) {
    const d = drag;
    drag = null;
    if (d.moved) {
      wires.splice(d.wireIndex, 1);
      sel = null;
      skipWireClick = true;
      window.setTimeout(() => {
        skipWireClick = false;
      }, 0);
      update();
    }
    return;
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
    if (skipWireClick) {
      skipWireClick = false;
      return;
    }
    wires.splice(+w.dataset.w, 1);
    sel = null;
    update();
    return;
  }
  const g = e.target.closest("[data-tog]");
  if (g && g.dataset.tog === "btn") return;
  if (g) toggleCircuitSwitch(g.dataset.tog);
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
$("reset").onclick = () => {
  solved.delete(cur);
  load(cur, true);
};
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
  if (view3D) {
    resize3D();
    render3D();
  }
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
$("trySimulator").onclick = () => openApp(0);
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
$("view2D").onclick = () => setViewMode(false);
$("view3D").onclick = () => setViewMode(true);
$("zoomOut3D").onclick = () => zoom3D(1.15);
$("zoomIn3D").onclick = () => zoom3D(0.87);
$("reset3DView").onclick = () => {
  threeCameraState = { ...THREE_CAMERA_HOME };
  setCameraPosition();
};
restore();
load(cur);
updateViewControls();
show("home");
