// ASTROVERSE Procedural Sound & Music Engine
// 100% Web Audio API synthesis - No external audio files required!

class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.7;
  private voiceEnabled: boolean = true;

  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private isAmbiencePlaying: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Deep space ambient drone
  public startSpaceAmbience() {
    this.initContext();
    if (!this.ctx || !this.musicGain || this.isAmbiencePlaying) return;

    try {
      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(220, this.ctx.currentTime);

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // 55 Hz deep A1 drone

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(82.4, this.ctx.currentTime); // E2 fifth harmonic

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(droneGain);
      droneGain.connect(this.musicGain);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.isAmbiencePlaying = true;
    } catch (e) {
      console.warn('Ambience start prevented by browser policy:', e);
    }
  }

  public stopSpaceAmbience() {
    try {
      if (this.ambientOsc1) {
        this.ambientOsc1.stop();
        this.ambientOsc1.disconnect();
      }
      if (this.ambientOsc2) {
        this.ambientOsc2.stop();
        this.ambientOsc2.disconnect();
      }
      this.isAmbiencePlaying = false;
    } catch {
      // Ignored
    }
  }

  // Futuristic UI Click
  public playClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Switch Toggle / Equipment Activation
  public playToggle(active: boolean = true) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const startFreq = active ? 300 : 600;
    const endFreq = active ? 600 : 300;

    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Critical Emergency Siren / Alarm
  public playAlarm(type: 'CRITICAL' | 'WARNING' | 'SOLAR_STORM' = 'CRITICAL') {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'SOLAR_STORM') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(680, this.ctx.currentTime + 0.25);
      osc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.7);
    } else {
      // High-pitch dual pulse
      osc.type = 'square';
      osc.frequency.setValueAtTime(type === 'CRITICAL' ? 880 : 540, this.ctx.currentTime);
      osc.frequency.setValueAtTime(type === 'CRITICAL' ? 660 : 440, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    }
  }

  // Mission Success Fanfare
  public playVictory() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Major triad arpeggio: C4, E4, G4, C5
    const notes = [261.63, 329.63, 392.0, 523.25];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.12 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(this.ctx!.currentTime + idx * 0.12);
      osc.stop(this.ctx!.currentTime + idx * 0.12 + 0.45);
    });
  }

  // Mission Failure Chord
  public playFailure() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Diminished descending drone
    const notes = [311.13, 293.66, 220.0];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.2);

      gain.gain.setValueAtTime(0.18, this.ctx!.currentTime + idx * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.2 + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(this.ctx!.currentTime + idx * 0.2);
      osc.stop(this.ctx!.currentTime + idx * 0.2 + 0.75);
    });
  }

  // Achievement unlock chime
  public playAchievement() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.4);
    });
  }

  // Volume & Settings Getters/Setters
  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  public getSettings() {
    return {
      masterVolume: this.masterVolume,
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      isMuted: this.isMuted,
      voiceEnabled: this.voiceEnabled,
    };
  }
}

export const soundEngine = new ProceduralAudioEngine();

