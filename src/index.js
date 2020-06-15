import * as scribble from "scribbletune";

import React from "react";
import ReactDOM from "react-dom";
import { Container, Col, Button } from "react-bootstrap";
import Form from "@rjsf/core";
import "bootstrap/dist/css/bootstrap.min.css";
import toJsonSchema from "to-json-schema";

Tone.Master = Tone.Destination; // hack to use tone 14 with scribbletune

const instrumentNames = [
  "AMSynth",
  "DuoSynth",
  "FMSynth",
  "MembraneSynth",
  "MetalSynth",
  "MonoSynth",
  "NoiseSynth",
  "PluckSynth",
  "PolySynth",
  "Sampler",
  "Synth",
];

function processSchema(type, schema, value, defaultFunc) {
  if (type === "integer" || type === "number") {
    schema.type = "number";
    return { ...schema, multipleOf: 0.005 };
  } else if (type === "array") {
    return { ...schema, items: { type: "number" } };
  } else {
    return defaultFunc(type, schema, value);
  }
}

function InstrumentName(props) {
  var [instrumentName, setInstrumentName] = React.useState(
    props.instrumentName
  );
  React.useEffect(() => {
    props.onSubmit(instrumentName);
  }, [instrumentName]);
  var instrumentNameSchema = {
    type: "string",
    enum: instrumentNames,
    title: "Instrument",
  };
  return (
    <Form
      schema={instrumentNameSchema}
      formData={instrumentName}
      onSubmit={(e) => setInstrumentName(e.formData)}
    />
  );
}

function computeSchema(instrumentParams) {
  return toJsonSchema(instrumentParams, {
    postProcessFnc: processSchema,
  });
}

function createSession(instrument) {
  const session = new scribble.Session();
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
  return session;
}

function InstrumentParams(props) {
  var [instrumentParams, setInstrumentParams] = React.useState(
    props.instrumentParams
  );
  var instrumentParamsSchema = computeSchema(instrumentParams);
  React.useEffect(() => {
    instrumentParamsSchema = computeSchema(instrumentParams);
    props.onSubmit(instrumentParams);
  }, [instrumentParams]);

  React.useEffect(() => {
    setInstrumentParams(props.instrumentParams);
  }, [props.instrumentParams]);

  return (
    <Form
      schema={instrumentParamsSchema}
      formData={instrumentParams}
      onSubmit={(e) => setInstrumentParams(e.formData)}
    />
  );
}

function Instrument() {
  var [instrumentName, setInstrumentName] = React.useState("Synth");
  var instrument = new Tone[instrumentName]();
  var [instrumentParams, setInstrumentParams] = React.useState(
    instrument.get()
  );

  React.useEffect(() => {
    instrument = new Tone[instrumentName]();
    const session = createSession(instrument);
    setInstrumentParams(instrument.get());
  }, [instrumentName]);

  React.useEffect(() => {
    if (instrumentParams) {
      instrument.set(instrumentParams);
    }
  }, [instrumentParams]);

  return (
    <div>
      <InstrumentName
        instrumentName={instrumentName}
        onSubmit={setInstrumentName}
      />
      <InstrumentParams
        instrumentParams={instrumentParams}
        onSubmit={setInstrumentParams}
      />
    </div>
  );
}

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

function BPM() {
  var bpmSchema = { type: "integer", minimum: 0, maximum: 250, title: "BPM" };
  var [bpm, setBpm] = React.useState(Tone.Transport.bpm.value);
  React.useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  });
  return (
    <Form
      schema={bpmSchema}
      formData={bpm}
      onSubmit={(e) => setBpm(e.formData)}
    />
  );
}

function App() {
  return (
    <Container fluid="sm">
      <div>Schema</div>
      <PlayPause />
      <BPM />
      <Instrument />
    </Container>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
