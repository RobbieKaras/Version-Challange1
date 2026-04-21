#  Frontline Atlas

**Real-Time Situational Intelligence for First Responders**

Frontline Atlas is a unified, browser-based mapping and intelligence platform for fire, EMS, police, and dispatch. It consolidates live incident mapping, address-level hazard intelligence, and real-time call notes into a single, clean interface — designed to work even when connectivity degrades.


---

## The Problem

Emergency responders often arrive on scene with limited situational awareness. Critical information — prior incident history, known hazards, access challenges, resource locations — is fragmented across radios, CAD systems, and basic mapping tools. Legacy radio systems limit coordination, and FirstNet connectivity can degrade or fail during major incidents, leaving crews blind at the worst possible moment.

---

##  The Solution

Frontline Atlas brings all of that context into one resilient interface:

- **Live Incident & Unit Mapping** — Real-time visualization of units, incidents, staging areas, and unit status on an interactive map.
- **Address History & Hazard Intelligence** — Pre-arrival access to responder-entered hazard notes (dogs, oxygen tanks, hoarding, weapons, access codes, blocked entry points) and prior call history at the address.
- **Live Call Notes & Real-Time Scene Updates** — Dispatch continuously updates call notes while on the phone; arriving units relay new scene information back, which instantly syncs to all responding crews.
- **Emergency Resource Layers** — Toggle fire hydrants, water sources, helicopter landing zones, building access points, and road closures on the map.
- **Responder-Generated Intelligence Network** — Crews add notes after calls that become shared operational intelligence for all future responses.
- **Resilient Connectivity & Offline Mode** — Cached maps and data remain available during FirstNet outages or degraded service.

---

##  Demo

This repository is a **working front-end prototype** of the Frontline Atlas Incident Command View. It simulates a live structure fire response in Harrisonburg, VA.

### Features in the Demo

| Feature | How to interact |
|---|---|
| Live map with unit markers | Click any unit marker for status/ETA popup |
| Unit drawer | Click any row to center the map on that unit; collapse with the ▾ toggle |
| Layer controls | Toggle **Units, Incident, Hydrants, Closures, LZ** with the bottom bar buttons |
| Live call notes feed | Auto-drips simulated updates every 10 seconds |
| Manual dispatch entry | Select a source (Dispatch, E-101, Medic, Police), type a note, press **Send** or hit Enter |
| Simulated dispatch updates | Click the **🧠 Dispatch** button to step through pre-written scenario updates |
| Network status simulation | FirstNet status bar toggles between "Connected" and "Degraded" every 25 seconds to demonstrate offline resilience |

---

##  Getting Started

No build step or dependencies required. Just open the file.

```bash
git clone https://github.com/<your-username>/Version-Challange1.git
cd Version-Challange1
open index.html   # or just double-click it
```

Or serve it locally for the best experience:

```bash
# Python 3
python -m http.server 8080
# then visit http://localhost:8080
```

---

##  Project Structure

```
├── index.html    # Main UI — layout, panels, map container, layer controls
├── style.css     # Custom styles (unit drawer, layer buttons, hazard pulse animation, feed entries)
└── script.js     # Leaflet map setup, unit/layer/marker logic, live call notes feed, clock
```

---

##  Tech Stack

| Library | Purpose |
|---|---|
| [Leaflet.js 1.9.4](https://leafletjs.com/) | Interactive map rendering |
| [CARTO Dark Basemap](https://carto.com/basemaps/) | Dark-mode map tiles |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first UI styling |

No frameworks, no build tools, no backend. Pure HTML/CSS/JS.

---

##  Architecture Overview

The prototype demonstrates the intended high-level architecture:

```
Mobile/Tablet App (in-vehicle)
        │
        ├── Leaflet Map (live tiles + cached offline tiles)
        ├── Encrypted local cache (SQLite) — Maps, Hazards, Resources
        │
        └── Secure cloud sync ←→ Frontline Atlas Intelligence Cloud
                                        │
                                ┌───────┴────────┐
                              Dispatch        Responders
                             (call notes)   (hazard notes)
```

**Offline resilience:** Map tiles and hazard data are cached locally so the interface remains fully functional during FirstNet outages. Updates queue and sync when connectivity is restored.

---

##  Future Vision

- AI-assisted hazard prediction and risk scoring
- Automated pre-arrival safety briefings
- Integration with CAD, RMS, and dispatch analytics systems
- Nationwide shared hazard and access intelligence network
- Verizon 5G traffic prioritization and network slicing for low-latency performance at major incidents

---

##  About

**Robbie Karas**  
James Madison University — Computer Information Systems  

This project was developed for the Verizon Frontline challenge. The concept was informed by direct feedback from a career firefighter and EMS responder and validated against real operational challenges observed in daily emergency response.

---

##  Disclaimer

This is a prototype built with demo data only. All incident data, addresses, unit positions, and call notes are simulated for demonstration purposes.
