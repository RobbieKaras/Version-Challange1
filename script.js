// 1. Initialize Map
const incidentCoords = [38.4495, -78.8689];
const map = L.map('map', { zoomControl: false, attributionControl: false }).setView(incidentCoords, 16);

// 2. Add Dark Mode Basemap
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
}).addTo(map);

// 3. Custom Marker Helpers
const createUnitIcon = (color) => L.divIcon({
    className: 'custom-unit',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border: 2px solid white; border-radius: 3px; transform: rotate(45deg);"></div>`,
    iconSize: [14, 14]
});

// 4. Add Map Elements
// The Incident
const fireIcon = L.divIcon({
    className: 'hazard-glow',
    html: '<div class="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-base">🔥</div>',
    iconSize: [32, 32]
});
L.marker(incidentCoords, {icon: fireIcon}).addTo(map);

// The Units
L.marker([38.4520, -78.8660], {icon: createUnitIcon('#ef4444')}).addTo(map)
    .bindTooltip("Engine 101", {permanent: true, direction: 'right', className: 'unit-label'});

L.marker([38.4470, -78.8710], {icon: createUnitIcon('#ef4444')}).addTo(map)
    .bindTooltip("Truck 04", {permanent: true, direction: 'right', className: 'unit-label'});

// 5. Simulation Logic (Phase 3)
const simulationNotes = [
    { time: "14:21", text: "UPDATE: Smoke increasing from Roof Alpha side." },
    { time: "14:22", text: "PD ON SCENE: Heavy black smoke showing." },
    { time: "14:25", text: "ENGINE 101: On Scene. Laying 5-inch supply line." }
];

let noteIndex = 0;
const feedContainer = document.getElementById('dispatch-feed');

function triggerNextNote() {
    if (noteIndex < simulationNotes.length) {
        const note = simulationNotes[noteIndex];
        const noteDiv = document.createElement('div');
        noteDiv.className = "feed-entry";
        noteDiv.innerHTML = `<span class="text-blue-400 font-bold">[${note.time}]</span> <span class="text-slate-200">${note.text}</span>`;
        feedContainer.prepend(noteDiv);
        noteIndex++;
    }
}

// Start simulation after 4 seconds
setTimeout(() => {
    setInterval(triggerNextNote, 6000);
}, 4000);
