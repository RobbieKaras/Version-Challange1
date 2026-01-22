// =========================
// Frontline Atlas Demo JS
// HTML/CSS/JS + Leaflet
// =========================

// 1) Setup Map
const incidentLoc = [38.4495, -78.8689];

const map = L.map('map', { zoomControl: false }).setView(incidentLoc, 16);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

// Optional: scale bar makes it feel more “GIS real”
L.control.scale({ imperial: true, metric: true }).addTo(map);

// 2) Layer Management (toggles control these)
const layers = {
  incident: L.layerGroup().addTo(map),
  units: L.layerGroup().addTo(map),
  hydrants: L.layerGroup(),   // off by default
  closures: L.layerGroup(),   // off by default
  lz: L.layerGroup()          // off by default
};

function setLayerVisible(key, visible) {
  const group = layers[key];
  if (!group) return;
  const onMap = map.hasLayer(group);
  if (visible && !onMap) group.addTo(map);
  if (!visible && onMap) map.removeLayer(group);
}

// 3) Add Demo Data

// Incident marker
const incidentMarker = L.marker(incidentLoc, {
  icon: L.divIcon({
    className: 'hazard-pulse',
    html: '<div class="bg-red-600 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm">🔥</div>',
    iconSize: [32, 32]
  })
}).bindPopup("<b>Structure Fire</b><br>1289 Main St");

incidentMarker.addTo(layers.incident);

// Units (more units makes map feel alive)
const units = [
  { id: "E-101", type: "Engine", status: "On Scene", eta: "0:00", latlng: [38.4510, -78.8675] },
  { id: "T-04",  type: "Truck",  status: "Operating", eta: "—",   latlng: [38.4499, -78.8679] },
  { id: "M-2",   type: "Medic",  status: "En Route", eta: "2:10", latlng: [38.4489, -78.8702] },
  { id: "BC-1",  type: "Chief",  status: "En Route", eta: "3:20", latlng: [38.4479, -78.8698] },
  { id: "PD-3",  type: "Police", status: "On Scene", eta: "—",    latlng: [38.4490, -78.8670] }
];

const unitMarkers = new Map();

// Simple icon by unit type (keeps it readable)
function unitIconEmoji(type) {
  switch (type) {
    case "Engine": return "🚒";
    case "Truck": return "🚛";
    case "Medic": return "🚑";
    case "Chief": return "🧑‍✈️";
    case "Police": return "🚓";
    default: return "📍";
  }
}

units.forEach(u => {
  const marker = L.marker(u.latlng, {
    title: u.id,
    icon: L.divIcon({
      className: "",
      html: `<div class="bg-slate-900/90 border border-slate-600 rounded-lg px-2 py-1 text-[12px] font-black">
              <span class="mr-1">${unitIconEmoji(u.type)}</span>${u.id}
            </div>`,
      iconSize: [64, 28]
    })
  }).bindPopup(`<b>${u.id}</b><br>${u.type}<br>Status: ${u.status}<br>ETA: ${u.eta}`);

  marker.addTo(layers.units);
  unitMarkers.set(u.id, marker);
});

// Hydrants
const hydrants = [
  [38.4491, -78.8698],
  [38.4502, -78.8694],
  [38.4506, -78.8684]
];

hydrants.forEach(h => {
  L.circleMarker(h, { radius: 5, color: '#3b82f6', fillOpacity: 0.8 })
    .bindTooltip("Hydrant")
    .addTo(layers.hydrants);
});

// Closures (polyline)
const closureLine = L.polyline(
  [[38.4497, -78.8706], [38.4497, -78.8678]],
  { dashArray: "6 6" }
).bindTooltip("Road Closed");
closureLine.addTo(layers.closures);

// Landing Zone (polygon)
const lzPoly = L.polygon([
  [38.4509, -78.8701],
  [38.4509, -78.8696],
  [38.4505, -78.8696],
  [38.4505, -78.8701]
]).bindTooltip("Helicopter LZ");
lzPoly.addTo(layers.lz);

// Start with incident + units visible
setLayerVisible("hydrants", false);
setLayerVisible("closures", false);
setLayerVisible("lz", false);

// 4) Bottom bar toggle logic
document.querySelectorAll(".layer-btn[data-layer]").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.layer;
    const isActive = btn.classList.contains("active");
    btn.classList.toggle("active", !isActive);
    setLayerVisible(key, !isActive);
  });
});

// 5) Unit drawer rendering (click to center)
const unitListEl = document.getElementById("unitList");

function renderUnitList() {
  unitListEl.innerHTML = "";
  units.forEach(u => {
    const row = document.createElement("div");
    row.className = "unit-row";
    row.innerHTML = `
      <div>
        <div class="unit-name">${u.id}</div>
        <div class="unit-meta">${u.type} • ETA ${u.eta}</div>
      </div>
      <div class="unit-status">${u.status}</div>
    `;
    row.addEventListener("click", () => {
      const m = unitMarkers.get(u.id);
      if (!m) return;
      map.setView(m.getLatLng(), 17, { animate: true });
      m.openPopup();
    });
    unitListEl.appendChild(row);
  });
}

renderUnitList();

// Drawer collapse
const drawer = document.getElementById("unitDrawer");
document.getElementById("drawerToggle").addEventListener("click", () => {
  drawer.classList.toggle("collapsed");
});

// 6) Live Call Notes simulation (button + optional timed drip)
const feedEl = document.getElementById('dispatch-feed');

function nowTimeShort() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const demoNotes = [
  { who: "DISPATCH", text: "Caller reports flames visible from rear window." },
  { who: "DISPATCH", text: "Neighbor reports elderly occupant may still be inside." },
  { who: "E-101", text: "Heavy smoke on Alpha side. Establishing Main St Command." },
  { who: "DISPATCH", text: "Utilities notified. Power shutoff requested." },
  { who: "PD-3", text: "Traffic control established at Mason / Liberty." },
  { who: "T-04", text: "Primary search started on Floor 1." }
];

let noteIdx = 0;

function prependFeedEntry(who, text, tone = "text-blue-400") {
  const div = document.createElement('div');
  div.className = "feed-entry";
  div.innerHTML = `<span class="${tone}">[${nowTimeShort()}]</span> ${who}: ${text}`;
  feedEl.prepend(div);
}

document.getElementById("simulateBtn").addEventListener("click", () => {
  const note = demoNotes[noteIdx % demoNotes.length];
  prependFeedEntry(note.who, note.text);
  noteIdx++;
});

// Optional: also drip updates every 10s (comment out if you want only button-driven)
setInterval(() => {
  if (noteIdx < demoNotes.length) {
    const note = demoNotes[noteIdx];
    prependFeedEntry(note.who, note.text);
    noteIdx++;
  }
}, 10000);

// 7) Clock update
setInterval(() => {
  document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

// 8) Optional: fake FirstNet degradation toggle (easy “wow” demo)
// Uncomment to simulate changes every ~25s
/*
const firstnetEl = document.getElementById("firstnetStatus");
let ok = true;
setInterval(() => {
  ok = !ok;
  if(ok){
    firstnetEl.textContent = "FirstNet: Connected";
    firstnetEl.className = "text-orange-500";
  }else{
    firstnetEl.textContent = "FirstNet: Degraded";
    firstnetEl.className = "text-yellow-400";
  }
}, 25000);
*/
