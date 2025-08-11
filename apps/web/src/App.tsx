import React, { useState } from 'react';
import { useMechanism } from './store';
import { solve, exportCSV, exportSVG, exportPNG, Mechanism, Joint } from '@linkage-designer/kinematics';

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <div style={{position:'fixed',top:10,right:10,background:'#333',color:'#fff',padding:'8px 16px',borderRadius:4,zIndex:1000}}>{message}</div>;
}

function CanvasPanel({ mech }: { mech: Mechanism }) {
  const lines = mech.joints.map((j, i) => {
    const a = mech.points[j.a];
    const b = mech.points[j.b];
    return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="black" />;
  });
  return <svg width={400} height={400} style={{background:'#fafafa',border:'1px solid #ccc'}}>{lines}</svg>;
}

function InspectorPanel({ mech, onChange }: { mech: Mechanism, onChange: (mech: Mechanism) => void }) {
  return (
    <div style={{padding:16}}>
      <h3>Inspector</h3>
      <table>
        <thead><tr><th>Joint</th><th>Length</th><th>Angle (rad)</th></tr></thead>
        <tbody>
          {mech.joints.map((j, i) => (
            <tr key={i}>
              <td>{j.a}-{j.b}</td>
              <td><input type="number" value={j.length} min={0} step={1} style={{width:60}}
                onChange={e => {
                  const joints = [...mech.joints];
                  joints[i] = { ...j, length: Number(e.target.value) };
                  onChange({ ...mech, joints });
                }} /></td>
              <td><input type="number" value={j.angle} step={0.01} style={{width:60}}
                onChange={e => {
                  const joints = [...mech.joints];
                  joints[i] = { ...j, angle: Number(e.target.value) };
                  onChange({ ...mech, joints });
                }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimulationPanel({ angle, setAngle, sweep, plot }: { angle: number, setAngle: (a: number) => void, sweep: () => void, plot: Array<{x:number,y:number}> }) {
  return (
    <div style={{padding:16}}>
      <h3>Simulation</h3>
      <label>Handle Angle: <input type="range" min={-3.14} max={3.14} step={0.01} value={angle} onChange={e => setAngle(Number(e.target.value))} /></label>
      <span style={{marginLeft:8}}>{angle.toFixed(2)} rad</span>
      <button style={{marginLeft:16}} onClick={sweep}>Sweep</button>
      <div style={{marginTop:16}}>
        <svg width={200} height={100} style={{background:'#fff',border:'1px solid #ccc'}}>
          <polyline fill="none" stroke="blue" strokeWidth={2} points={plot.map(p=>`${p.x},${100-p.y}`).join(' ')} />
        </svg>
        <div style={{fontSize:12}}>x(θ) plot</div>
      </div>
    </div>
  );
}

function FileMenu({ onOpen, onSave, onExport }: { onOpen: (data: any) => void, onSave: () => void, onExport: (type: string) => void }) {
  return (
    <div style={{padding:16}}>
      <h3>File</h3>
      <input type="file" accept="application/json" onChange={e => {
        const file = e.target.files?.[0];
        if (file) file.text().then(txt => onOpen(JSON.parse(txt)));
      }} />
      <button style={{marginLeft:8}} onClick={onSave}>Save JSON</button>
      <button style={{marginLeft:8}} onClick={() => onExport('csv')}>Export CSV</button>
      <button style={{marginLeft:8}} onClick={() => onExport('svg')}>Export SVG</button>
      <button style={{marginLeft:8}} onClick={() => onExport('png')}>Export PNG</button>
    </div>
  );
}

export default function App() {
  const [mech, setMech] = useMechanism(state => [state.mechanism, (m: Mechanism) => state.mechanism = m]);
  const [angle, setAngle] = useState(mech.joints[0]?.angle ?? 0);
  const [toast, setToast] = useState('');
  const [plot, setPlot] = useState<Array<{x:number,y:number}>>([]);

  // Animate mechanism when angle changes
  function updateAngle(a: number) {
    try {
      const joints = [...mech.joints];
      joints[0] = { ...joints[0], angle: a };
      const newMech = solve({ ...mech, joints });
      setMech(newMech);
      setAngle(a);
    } catch (e) {
      setToast('Simulation error');
    }
  }

  function sweep() {
    try {
      const points: Array<{x:number,y:number}> = [];
      for (let t = -3.14; t <= 3.14; t += 0.1) {
        const joints = [...mech.joints];
        joints[0] = { ...joints[0], angle: t };
        const newMech = solve({ ...mech, joints });
        points.push({ x: t * 30 + 100, y: newMech.points.C.x });
      }
      setPlot(points);
    } catch (e) {
      setToast('Sweep error');
    }
  }

  function handleOpen(data: any) {
    try {
      setMech(solve(data));
      setAngle(data.joints[0]?.angle ?? 0);
      setToast('Loaded JSON');
    } catch (e) {
      setToast('Load error');
    }
  }

  function handleSave() {
    try {
      const blob = new Blob([JSON.stringify(mech)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mechanism.json';
      a.click();
      setToast('Saved JSON');
    } catch (e) {
      setToast('Save error');
    }
  }

  function handleExport(type: string) {
    try {
      let data = '';
      if (type === 'csv') data = exportCSV(mech);
      else if (type === 'svg') data = exportSVG(mech);
      else if (type === 'png') data = exportPNG(mech);
      const blob = new Blob([data], { type: type === 'png' ? 'image/png' : 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `mechanism.${type}`;
      a.click();
      setToast(`Exported ${type.toUpperCase()}`);
    } catch (e) {
      setToast('Export error');
    }
  }

  return (
    <div style={{display:'flex',flexDirection:'row',height:'100vh',fontFamily:'sans-serif'}}>
      <div style={{flex:'0 0 220px',borderRight:'1px solid #eee',background:'#f7f7f7'}}>
        <FileMenu onOpen={handleOpen} onSave={handleSave} onExport={handleExport} />
        <InspectorPanel mech={mech} onChange={m => setMech(solve(m))} />
        <SimulationPanel angle={angle} setAngle={updateAngle} sweep={sweep} plot={plot} />
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <CanvasPanel mech={mech} />
      </div>
      <Toast message={toast} />
    </div>
  );
}
