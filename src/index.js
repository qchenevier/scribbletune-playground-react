// const scribble = require("scribbletune");
import * as scribble from "scribbletune";

var synth = new Tone.FMSynth({
  harmonicity: 3,
  modulationIndex: 10,
  detune: 0,
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.01,
    decay: 0.01,
    sustain: 1,
    release: 0.5,
  },
  modulation: {
    type: "square",
  },
  modulationEnvelope: {
    attack: 0.5,
    decay: 0,
    sustain: 1,
    release: 0.5,
  },
});

scribble
  .clip({
    instrument: synth,
    pattern: "xxx[xx]",
    notes: "C4 D4 C4 D#4 C4 C4 D4 C4 Bb3 C4",
  })
  .start();

const BPM = 180;
const clipDuration = "2m";

Tone.Transport.bpm.value = BPM;
Tone.Transport.start();

setTimeout(
  () => Tone.Transport.stop(),
  Tone.Transport.nextSubdivision(clipDuration) * 1000
);
