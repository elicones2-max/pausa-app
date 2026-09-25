/**
 * Subtle sound generator using Web Audio API for PAUSA.
 * Zero external audio files required, runs 100% reliably in browser.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private oscillators: OscillatorNode[] = [];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
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

  // Optional subtle warm ambient sound
  public startAmbient() {
    if (this.isAmbientPlaying) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.04, now + 2); // very soft
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      // Warm frequencies: 108Hz, 216Hz, 324Hz
      const freqs = [108, 216, 324];
      this.oscillators = freqs.map((f) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        oscGain.gain.setValueAtTime(0.3, now);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        return osc;
      });

      this.isAmbientPlaying = true;
    } catch {
      // ignore
    }
  }

  public stopAmbient() {
    if (!this.isAmbientPlaying) return;
    try {
      if (this.ambientGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0.001, now + 1);
        setTimeout(() => {
          this.oscillators.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {
              // ignore
            }
          });
          this.oscillators = [];
          this.isAmbientPlaying = false;
        }, 1100);
      }
    } catch {
      this.isAmbientPlaying = false;
    }
  }
}

export const soundService = new SoundController();
