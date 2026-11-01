/**
 * 100% Procedural Web Audio API Sound Synthesizer
 * Zero external mp3/audio files, zero dependencies.
 */

class ProceduralAudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // gentle ambient volume

        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.setValueAtTime(450, this.ctx.currentTime); // Warm, mellow cyber pad

        this.filter.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleAmbientMusic(): boolean {
    this.initContext();
    if (!this.ctx || !this.masterGain || !this.filter) return false;

    if (this.isPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  private startAmbient() {
    if (!this.ctx || !this.filter) return;

    // Atmospheric warm cyber chord frequencies (A2, C#3, E3, B3)
    const freqs = [110.0, 138.59, 164.81, 246.94];
    this.oscillators = [];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      // Subtle LFO modulation for organic breath
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.setValueAtTime(0.15 + idx * 0.05, this.ctx!.currentTime);
      lfoGain.gain.setValueAtTime(1.5, this.ctx!.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.18, this.ctx!.currentTime + 2.5); // Smooth fade in

      osc.connect(oscGain);
      oscGain.connect(this.filter!);
      osc.start();
      this.oscillators.push(osc);
    });

    this.isPlaying = true;
  }

  private stopAmbient() {
    if (!this.ctx || !this.masterGain) return;

    this.oscillators.forEach((osc) => {
      try {
        osc.stop(this.ctx!.currentTime + 0.5);
      } catch {
        // already stopped
      }
    });
    this.oscillators = [];
    this.isPlaying = false;
  }

  public playClickSound() {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioManager = new ProceduralAudioManager();
