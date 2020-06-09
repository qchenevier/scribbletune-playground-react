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
      notes: scribble.getChordsByProgression("C3 major", "V I V V I I"),
      pattern: "[x---][-[x-][x-][x-]][--x-]x",
    },
    {
      notes: scribble.getChordsByProgression("C4 major", "I II V I I"),
      pattern: "[x---]".repeat(4) + "x__-",
    },
  ],
});

session.startRow(0);

const BPM = 120;

Tone.Transport.bpm.value = BPM;
// Tone.Transport.start();

// Tone.Transport.schedule((time) => session.startRow(1), "3:3:3");
// Tone.Transport.stop("8:0:0");
// Tone.Transport.stop("4:0:0");

import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Form from "@rjsf/core";

const schema = {
  title: "Todo",
  type: "object",
  required: ["title"],
  properties: {
    title: { type: "string", title: "Title", default: "A new task" },
    done: { type: "boolean", title: "Done?", default: false },
  },
};

const log = (type) => console.log.bind(console, type);

const App = () => {
  return (
    <div>
      <div>Voici du react</div>
      <Form
        schema={schema}
        onChange={log("changed")}
        onSubmit={log("submitted")}
        onError={log("errors")}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
