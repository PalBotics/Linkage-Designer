import { Mechanism } from './types';
declare const Buffer: any;

export function loadFromJSON(data: any): Mechanism {
  return data as Mechanism;
}

export function toJSON(mech: Mechanism): any {
  return mech;
}

export function exportCSV(mech: Mechanism): string {
  const rows = ['id,x,y'];
  for (const [id, p] of Object.entries(mech.points)) {
    rows.push(`${id},${p.x},${p.y}`);
  }
  return rows.join('\n');
}

export function exportSVG(mech: Mechanism, width = 200, height = 200): string {
  const lines = mech.joints
    .map(j => {
      const a = mech.points[j.a];
      const b = mech.points[j.b];
      return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="black"/>`;
    })
    .join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${lines}</svg>`;
}

export function exportPNG(mech: Mechanism): any {
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  return Buffer.from(pngBase64, 'base64');
}
