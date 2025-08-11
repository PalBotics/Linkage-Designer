import create from 'zustand';
import { Mechanism, createMechanism, solve } from '@linkage-designer/kinematics';
import data from '../../examples/viseGripPipeWrench.json';

const initial: Mechanism = solve(createMechanism(data));

interface State {
  mechanism: Mechanism;
}

export const useMechanism = create<State>(() => ({
  mechanism: initial
}));
