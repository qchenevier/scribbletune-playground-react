import * as scribble from "scribbletune";

const session = new scribble.Session();

const synthParams = Tone.PolySynth.defaults;

const polySynth = new Tone.PolySynth(5, Tone.Synth, synthParams);

const synthChannel = session.createChannel({
  instrument: polySynth,
  clips: [
    {
      notes: scribble.getChordsByProgression("C3 major", "V V V V I I I I"),
      pattern: "[x---][x---][x---][x---]xxxx",
    },
    {
      notes: scribble.getChordsByProgression("C4 major", "I II V I I"),
      pattern: "[x---]".repeat(4) + "x__-",
    },
  ],
});

session.startRow(0);

Tone.Transport.bpm.value = 120;

import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import Form from "@rjsf/core";

import toJsonSchema from "to-json-schema";
import { Container, Col, Button } from "react-bootstrap";

const toJsonOptions = {
  postProcessFnc: function forceIntegersToBeNumbers(
    type,
    schema,
    value,
    defaultFunc
  ) {
    if (type === "integer" || type === "number") {
      schema.type = "number";
      return { ...schema, multipleOf: 0.005 };
    } else {
      return defaultFunc(type, schema, value);
    }
  },
};
const schema = toJsonSchema(synthParams.voice.defaults, toJsonOptions);

const App = () => {
  var [isPlaying, togglePlay] = React.useState(true);
  const playPause = function () {
    togglePlay(!isPlaying);
    if (isPlaying) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
  };

  var [formData, setFormData] = React.useState(synthParams.voice.defaults);
  const setSynth = function (e) {
    setFormData(e.formData);
    polySynth.set(formData);
  };

  var bpmSchema = { type: "number" };
  var [bpm, setBpm] = React.useState(Tone.Transport.bpm.value);
  const setToneBpm = function (e) {
    setBpm(e.formData);
    Tone.Transport.bpm.value = bpm;
  };

  // const uiSchema = {
  //   envelope: { attack: { "ui.widget": "range" } },
  // };

  return (
    <Container fluid="sm">
      <div>Schema</div>
      <Button variant="primary" onClick={playPause}>
        ▶️ Play
      </Button>
      <Form schema={bpmSchema} formData={bpm} onSubmit={setToneBpm} />
      <Form
        schema={schema}
        formData={formData}
        // uiSchema={uiSchema}
        onSubmit={setSynth}
      />
    </Container>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
