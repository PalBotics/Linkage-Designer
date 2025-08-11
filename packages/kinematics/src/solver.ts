import { Mechanism } from './types';
import { applyJoint } from './joints';

export function solve(mech: Mechanism): Mechanism {
  for (let i = 0; i < mech.joints.length; i++) {
    applyJoint(mech, i);
  }
  return mech;
}
