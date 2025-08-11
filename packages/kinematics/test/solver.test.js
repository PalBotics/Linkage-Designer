const test = require('node:test');
const assert = require('node:assert');
const { solve, exportCSV, exportSVG, exportPNG } = require('../dist');

const mech = {
  points: {
    A: { x: 0, y: 0, fixed: true },
    B: { x: 0, y: 0 },
    C: { x: 0, y: 0 }
  },
  joints: [
    { type: 'pin', a: 'A', b: 'B', length: 10, angle: 0 },
    { type: 'pin', a: 'B', b: 'C', length: 10, angle: Math.PI / 2 }
  ]
};

test('solver computes positions', () => {
  const solved = solve(mech);
  assert.ok(Math.abs(solved.points.B.x - 10) < 1e-6);
  assert.ok(Math.abs(solved.points.B.y - 0) < 1e-6);
  assert.ok(Math.abs(solved.points.C.x - 10) < 1e-6);
  assert.ok(Math.abs(solved.points.C.y - 10) < 1e-6);
});

test('exports generate output', () => {
  const csv = exportCSV(mech);
  assert.ok(csv.includes('A,0,0'));
  const svg = exportSVG(mech);
  assert.ok(svg.startsWith('<svg'));
  const png = exportPNG(mech);
  assert.ok(png.length > 0);
});
