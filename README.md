# 🚀 ASTROVERSE — Junior Astronaut Mission Trainer
> **NASA Space Apps Challenge 2026**  
> *"Humanity's Next Home Is Beyond Earth. Beyond Earth, Every Decision Matters."*

ASTROVERSE is an interactive, scientifically rigorous space survival simulator designed primarily for students aged 7–12, educators, and space enthusiasts. Players assume the role of Commander of a research outpost on the Moon or Mars, managing an interconnected life-support system to keep a crew of 4 astronauts alive.

---

## 🌟 Key Features

### 1. 🪐 Dual Planetary Campaigns
- **Moon Outpost (Base Artemis):**
  - Surface Gravity: $1.62\text{ m/s}^2$ ($\approx 1/6\text{th}$ of Earth)
  - Atmospheric Pressure: Hard Vacuum ($\approx 3 \times 10^{-10}\text{ Pa}$)
  - Thermal Swings: Extreme night shadow vs. polar illumination (Peaks of Eternal Light)
  - Challenges: Abrasive lunar regolith dust, unattenuated Galactic Cosmic Rays (GCR), water ice prospecting in permanently shadowed polar craters (e.g., Shackleton / Cabeus).
- **Mars Outpost (Utopia Station):**
  - Surface Gravity: $3.71\text{ m/s}^2$ ($\approx 38\%$ of Earth)
  - Atmosphere: $95.3\%\text{ CO}_2$, surface pressure $\approx 0.61\text{ kPa}$ ($<1\%$ Earth sea level, below Armstrong line)
  - Diurnal Cycle: 1 Martian Sol = $24\text{h } 39\text{m } 35\text{s}$
  - Challenges: Massive planetary hematite dust storms reducing solar flux, sub-surface perchlorate salts in regolith, radio communication latency.

### 2. 🔬 Closed-Loop Life Support & Stoichiometric Physics Engine
- **Oxygen Generation (Water Electrolysis):**
  $$2\text{H}_2\text{O} \to 2\text{H}_2 + \text{O}_2$$
  - Real stoichiometric ratio: Consumes exactly $1.125\text{ kg}$ water per $1.0\text{ kg}$ oxygen produced.
  - Mars MOXIE solid-oxide electrolysis mode extracting $\text{O}_2$ directly from Martian $\text{CO}_2$.
- **Carbon Dioxide Removal Assembly (CDRA):**
  - Exhalation rate: $0.0417\text{ kg CO}_2/\text{hour}$ per astronaut ($\approx 1.0\text{ kg/day}$).
  - Regenerative zeolite and amine adsorption beds. Accumulation above $2,500\text{ ppm}$ induces hypercapnia warnings; $>5,000\text{ ppm}$ causes severe acidosis and cognitive degradation.
- **Closed-Loop Water Recovery System (WRS):**
  - Modeled after ISS Urine Processor Assembly (UPA) and Water Processor Assembly (WPA).
  - Recovers up to $90\%\text{ to } 98\%$ of crew wastewater, perspiration condensate, and hygiene water using vacuum rotary distillation and catalytic oxidation.
- **Power Grid & Load Shedding:**
  - Real diurnal solar irradiance curves modulated by dust opacity ($\tau$).
  - Automatic brownout triage trips non-critical breakers (Science Lab, Rover Station) to protect life support during deep night cycles.

### 3. 🤖 NOVA — Autonomous Holographic AI Assistant
- **Neural Operations & Virtual Astronaut Assistant:**
  - Context-aware local expert system calculating exact reserve durations:
    $$\text{Reserve Hours Left} = \frac{\text{Current Reservoir (kg)}}{\text{Net Consumption Rate (kg/h)}}$$
  - Full natural language scientific Q&A covering space radiation, MOXIE, water recycling, and EVA spacesuit physics.
  - Built-in robotic speech synthesis via the Web Speech API.

### 4. 🎮 Four Playable Flight Mini-Games
1. **Life Support Diagnostics:** Recalibrate drifting telemetry sensors and potentiometers before countdown expires.
2. **Power Grid Dispatch:** Balance essential breakers against fluctuating solar irradiance to prevent battery blackout.
3. **Water Recovery Filtration:** Regulate centrifuge pump flow and trigger nitrogen backwashes to prevent membrane stress blowout.
4. **Rover Resource Exploration:** Drive a planetary rover across crater terrain, pulse ground-penetrating radar, drill subsurface ice, and return to base.

### 5. 📚 Space Science Lab & Interactive Lessons
- 6 interactive lessons with real-time sliders:
  - Water electrolysis stoichiometry slider
  - Regolith shielding exponential attenuation calculator ($I = I_0 e^{-\mu x}$)
  - Moon vs. Mars gravity jump height simulator
  - Mini-quizzes with instant grading and score unlocks.

### 6. 🛰️ Authentic NASA Open Data Integration
- Live API integration with **NASA DONKI** (Database of Notifications, Knowledge, and Information) for Coronal Mass Ejections and Solar Radiation Storms.
- Planetary telemetry benchmarks verified against NASA Lunar Reconnaissance Orbiter (LRO), Perseverance (MOXIE & MEDA), and InSight instruments.

### 7. 🧪 15 Automated Scientific Tests
- Complete in-browser test runner and Vitest automated test suite:
  1. Oxygen generation consumes water and electricity stoichiometrically.
  2. Crew respiration increases cabin $\text{CO}_2$.
  3. CDRA scrubber decreases cabin $\text{CO}_2$.
  4. Water recovery obeys conservation and configured $90\%$ efficiency.
  5. Power consumption reduces battery storage during night cycles.
  6. Power brownout auto-trips non-essential secondary modules.
  7. Hull breach reduces cabin pressure exponentially.
  8. Martian dust storms attenuate solar generation by atmospheric opacity ($\tau$).
  9. Lunar shadow intervals drop photovoltaic solar generation to zero.
  10. Critical survival failure occurs on prolonged zero oxygen or severe hypobaric pressure.
  11. NOVA reads live simulation differentials for reserve calculations.
  12. Deep JSON serialization preserves game save integrity without loss.
  13. Strict numerical boundary stability (zero negatives, NaNs, or Infinities).
  14. Deterministic seeded PRNG produces reproducible mission event trials.
  15. State mutation dispatches across mobile and desktop controls.

---

## 🛠️ Technology Stack
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8 + `@tailwindcss/vite`
- **3D Graphics:** Three.js (Procedural starfield, procedural Moon & Mars sphere shaders, orbiting spacecraft)
- **Audio:** 100% Procedural Web Audio API synthesizers (deep space drone, alarms, fanfares, UI chimes)
- **Icons:** Lucide React
- **Celebrations:** Canvas Confetti
- **Testing:** Vitest + In-Browser Test Suite Runner

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Run automated scientific test suite
npm test

# 4. Build production bundle
npm run build
```

---

## 📜 Scientific Disclaimer
*ASTROVERSE is an independent educational simulation created for the NASA Space Apps Challenge 2026. Scientific data and educational facts are derived from public NASA scientific archives and established bioastronautics literature. This project is not officially endorsed or certified by NASA.*
