// 1. Map Init
const incidentLatLng = [38.4496, -78.8717];
const map = L.map('map', { zoomControl: false }).setView(incidentLatLng, 16);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

// 2. Layer Groups
const layers = {
  incident: L.layerGroup().addTo(map),
  units: L.layerGroup().addTo(map),
  hydrants: L.layerGroup(),
  closures: L.layerGroup()
};

// 3. Demo Data
const units = [
  { id: "E-101", status: "On Scene", latlng: [38.4502,-78.8713] },
  { id: "T-04",  status: "Operating", latlng: [38.4493,-78.8711] },
  { id: "M-2",   status: "En Route", latlng: [38.4489,-78.8722] }
];

// Add Markers
L.circleMarker(incidentLatLng, { radius: 10, color: 'red', fillOpacity: 0.8 }).addTo(layers.incident);

const unitMarkers = new Map();
units.forEach(u => {
    const m = L.marker(u.latlng).addTo(layers.units).bindTooltip(u.id, {permanent:true});
    unitMarkers.set(u.id, m);
});

// 4. Toggle Logic
document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    const layerKey = btn.dataset.layer;
    btn.classList.toggle("active");
    if (map.hasLayer(layers[layerKey])) {
        map.removeLayer(layers[layerKey]);
    } else {
        map.addLayer(layers[layerKey]);
    }
  });
});

// 5. Unit List Rendering
const list = document.getElementById("unitList");
units.forEach(u => {
    const row = document.createElement("div");
    row.className = "unit-row";
    row.innerHTML = `<span class="font-bold">${u.id}</span><span class="text-[10px] text-slate-400">${u.status}</span>`;
    row.onclick = () => map.setView(u.latlng, 18);
    list.appendChild(row);
});

// 6. Simulation Logic
const updates = [
    { who: "DISPATCH", text: "Smoke visible from Roof Alpha side." },
    { who: "E-101", text: "Establishing Command. Requesting 2nd alarm." },
    { who: "PD", text: "Perimeter established at Main St." }
];
let idx = 0;

document.getElementById("simulateBtn").onclick = () => {
    const u = updates[idx % updates.length];
    const el = document.createElement("div");
    el.className = "note-line";
    el.innerHTML = `<span class="text-blue-400 font-mono text-[10px] mr-2">[${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}]</span> <b>${u.who}:</b> ${u.text}`;
    document.getElementById("callNotes").prepend(el);
    idx++;
};

// Drawer Toggle
document.getElementById("drawerToggle").onclick = () => {
    document.getElementById("unitDrawer").classList.toggle("collapsed");
};
