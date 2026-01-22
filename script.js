// 1. Initialize Map
const incidentLoc = [38.4495, -78.8689];
const map = L.map('map', { zoomControl: false }).setView(incidentLoc, 16);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

// FIX: Force the map to fill the container 100ms after load
setTimeout(() => { map.invalidateSize(); }, 100);

// 2. Layer Groups
const layers = {
    incident: L.layerGroup().addTo(map),
    units: L.layerGroup().addTo(map),
    hydrants: L.layerGroup()
};

// 3. Demo Data
const units = [
    { id: "E-101", status: "On Scene", latlng: [38.4502, -78.8713] },
    { id: "T-04",  status: "Operating", latlng: [38.4493, -78.8711] },
    { id: "M-2",   status: "En Route", latlng: [38.4489, -78.8722] }
];

// Add Incident Marker
L.circleMarker(incidentLoc, { radius: 10, color: 'red', fillOpacity: 0.8 }).addTo(layers.incident);

// Add Unit Markers & Fill Drawer
const list = document.getElementById("unitList");
units.forEach(u => {
    // Add to Map
    L.marker(u.latlng).addTo(layers.units).bindTooltip(u.id, { permanent: true });
    
    // Add to Sidebar Drawer
    const row = document.createElement("div");
    row.className = "p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 flex justify-between";
    row.innerHTML = `<span class="font-bold text-xs">${u.id}</span><span class="text-[10px] text-slate-500">${u.status}</span>`;
    row.onclick = () => map.setView(u.latlng, 18);
    list.appendChild(row);
});

// 4. Toggle Controls
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

// 5. Drawer Collapse
document.getElementById("drawerToggle").onclick = () => {
    document.getElementById("unitDrawer").classList.toggle("collapsed");
};

// 6. Simulation Logic
const updates = [
    "Smoke visible from Roof Alpha side.",
    "E-101: Establishing Command. Requesting 2nd alarm.",
    "PD: Perimeter established at Main St."
];
let idx = 0;

document.getElementById("simulateBtn").onclick = () => {
    const text = updates[idx % updates.length];
    const el = document.createElement("div");
    el.className = "border-l-2 border-orange-500 pl-3 py-2 mb-2 text-sm bg-white/5";
    el.innerHTML = `<span class="text-blue-400 text-[10px] block font-mono">[${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}]</span>${text}`;
    document.getElementById("callNotes").prepend(el);
    idx++;
};
