// 1. Setup Map
const incidentLoc = [38.4495, -78.8689];
const map = L.map('map', { zoomControl: false }).setView(incidentLoc, 16);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

// 2. Layer Management
const unitLayer = L.layerGroup().addTo(map);
const hydrantLayer = L.layerGroup().addTo(map);

// 3. Add Demo Data
// Fire Incident
L.marker(incidentLoc, {
    icon: L.divIcon({
        className: 'hazard-pulse',
        html: '<div class="bg-red-600 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm">🔥</div>',
        iconSize: [32, 32]
    })
}).addTo(map);

// Units
const engineIcon = L.divIcon({ className: 'bg-red-500 w-3 h-3 rounded-sm border border-white' });
L.marker([38.4510, -78.8675], { icon: engineIcon }).addTo(unitLayer).bindTooltip("E-101", { permanent: true, className: 'unit-label' });

// Hydrants
L.circleMarker([38.4491, -78.8698], { radius: 5, color: '#3b82f6', fillOpacity: 0.8 }).addTo(hydrantLayer);

// 4. Toggle Logic
function toggleLayer(name) {
    const layer = name === 'units' ? unitLayer : hydrantLayer;
    map.hasLayer(layer) ? map.removeLayer(layer) : map.addLayer(layer);
}

// 5. Live Feed Simulation
const demoNotes = [
    "PD on scene: Smoke confirmed from Side Alpha.",
    "E-101: Arriving on scene. Setting up Command.",
    "CAUTION: Basement storage includes highly flammable oxidizers.",
    "TRUCK 04: Primary search initiated on Floor 1."
];

let noteIdx = 0;
setInterval(() => {
    if (noteIdx < demoNotes.length) {
        const div = document.createElement('div');
        div.className = "feed-entry";
        div.innerHTML = `<span class="text-blue-400">[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span> ${demoNotes[noteIdx]}`;
        document.getElementById('dispatch-feed').prepend(div);
        noteIdx++;
    }
}, 8000);

// Clock update
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);
