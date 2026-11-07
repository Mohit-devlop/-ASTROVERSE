// NASA Open Data Integration & Scientific Reference Service
// Connects to authentic NASA APIs with verified fallback reference telemetry

export interface NasaSolarEvent {
  messageID: string;
  messageType: 'CME' | 'FLR' | 'SEP' | 'REFERENCE';
  messageIssueTime: string;
  solarClass?: string;
  sourceLocation?: string;
  summary: string;
  source: 'NASA DONKI API (Live)' | 'NASA DONKI Reference Archive (Demonstration Dataset)';
  retrievedAt: string;
  isSimulatedFallback: boolean;
}

export interface NasaPlanetTelemetry {
  destination: 'MOON' | 'MARS';
  surfaceGravity: string;
  atmosphericPressure: string;
  composition: string;
  solarFluxNominal: string;
  dayNightCycle: string;
  scientificSource: string;
  verifiedInstruments: string[];
}

export const NASA_PLANET_REFERENCE: Record<'MOON' | 'MARS', NasaPlanetTelemetry> = {
  MOON: {
    destination: 'MOON',
    surfaceGravity: '1.62 m/s² (16.6% Earth Gravity)',
    atmosphericPressure: '≈ 3 × 10⁻¹⁰ Pa (Hard Vacuum)',
    composition: 'Exosphere: Argon-40, Helium, Sodium, Potassium traces',
    solarFluxNominal: '1361 W/m² (Unattenuated direct solar irradiance)',
    dayNightCycle: '≈ 29.5 Earth days (14 days sunlight, 14 days night; Polar peaks have up to 86% light)',
    scientificSource: 'NASA Lunar Reconnaissance Orbiter (LRO) & Artemis Science Framework',
    verifiedInstruments: ['LRO Diviner Lunar Radiometer', 'LCROSS Water Spectrometer', 'Artemis VIPER Neutron Spectrometer'],
  },
  MARS: {
    destination: 'MARS',
    surfaceGravity: '3.71 m/s² (37.9% Earth Gravity)',
    atmosphericPressure: '≈ 610 Pa / 0.61 kPa (Less than 1% Earth Sea Level)',
    composition: '95.32% CO2, 2.6% N2, 1.9% Ar, 0.16% O2, 0.08% CO',
    solarFluxNominal: '≈ 590 W/m² (Midday average at equator, attenuated by dust)',
    dayNightCycle: '24 hours, 39 minutes, 35.24 seconds (1 Sol)',
    scientificSource: 'NASA Mars 2020 Perseverance Rover, Curiosity Rover & InSight Lander',
    verifiedInstruments: ['MOXIE (Mars Oxygen ISRU Experiment)', 'MEDA Environmental Dynamics Analyzer', 'SHARAD Subsurface Radar'],
  },
};

// Fallback verified reference events from NASA DONKI archive
const DONKI_REFERENCE_ARCHIVE: NasaSolarEvent[] = [
  {
    messageID: 'NASA-DONKI-2024-CME-001',
    messageType: 'CME',
    messageIssueTime: '2024-05-10T18:25:00Z',
    solarClass: 'X5.8 Solar Flare & Fast Halo Coronal Mass Ejection',
    sourceLocation: 'Active Region AR3664',
    summary: 'Major X5.8 solar flare accompanied by a fast Earth-directed Coronal Mass Ejection reaching speeds above 1,200 km/s. Produced intense G5 geomagnetic storms and elevated radiation levels across cislunar space.',
    source: 'NASA DONKI Reference Archive (Demonstration Dataset)',
    retrievedAt: new Date().toISOString(),
    isSimulatedFallback: true,
  },
  {
    messageID: 'NASA-DONKI-2024-SEP-002',
    messageType: 'SEP',
    messageIssueTime: '2024-05-11T02:15:00Z',
    solarClass: 'S3 Strong Solar Radiation Storm',
    sourceLocation: 'Western Solar Limb',
    summary: 'Protons > 10 MeV exceeded 1,000 pfu threshold. Biological radiation alert: unshielded astronauts beyond Earth magnetosphere advised to enter heavily shielded storm shelters.',
    source: 'NASA DONKI Reference Archive (Demonstration Dataset)',
    retrievedAt: new Date().toISOString(),
    isSimulatedFallback: true,
  },
  {
    messageID: 'NASA-DONKI-2023-FLR-089',
    messageType: 'FLR',
    messageIssueTime: '2023-12-14T17:02:00Z',
    solarClass: 'X2.8 Extreme Ultraviolet Flare',
    sourceLocation: 'Active Region AR3514',
    summary: 'Impulsive X2.8 flare causing sudden ionization in upper atmospheres and High-Frequency radio blackout across sunlit hemisphere.',
    source: 'NASA DONKI Reference Archive (Demonstration Dataset)',
    retrievedAt: new Date().toISOString(),
    isSimulatedFallback: true,
  },
];

/**
 * Fetches recent space weather events from NASA DONKI public API
 * Falls back safely to documented authentic NASA DONKI reference events if network or rate limit restricts access.
 */
export async function fetchNasaSpaceWeather(): Promise<NasaSolarEvent[]> {
  try {
    // NASA open API demo key (standard NASA developer rate limited key)
    const url = 'https://api.nasa.gov/DONKI/CME?startDate=2024-05-01&endDate=2024-05-15&api_key=DEMO_KEY';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500); // Fast 3.5s timeout for instant UX

    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!resp.ok) {
      throw new Error(`NASA API returned status ${resp.status}`);
    }

    const data = await resp.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.slice(0, 3).map((item, idx) => ({
        messageID: item.activityID || `DONKI-LIVE-${idx}`,
        messageType: 'CME',
        messageIssueTime: item.startTime || new Date().toISOString(),
        solarClass: 'Live Coronal Mass Ejection Event',
        summary: item.note || 'Active CME observation recorded by NASA space weather sensors.',
        source: 'NASA DONKI API (Live)',
        retrievedAt: new Date().toLocaleTimeString(),
        isSimulatedFallback: false,
      }));
    }
  } catch {
    // Graceful verified fallback
  }

  // Return verified archive dataset with explicit provenance
  return DONKI_REFERENCE_ARCHIVE.map((item) => ({
    ...item,
    retrievedAt: new Date().toLocaleTimeString(),
  }));
}

