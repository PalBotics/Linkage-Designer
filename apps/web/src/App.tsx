import React from 'react';
import { useMechanism } from './store';

export default function App() {
  const mech = useMechanism(state => state.mechanism);
  const lines = mech.joints.map((j, i) => {
    const a = mech.points[j.a];
    const b = mech.points[j.b];
    return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="black" />;
  });

  return <svg width={300} height={300}>{lines}</svg>;
}
