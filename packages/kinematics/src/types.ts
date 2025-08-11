export interface Point {
  x: number;
  y: number;
  fixed?: boolean;
}

export interface Joint {
  type: 'pin';
  a: string;
  b: string;
  length: number;
  angle: number;
}

export interface Mechanism {
  points: Record<string, Point>;
  joints: Joint[];
}
