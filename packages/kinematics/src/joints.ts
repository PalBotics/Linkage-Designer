import { Mechanism } from './types';
import { rotate } from './geom';

export function applyJoint(mech: Mechanism, index: number): void {
  const joint = mech.joints[index];
  const a = mech.points[joint.a];
  const b = mech.points[joint.b];
  if (!a || !b) return;
  const offset = rotate({ x: joint.length, y: 0 }, joint.angle);
  b.x = a.x + offset.x;
  b.y = a.y + offset.y;
}
