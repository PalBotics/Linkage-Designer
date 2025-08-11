import create from 'zustand';
import { Mechanism, createMechanism, solve } from '@linkage-designer/kinematics';
import data from './examples/viseGripPipeWrench.json';

const initial: Mechanism = solve(createMechanism(data));

interface State {
  mechanism: Mechanism;
}

export const useMechanism = create<State>((set) => ({
  mechanism: initial,
  setMechanism: (mech: Mechanism) => set({ mechanism: mech })
}));
