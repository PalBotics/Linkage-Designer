import create from 'zustand';
import {
  Mechanism,
  createMechanism,
  solve,
  toJSON,
  exportCSV,
  exportSVG,
  exportPNG
} from '@linkage-designer/kinematics';
import defaultSpec from './examples/viseGripPipeWrench.json';

type Spec = typeof defaultSpec;

const build = (spec: Spec): Mechanism => solve(createMechanism(spec));

interface PointTrace { theta: number; x: number; }

interface State {
  spec: Spec;
  mech: Mechanism;
  angle: number;
  history: PointTrace[];
  error?: string;
  load: (spec: Spec) => void;
  setJoint: (index: number, field: 'length' | 'angle', value: number) => void;
  setAngle: (theta: number) => void;
  sweep: () => void;
  setError: (msg: string) => void;
  clearError: () => void;
  saveJSON: () => void;
  exportCSV: () => void;
  exportSVG: () => void;
  exportPNG: () => void;
}

export const useStore = create<State>((set, get) => ({
  spec: defaultSpec,
  mech: build(defaultSpec),
  angle: defaultSpec.joints?.[1]?.angle || 0,
  history: [],
  load: (spec) => {
    try {
      set({ spec, mech: build(spec), angle: spec.joints?.[1]?.angle || 0, history: [] });
    } catch (e: any) {
      set({ error: String(e) });
    }
  },
  setJoint: (index, field, value) => {
    const spec = { ...get().spec, joints: [...get().spec.joints] };
    spec.joints[index] = { ...spec.joints[index], [field]: value };
    try {
      set({ spec, mech: build(spec) });
    } catch (e: any) {
      set({ error: String(e) });
    }
  },
  setAngle: (theta) => {
    const spec = { ...get().spec, joints: [...get().spec.joints] };
    if (spec.joints[1]) spec.joints[1] = { ...spec.joints[1], angle: theta };
    try {
      const mech = build(spec);
      set({ spec, mech, angle: theta });
    } catch (e: any) {
      set({ error: String(e) });
    }
  },
  sweep: () => {
    const results: PointTrace[] = [];
    for (let t = -Math.PI / 2; t <= Math.PI / 2; t += Math.PI / 18) {
      const spec = { ...get().spec, joints: [...get().spec.joints] };
      if (spec.joints[1]) spec.joints[1] = { ...spec.joints[1], angle: t };
      try {
        const mech = build(spec);
        const p = mech.points['C'];
        results.push({ theta: t, x: p.x });
      } catch (e: any) {
        set({ error: String(e) });
        break;
      }
    }
    set({ history: results });
  },
  setError: (msg) => set({ error: msg }),
  clearError: () => set({ error: undefined }),
  saveJSON: () => {
    const blob = new Blob([JSON.stringify(toJSON(get().mech), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mechanism.json';
    a.click();
  },
  exportCSV: () => {
    const blob = new Blob([exportCSV(get().mech)], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mechanism.csv';
    a.click();
  },
  exportSVG: () => {
    const blob = new Blob([exportSVG(get().mech)], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mechanism.svg';
    a.click();
  },
  exportPNG: () => {
    const png = exportPNG(get().mech);
    const blob = new Blob([png], { type: 'image/png' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mechanism.png';
    a.click();
  }
}));
