/**
 * Sound controller for PAUSA.
 * Provides subtle singing bowl chimes and an organic, seamless Ocean Waves ambient
 * sound engine powered by the Web Audio API with automatic support for real audio files.
 * Zero external dependencies required; 100% reliable, continuous, and soothing.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isOceanPlaying = false;
  private isOceanPaused = false;
  private targetVolume = 0.40; // Calibrated between 35% and 45% (0.40) for clear ambient presence

  // Web Audio Procedural Ocean Waves Nodes
  private oceanMasterGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private swellFilter: BiquadFilterNode | null = null;
  private lfoOscillator: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private lfoFilterGain: GainNode | null = null;
  private subLfoOscillator: OscillatorNode | null = null;
  private subLfoGain: GainNode | null = null;

  // Real Audio File Support
  private audioElement: HTMLAudioElement | null = null;
  private usingAudioElement = false;
  private audioFileChecked = false;
  private audioFileAvailable = false;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private readonly AUDIO_FILE_PATH = '/audio/ocean-waves.mp3';

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play a soft singing bowl / warm chime
  public playBowlChime(freq = 432, duration = 3.5) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Warm harmonic overtone
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.76, now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Audio permission or unsupported, silent fallback
    }
  }

  // Subtle breath cue tone
  public playBreathCue(isInhale: boolean) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      if (isInhale) {
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(340, now + 1.2);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.4);
        gain.gain.linearRampToValueAtTime(0.001, now + 1.2);
      } else {
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 1.2);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.3);
        gain.gain.linearRampToValueAtTime(0.001, now + 1.2);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch {
      // ignore
    }
  }

  /**
   * Check if the real MP3 audio file exists at /audio/ocean-waves.mp3.
   */
  private async checkAudioFileAvailability(): Promise<boolean> {
    if (this.audioFileChecked) return this.audioFileAvailable;
    if (typeof window === 'undefined') return false;

    try {
      const res = await fetch(this.AUDIO_FILE_PATH, { method: 'HEAD' });
      this.audioFileChecked = true;
      this.audioFileAvailable = res.ok;
    } catch {
      this.audioFileChecked = true;
      this.audioFileAvailable = false;
    }
    return this.audioFileAvailable;
  }

  /**
   * Generate a brownian (red/pink) noise buffer for warm, organic, deep ocean surf.
   * Completely seamless wraparound prevents any audible loop point clicks.
   */
  private createOceanNoiseBuffer(ctx: AudioContext, seconds = 8): AudioBuffer {
    const sampleRate = ctx.sampleRate || 44100;
    const bufferSize = Math.floor(sampleRate * seconds);
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.035 * white) / 1.035;
        data[i] = lastOut * 3.2;
      }

      const crossfadeLen = Math.floor(sampleRate * 0.4);
      for (let i = 0; i < crossfadeLen; i++) {
        const factor = i / crossfadeLen;
        data[i] = data[i] * factor + data[bufferSize - crossfadeLen + i] * (1 - factor);
      }
    }
    return buffer;
  }

  /**
   * Start Ambient Ocean Waves.
   * Plays the real MP3 audio file of ocean waves continuously in background loop.
   * Fallback to Web Audio procedural engine if device blocks media element.
   * Volume is set to 40% (0.40) so it is clearly audible without maxing out device volume.
   */
  public async startOceanWaves(volume = 0.40) {
    if (this.isOceanPlaying && !this.isOceanPaused) return;

    this.targetVolume = volume;
    this.isOceanPaused = false;

    // Check if the MP3 file is accessible
    const hasFile = await this.checkAudioFileAvailability();
    if (hasFile) {
      this.startAudioElementWaves(volume);
      return;
    }

    // Fallback to organic procedural engine
    this.startProceduralOceanWaves(volume);
  }

  /**
   * Play real MP3 ocean waves file with smooth fade-in
   */
  private startAudioElementWaves(volume: number) {
    try {
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }

      if (!this.audioElement) {
        this.audioElement = new Audio(this.AUDIO_FILE_PATH);
        this.audioElement.loop = true;
        this.audioElement.preload = 'auto';
      }

      this.audioElement.volume = 0;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.usingAudioElement = true;
            this.isOceanPlaying = true;
            // Smooth fade-in over 1.8 seconds
            let cur = 0;
            const steps = 20;
            const stepVol = volume / steps;
            this.fadeInterval = setInterval(() => {
              cur += stepVol;
              if (this.audioElement) {
                if (cur >= volume) {
                  this.audioElement.volume = volume;
                  if (this.fadeInterval) clearInterval(this.fadeInterval);
                  this.fadeInterval = null;
                } else {
                  this.audioElement.volume = Math.min(volume, cur);
                }
              } else {
                if (this.fadeInterval) clearInterval(this.fadeInterval);
                this.fadeInterval = null;
              }
            }, 90);
          })
          .catch(() => {
            // Autoplay blocked by browser policy without gesture, fallback to Web Audio
            this.startProceduralOceanWaves(volume);
          });
      }
    } catch {
      this.startProceduralOceanWaves(volume);
    }
  }

  /**
   * Procedural Organic Ocean Waves via Web Audio API
   */
  private startProceduralOceanWaves(volume: number) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      this.cleanupProceduralNodes();

      const now = ctx.currentTime;

      // 1. Master Output Gain with smooth fade-in
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(volume, now + 2.0);
      masterGain.connect(ctx.destination);
      this.oceanMasterGain = masterGain;

      // 2. Continuous Brownian Noise Buffer Source
      const noiseBuffer = this.createOceanNoiseBuffer(ctx, 8);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
      this.noiseSource = noiseSource;

      // 3. Main Swell Lowpass Filter
      const swellFilter = ctx.createBiquadFilter();
      swellFilter.type = 'lowpass';
      swellFilter.frequency.setValueAtTime(260, now);
      swellFilter.Q.setValueAtTime(1.1, now);
      this.swellFilter = swellFilter;

      // 4. Secondary Warmth Shelf Filter
      const warmthFilter = ctx.createBiquadFilter();
      warmthFilter.type = 'lowshelf';
      warmthFilter.frequency.setValueAtTime(200, now);
      warmthFilter.gain.setValueAtTime(3.0, now);

      // 5. Wave Swell Gain Node
      const swellGain = ctx.createGain();
      swellGain.gain.setValueAtTime(0.05, now);

      // 6. Slow Primary LFO (~0.095 Hz = ~10.5 seconds per wave cycle)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.095, now);
      this.lfoOscillator = lfo;

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.045, now);
      lfo.connect(lfoGain);
      lfoGain.connect(swellGain.gain);
      this.lfoGain = lfoGain;

      const lfoFilterGain = ctx.createGain();
      lfoFilterGain.gain.setValueAtTime(180, now);
      lfo.connect(lfoFilterGain);
      lfoFilterGain.connect(swellFilter.frequency);
      this.lfoFilterGain = lfoFilterGain;

      // 7. Subtle Secondary LFO
      const subLfo = ctx.createOscillator();
      subLfo.type = 'sine';
      subLfo.frequency.setValueAtTime(0.06, now);
      const subLfoGain = ctx.createGain();
      subLfoGain.gain.setValueAtTime(0.015, now);
      subLfo.connect(subLfoGain);
      subLfoGain.connect(swellGain.gain);
      this.subLfoOscillator = subLfo;
      this.subLfoGain = subLfoGain;

      noiseSource.connect(swellFilter);
      swellFilter.connect(warmthFilter);
      warmthFilter.connect(swellGain);
      swellGain.connect(masterGain);

      lfo.start(now);
      subLfo.start(now);
      noiseSource.start(now);

      this.usingAudioElement = false;
      this.isOceanPlaying = true;
    } catch {
      this.isOceanPlaying = false;
    }
  }

  /**
   * Stop Ambient Ocean Waves smoothly without abrupt cuts.
   * Uses a smooth fade-out to zero over fadeDuration seconds.
   */
  public stopOceanWaves(fadeDuration = 1.8) {
    if (!this.isOceanPlaying && !this.usingAudioElement) return;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    // Fade out HTMLAudioElement smoothly
    if (this.usingAudioElement && this.audioElement) {
      try {
        const startVol = this.audioElement.volume;
        const steps = 18;
        const stepTime = (fadeDuration * 1000) / steps;
        const volStep = startVol / steps;
        let count = 0;
        this.fadeInterval = setInterval(() => {
          count++;
          if (this.audioElement) {
            const nextVol = Math.max(0, startVol - volStep * count);
            this.audioElement.volume = nextVol;
            if (count >= steps || nextVol <= 0) {
              if (this.fadeInterval) clearInterval(this.fadeInterval);
              this.fadeInterval = null;
              this.audioElement.pause();
              this.audioElement.currentTime = 0;
              this.isOceanPlaying = false;
              this.usingAudioElement = false;
            }
          } else {
            if (this.fadeInterval) clearInterval(this.fadeInterval);
            this.fadeInterval = null;
            this.isOceanPlaying = false;
          }
        }, stepTime);
        return;
      } catch {
        this.isOceanPlaying = false;
      }
    }

    // Fade out Procedural Web Audio Nodes
    try {
      if (this.oceanMasterGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.oceanMasterGain.gain.cancelScheduledValues(now);
        this.oceanMasterGain.gain.setValueAtTime(this.oceanMasterGain.gain.value, now);
        this.oceanMasterGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);

        setTimeout(() => {
          this.cleanupProceduralNodes();
          this.isOceanPlaying = false;
        }, (fadeDuration + 0.1) * 1000);
      } else {
        this.cleanupProceduralNodes();
        this.isOceanPlaying = false;
      }
    } catch {
      this.cleanupProceduralNodes();
      this.isOceanPlaying = false;
    }
  }

  /**
   * Pause Ocean Waves gently (e.g. when user pauses timer)
   */
  public pauseOceanWaves() {
    if (!this.isOceanPlaying || this.isOceanPaused) return;
    this.isOceanPaused = true;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (this.usingAudioElement && this.audioElement) {
      this.audioElement.pause();
      return;
    }

    if (this.oceanMasterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.oceanMasterGain.gain.cancelScheduledValues(now);
      this.oceanMasterGain.gain.setValueAtTime(this.oceanMasterGain.gain.value, now);
      this.oceanMasterGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
    }
  }

  /**
   * Resume Ocean Waves smoothly (e.g. when user resumes timer)
   */
  public resumeOceanWaves() {
    if (!this.isOceanPlaying || !this.isOceanPaused) return;
    this.isOceanPaused = false;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (this.usingAudioElement && this.audioElement) {
      this.audioElement.volume = this.targetVolume;
      this.audioElement.play().catch(() => {});
      return;
    }

    if (this.oceanMasterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.oceanMasterGain.gain.cancelScheduledValues(now);
      this.oceanMasterGain.gain.setValueAtTime(this.oceanMasterGain.gain.value, now);
      this.oceanMasterGain.gain.linearRampToValueAtTime(this.targetVolume, now + 1.2);
    }
  }

  /**
   * Clean up Web Audio node connections and memory
   */
  private cleanupProceduralNodes() {
    try {
      if (this.noiseSource) {
        this.noiseSource.stop();
        this.noiseSource.disconnect();
        this.noiseSource = null;
      }
      if (this.lfoOscillator) {
        this.lfoOscillator.stop();
        this.lfoOscillator.disconnect();
        this.lfoOscillator = null;
      }
      if (this.subLfoOscillator) {
        this.subLfoOscillator.stop();
        this.subLfoOscillator.disconnect();
        this.subLfoOscillator = null;
      }
      if (this.lfoGain) {
        this.lfoGain.disconnect();
        this.lfoGain = null;
      }
      if (this.lfoFilterGain) {
        this.lfoFilterGain.disconnect();
        this.lfoFilterGain = null;
      }
      if (this.subLfoGain) {
        this.subLfoGain.disconnect();
        this.subLfoGain = null;
      }
      if (this.swellFilter) {
        this.swellFilter.disconnect();
        this.swellFilter = null;
      }
      if (this.oceanMasterGain) {
        this.oceanMasterGain.disconnect();
        this.oceanMasterGain = null;
      }
    } catch {
      // ignore cleanup errors
    }
  }
}

export const soundService = new SoundController();

