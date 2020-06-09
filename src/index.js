import * as scribble from "scribbletune";

const session = new scribble.Session();

const polySynth = new Tone.PolySynth(5, Tone.Synth, {
  oscillator: {
    type: "fatsawtooth",
    count: 5,
    spread: 20,
  },
  envelope: {
    attack: 0.02,
    decay: 0.1,
    sustain: 0.5,
    release: 0.1,
  },
});

const synthChannel = session.createChannel({
  instrument: polySynth,
  clips: [
    {
      notes: scribble.getChordsByProgression("C3 major", "I II V I I"),
      pattern: "[x---]".repeat(4) + "x__-",
    },
    {
      notes: scribble.getChordsByProgression("C4 major", "I II V I I"),
      pattern: "[x---]".repeat(4) + "x__-",
    },
  ],
});

session.startRow(0);

const BPM = 140;

Tone.Transport.bpm.value = BPM;
Tone.Transport.start();

Tone.Transport.schedule((time) => session.startRow(1), "3:3:3");
Tone.Transport.stop("8:0:0");
