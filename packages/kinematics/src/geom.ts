export interface Vec { x: number; y: number; }

export const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
export const length = (v: Vec): number => Math.hypot(v.x, v.y);
export const rotate = (p: Vec, angle: number): Vec => ({
  x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
  y: p.x * Math.sin(angle) + p.y * Math.cos(angle)
});
