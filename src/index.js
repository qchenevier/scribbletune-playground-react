import * as scribble from "scribbletune";

Tone.Master = Tone.Destination;

const session = new scribble.Session();
const instrument = new Tone.Synth();
const instrumentParams = instrument.get();

session.createChannel({
  instrument: instrument,
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

import React from "react";
import ReactDOM from "react-dom";
import { Container, Col, Button } from "react-bootstrap";
import Form from "@rjsf/core";
import "bootstrap/dist/css/bootstrap.min.css";
import toJsonSchema from "to-json-schema";

function forceNumbers(type, schema, value, defaultFunc) {
  if (type === "integer" || type === "number") {
    schema.type = "number";
    return { ...schema, multipleOf: 0.005 };
  } else if (type === "array") {
    return { ...schema, items: { type: "number" } };
  } else {
    return defaultFunc(type, schema, value);
  }
}
const schema = toJsonSchema(instrumentParams, {
  postProcessFnc: forceNumbers,
});

function PlayPause() {
  var [isPlaying, setIsplaying] = React.useState(false);
  React.useEffect(() => {
    isPlaying ? Tone.Transport.start() : Tone.Transport.stop();
  });
  return (
    <Button variant="primary" onClick={() => setIsplaying(!isPlaying)}>
      ▶️ Play
    </Button>
  );
}

function App() {
  var [formData, setFormData] = React.useState(instrumentParams);
  React.useEffect(() => {
    instrument.set(formData);
  });

  var bpmSchema = { type: "integer", minimum: 0, maximum: 250, title: "BPM" };
  var [bpm, setBpm] = React.useState(Tone.Transport.bpm.value);
  React.useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  });

  return (
    <Container fluid="sm">
      <div>Schema</div>
      <PlayPause />
      <Form
        schema={bpmSchema}
        formData={bpm}
        onSubmit={(e) => setBpm(e.formData)}
      />
      <Form
        schema={schema}
        formData={formData}
        onSubmit={(e) => setFormData(e.formData)}
      />
    </Container>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
