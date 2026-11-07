export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ScienceLesson {
  id: string;
  title: string;
  subtitle: string;
  badgeIcon: string;
  summary: string;
  keyFormula?: string;
  detailedContent: string[];
  interactiveType: 'ELECTROLYSIS_SLIDER' | 'RADIATION_SHIELD' | 'GRAVITY_JUMP' | 'WATER_CYCLE' | 'MARS_ATMOSPHERE';
  quiz: QuizQuestion[];
  nasaSourceUrl: string;
}

export const SCIENCE_LESSONS: ScienceLesson[] = [
  {
    id: 'oxygen-production',
    title: 'Oxygen Production Beyond Earth',
    subtitle: 'Water Electrolysis & MOXIE Solid-Oxide Splitting',
    badgeIcon: 'Wind',
    summary: 'How astronauts breathe without an atmosphere: splitting water into hydrogen and oxygen, or extracting oxygen directly from Martian CO2.',
    keyFormula: '2H2O + Electrical Energy ➔ 2H2 + O2 (Electrolysis)',
    detailedContent: [
      'On Earth, photosynthesis by plants and ocean phytoplankton produces our breathable atmosphere (21% Oxygen, 78% Nitrogen). In deep space or on the Moon, there are zero native oxygen molecules to breathe.',
      'Water Electrolysis is the workhorse of space life support. When direct electrical current passes through water with an electrolyte, water molecules dissociate. 36 grams of water yields 32 grams of oxygen gas (88.8% mass yield) and 4 grams of hydrogen gas.',
      'On Mars, water is locked in polar ice and permafrost. NASA sent the MOXIE experiment (Mars Oxygen In-Situ Resource Utilization Experiment) on the Perseverance rover. MOXIE heats atmospheric carbon dioxide (CO2) to 800°C and splits it into carbon monoxide and oxygen ions using solid oxide electrolysis: 2CO2 ➔ 2CO + O2.',
    ],
    interactiveType: 'ELECTROLYSIS_SLIDER',
    quiz: [
      {
        question: 'What chemical process splits water into oxygen and hydrogen gas using electricity?',
        options: ['Combustion', 'Water Electrolysis', 'Sublimation', 'Nuclear Fission'],
        correctIndex: 1,
        explanation: 'Electrolysis uses electrical current to break the chemical bonds between hydrogen and oxygen in H2O.',
      },
      {
        question: 'What gas did NASA\'s MOXIE instrument extract oxygen from on Mars?',
        options: ['Methane', 'Nitrogen', 'Carbon Dioxide (CO2)', 'Argon'],
        correctIndex: 2,
        explanation: 'Mars atmosphere is 95% CO2. MOXIE extracts O2 directly by splitting CO2 into CO and O.',
      },
    ],
    nasaSourceUrl: 'https://www.nasa.gov/space-technology-mission-directorate/tdm/mars-oxygen-in-situ-resource-utilization-experiment-moxie/',
  },
  {
    id: 'co2-removal',
    title: 'Carbon Dioxide Removal Assembly',
    subtitle: 'Zeolite Scrubbers & The Sabatier Reaction',
    badgeIcon: 'Filter',
    summary: 'Preventing astronaut asphyxiation by removing exhaled carbon dioxide before it reaches toxic concentrations.',
    keyFormula: 'CO2 + 4H2 ➔ CH4 + 2H2O (Sabatier Reaction)',
    detailedContent: [
      'Each astronaut exhales roughly 1.0 kg (2.2 lbs) of carbon dioxide every single day. In a sealed space habitat, CO2 accumulates rapidly. If CO2 exceeds 0.5% (5,000 ppm), humans experience severe headaches, impaired decision-making, and acidosis.',
      'NASA uses the Carbon Dioxide Removal Assembly (CDRA) on the ISS. CDRA uses synthetic zeolite crystalline mineral beds (molecular sieves) that selectively trap polar CO2 molecules without using expendable chemical filters.',
      'Advanced habitats pair CDRA with a Sabatier Reactor: they react the captured CO2 with byproduct hydrogen from electrolysis at 400°C to generate water (H2O) and methane (CH4)! This closes the life-support loop.',
    ],
    interactiveType: 'WATER_CYCLE',
    quiz: [
      {
        question: 'What dangerous symptom occurs if cabin CO2 rises above 2,500 - 5,000 ppm?',
        options: ['Hypothermia', 'Severe headaches and cognitive fatigue', 'Radiation poisoning', 'Ebullism'],
        correctIndex: 1,
        explanation: 'Elevated CO2 impairs cognitive function and triggers hypercapnia, causing throbbing headaches and confusion.',
      },
    ],
    nasaSourceUrl: 'https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/',
  },
  {
    id: 'water-recycling',
    title: 'Closed-Loop Water Recovery',
    subtitle: 'From Urine & Sweat to Pristine Drinking Water',
    badgeIcon: 'Droplets',
    summary: 'Why shipping water to space costs $10,000/liter, and how ISS technology recovers up to 98% of human moisture.',
    keyFormula: 'Recovery Efficiency = (Potable Water Output / Wastewater Input) × 100%',
    detailedContent: [
      'A human astronaut needs about 2.5 to 3.0 liters of water each day for drinking, food rehydration, and basic hygiene. Shipping a year\'s supply of water for 4 astronauts from Earth would weigh over 4,000 kg and cost tens of millions of dollars!',
      'The Environmental Control and Life Support System (ECLSS) captures cabin humidity from astronaut sweat and breath condensation, combined with processed urine.',
      'The Urine Processor Assembly (UPA) uses Vacuum Rotary Distillation to boil urine at low temperatures in microgravity. The distillate is sent to the Water Processor Assembly (WPA), passing through filtration beds, a catalytic oxidizer reactor, and iodine biocides. The resulting water is cleaner than tap water on Earth!',
    ],
    interactiveType: 'WATER_CYCLE',
    quiz: [
      {
        question: 'Approximately what percentage of water can modern ISS ECLSS systems recover?',
        options: ['25%', '50%', '90% - 98%', '100% (perpetual motion)'],
        correctIndex: 2,
        explanation: 'NASA\'s latest ECLSS upgrades achieved a 98% water recovery rate aboard the International Space Station.',
      },
    ],
    nasaSourceUrl: 'https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/',
  },
  {
    id: 'space-radiation',
    title: 'Space Radiation & Shielding',
    subtitle: 'Galactic Cosmic Rays, Solar Particle Events & Regolith Berms',
    badgeIcon: 'ShieldAlert',
    summary: 'The invisible danger of high-energy space protons, and how planetary soil acts as humanity\'s cosmic armor.',
    keyFormula: 'Intensity I = I0 · e^(-μ · x) (Exponential Attenuation)',
    detailedContent: [
      'On Earth, our planet\'s dense atmosphere and strong magnetic field (magnetosphere) shield us from almost all harmful space radiation. In deep space, on the Moon, and on Mars, astronauts face two major radiation sources:',
      '1. Galactic Cosmic Rays (GCR): High-energy protons and heavy ions originating outside our solar system. They produce a steady baseline background dose (~1 mSv/day).',
      '2. Solar Particle Events (SPE): Sudden coronal mass ejections and flares from our Sun that blast intense bursts of energetic protons across space.',
      'To protect astronauts, habitats use hydrogen-rich materials (like polyethylene and water tanks) or bury modules under 1.5 to 2.5 meters of lunar or Martian regolith (soil). The atomic nuclei in the soil absorb and slow down the cosmic rays.',
    ],
    interactiveType: 'RADIATION_SHIELD',
    quiz: [
      {
        question: 'Why is packed lunar or Martian regolith (soil) effective for habitat shielding?',
        options: ['It is magnetized', 'Its mass and atomic nuclei absorb and attenuate high-energy protons', 'It reflects light', 'It provides breathable oxygen directly'],
        correctIndex: 1,
        explanation: 'Dense regolith mass physically blocks and scatters ionizing radiation particles before they hit crew quarters.',
      },
    ],
    nasaSourceUrl: 'https://www.nasa.gov/directorates/esdmd/hhp/radiation/',
  },
  {
    id: 'gravity-physics',
    title: 'Planetary Gravity & Human Physiology',
    subtitle: '1/6th Earth Gravity on the Moon vs 38% Gravity on Mars',
    badgeIcon: 'Compass',
    summary: 'Compare how objects drop, astronauts jump, and human bones adapt to reduced planetary gravity fields.',
    keyFormula: 'Weight W = Mass m × Acceleration g',
    detailedContent: [
      'The Moon has an acceleration due to gravity of approximately 1.62 m/s²—roughly one-sixth (16.6%) of Earth\'s 9.81 m/s². A 90 kg astronaut in a 120 kg spacesuit weighs 210 kg on Earth (~2060 N), but only 340 N on the Moon—feeling as light as 35 kg!',
      'Mars has a surface gravity of approximately 3.71 m/s²—about 38% of Earth. This provides enough downward force for natural walking, but still allows massive leaps and reduced structural loading.',
      'Long-term living in reduced gravity causes bones to lose mineral density (calcium) and hearts to shrink slightly, requiring astronauts to perform 2 hours of daily resistance exercises (like ARED on the ISS).',
    ],
    interactiveType: 'GRAVITY_JUMP',
    quiz: [
      {
        question: 'If you weigh 60 kg on Earth, approximately how much would your downward gravity force feel like on the Moon?',
        options: ['60 kg', '30 kg', '10 kg (1/6th)', '0 kg'],
        correctIndex: 2,
        explanation: 'Lunar gravity is 1/6th of Earth gravity (1.62 m/s² vs 9.81 m/s²), so downward weight is reduced by a factor of 6.',
      },
    ],
    nasaSourceUrl: 'https://science.nasa.gov/moon/facts/',
  },
  {
    id: 'mars-atmosphere',
    title: 'Mars Atmosphere & Pressure Limits',
    subtitle: '0.6 kPa Pressure, CO2 Chemistry & The Armstrong Line',
    badgeIcon: 'Gauge',
    summary: 'Why Mars atmosphere is deadly to inhale, and why spacesuits must maintain pressurized air to prevent blood from boiling.',
    keyFormula: 'P_mars ≈ 0.61 kPa (Less than 1% of Earth\'s 101.3 kPa)',
    detailedContent: [
      'The Martian atmosphere is very thin: surface pressure averages only 610 Pascals (0.61 kPa), compared to 101.3 kPa at sea level on Earth. It is composed of 95.3% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon, and only 0.16% trace Oxygen.',
      'Because pressure is so low, water boils at just 10°C on Mars! The human body boundary is known as the Armstrong Limit (~6.3 kPa). Below this pressure, exposed bodily moisture (saliva, tears, lung moisture) boils at body temperature (37°C).',
      'This is why astronauts on Mars must ALWAYS wear a pressurized suit or stay inside sealed habitat modules. The suit keeps air at ~30 to 50 kPa pure oxygen to maintain respiration and prevent decompression sickness.',
    ],
    interactiveType: 'MARS_ATMOSPHERE',
    quiz: [
      {
        question: 'What is the dominant gas in the Martian atmosphere?',
        options: ['Oxygen (O2)', 'Nitrogen (N2)', 'Carbon Dioxide (CO2)', 'Helium (He)'],
        correctIndex: 2,
        explanation: 'Mars atmosphere is roughly 95.3% Carbon Dioxide, making it completely unbreathable for humans without artificial processing.',
      },
    ],
    nasaSourceUrl: 'https://science.nasa.gov/mars/facts/',
  },
];

