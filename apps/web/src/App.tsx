import React from 'react';
import { useStore } from './store';

export default function App() {
  const {
    mech,
    angle,
    history,
    setAngle,
    sweep,
    setJoint,
    load,
    saveJSON,
    exportCSV,
    exportSVG,
    exportPNG,
    error,
    setError,
    clearError
  } = useStore();

  const lines = mech.joints.map((j, i) => {
    const a = mech.points[j.a];
    const b = mech.points[j.b];
    return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="black" />;
  });
  const pts = Object.entries(mech.points).map(([id, p]) => (
    <circle key={id} cx={p.x} cy={p.y} r={3} fill="red" />
  ));

  const jointInputs = mech.joints.map((j, i) => (
    <div key={i} style={{ marginBottom: 4 }}>
      <div>Joint {i}</div>
      <label>
        length
        <input
          type="number"
          value={j.length}
          onChange={e => setJoint(i, 'length', parseFloat(e.target.value))}
        />
      </label>
      <label>
        angle
        <input
          type="number"
          value={j.angle}
          onChange={e => setJoint(i, 'angle', parseFloat(e.target.value))}
        />
      </label>
    </div>
  ));

  const plotPoints = history
    .map(p => `${((p.theta + Math.PI / 2) / Math.PI) * 200},${100 - p.x}`)
    .join(' ');

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: 8 }}>
        <input
          type="file"
          accept="application/json"
          onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            file
              .text()
              .then(txt => load(JSON.parse(txt)))
              .catch(err => setError(String(err)));
          }}
        />
        <button onClick={saveJSON}>Save JSON</button>
        <button onClick={exportCSV}>Export CSV</button>
        <button onClick={exportSVG}>Export SVG</button>
        <button onClick={exportPNG}>Export PNG</button>
      </div>
      <div style={{ display: 'flex' }}>
        <svg width={300} height={300} style={{ border: '1px solid #ccc' }}>
          {lines}
          {pts}
        </svg>
        <div style={{ marginLeft: 16 }}>
          <h3>Inspector</h3>
          {jointInputs}
          <h3>Simulation</h3>
          <input
            type="range"
            min={-Math.PI / 2}
            max={Math.PI / 2}
            step={0.01}
            value={angle}
            onChange={e => setAngle(parseFloat(e.target.value))}
          />
          <button onClick={sweep}>Sweep</button>
          <svg
            width={200}
            height={100}
            style={{ border: '1px solid #ccc', marginTop: 8 }}
          >
            <polyline points={plotPoints} fill="none" stroke="blue" />
          </svg>
        </div>
      </div>
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 10,
            left: 10,
            background: '#fdd',
            padding: 10,
            cursor: 'pointer'
          }}
          onClick={clearError}
        >
          {error}
        </div>
      )}
    </div>
  );
}
