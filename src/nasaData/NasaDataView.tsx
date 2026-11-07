import React, { useState, useEffect } from 'react';
import { Database, Radio, ExternalLink, RefreshCw, AlertTriangle, ShieldCheck, Globe } from 'lucide-react';
import { fetchNasaSpaceWeather, NASA_PLANET_REFERENCE, NasaSolarEvent } from './nasaService';
import { soundEngine } from '../audio/soundEngine';

interface NasaDataViewProps {
  onClose: () => void;
}

export const NasaDataView: React.FC<NasaDataViewProps> = ({ onClose }) => {
  const [events, setEvents] = useState<NasaSolarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'DONKI' | 'TELEMETRY' | 'RESOURCES'>('DONKI');

  const loadData = async () => {
    setLoading(true);
    soundEngine.playClick();
    const data = await fetchNasaSpaceWeather();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-white max-w-4xl mx-auto shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30 text-blue-400">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              NASA OPEN DATA & SPACE SCIENCE INTEGRATION
            </h2>
            <p className="text-xs text-slate-400">
              Real-world telemetry feeds from NASA DONKI, InSight, and Artemis scientific frameworks
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all"
        >
          ✕ Return to Mission
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('DONKI')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'DONKI' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5" /> NASA DONKI Space Weather
        </button>
        <button
          onClick={() => setActiveTab('TELEMETRY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'TELEMETRY' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Planetary Benchmark Telemetry
        </button>
        <button
          onClick={() => setActiveTab('RESOURCES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'RESOURCES' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" /> Verified NASA Portals
        </button>
      </div>

      {/* Tab 1: NASA DONKI */}
      {activeTab === 'DONKI' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Coronal Mass Ejections (CME) & Solar Particle Alerts:
            </span>
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-cyan-400"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
            </button>
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <div
                key={evt.messageID}
                className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-2 hover:border-slate-600 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-[10px] font-bold">
                      {evt.messageType}
                    </span>
                    <span className="font-bold text-sm text-slate-100">{evt.solarClass}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{evt.messageIssueTime}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{evt.summary}</p>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-700/60">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Source: {evt.source}
                  </span>
                  <span>Retrieved: {evt.retrievedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Planetary Telemetry */}
      {activeTab === 'TELEMETRY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['MOON', 'MARS'] as const).map((planet) => {
            const data = NASA_PLANET_REFERENCE[planet];
            return (
              <div key={planet} className="p-5 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <h3 className="font-black text-lg text-slate-100 flex items-center gap-2">
                    {planet === 'MOON' ? '🌑 LUNAR TELEMETRY' : '🪐 MARTIAN TELEMETRY'}
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 font-bold">NASA Standard</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Surface Gravity:</span>
                    <span className="text-cyan-300 font-bold">{data.surfaceGravity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Atmospheric Pressure:</span>
                    <span className="text-white font-bold">{data.atmosphericPressure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Atmosphere Gases:</span>
                    <span className="text-amber-300 font-bold truncate max-w-[200px]" title={data.composition}>
                      {data.composition}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Solar Irradiance:</span>
                    <span className="text-amber-400 font-bold">{data.solarFluxNominal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Diurnal Cycle:</span>
                    <span className="text-purple-300 font-bold truncate max-w-[200px]">{data.dayNightCycle}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700 text-[10px] text-slate-400">
                  <span className="font-bold block mb-1 text-slate-300">Verified NASA Instrument Payloads:</span>
                  <div className="flex flex-wrap gap-1">
                    {data.verifiedInstruments.map((inst, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-900 rounded border border-slate-700 text-cyan-400 font-mono">
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Official NASA Resources */}
      {activeTab === 'RESOURCES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              title: 'NASA ECLSS (Life Support Systems)',
              desc: 'Official overview of environmental control, carbon dioxide scrubbing, and water recovery systems on human spacecraft.',
              url: 'https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/',
            },
            {
              title: 'NASA MOXIE (Mars Oxygen ISRU)',
              desc: 'Detailed findings from the Mars 2020 Perseverance rover solid-oxide electrolysis experiment generating oxygen on Mars.',
              url: 'https://www.nasa.gov/space-technology-mission-directorate/tdm/mars-oxygen-in-situ-resource-utilization-experiment-moxie/',
            },
            {
              title: 'NASA DONKI (Space Weather Alerts)',
              desc: 'Real-time database of Coronal Mass Ejections, solar flares, and geomagnetic storms curated by NASA Goddard Space Flight Center.',
              url: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/',
            },
            {
              title: 'NASA OSDR (Open Science Data Repository)',
              desc: 'Public space biology datasets investigating astronaut microgravity adaptation, radiation biomarkers, and space agriculture.',
              url: 'https://osdr.nasa.gov/',
            },
            {
              title: 'NASA Moon to Mars Artemis Initiative',
              desc: 'Humanity architecture for permanent lunar outposts and long-duration crewed expeditions to Mars.',
              url: 'https://www.nasa.gov/topics/moon-to-mars/',
            },
            {
              title: 'NASA Open APIs Portal',
              desc: 'Direct developer access to astronomy picture of the day, Mars rover photos, and planetary telemetry endpoints.',
              url: 'https://api.nasa.gov/',
            },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 rounded-2xl block space-y-1.5 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-cyan-300 group-hover:underline">{item.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </a>
          ))}
        </div>
      )}

      {/* NASA Space Apps Disclaimer */}
      <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-[10px] text-slate-400 flex items-start gap-2 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <b>DISCLAIMER:</b> ASTROVERSE is an independent educational simulator developed for the NASA Space Apps Challenge 2026. Scientific data and educational facts are derived from public NASA materials and established planetary science. This application is not an official NASA product and does not claim NASA endorsement.
        </div>
      </div>
    </div>
  );
};

