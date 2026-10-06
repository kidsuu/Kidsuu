import { exactObject } from './contentPackage';
export type Point = readonly [number, number];
export type Shape =
  | {
      id: string;
      kind: 'path';
      points: readonly Point[];
      closed: boolean;
      curve: { edge: number; control: Point } | null;
    }
  | { id: string; kind: 'ellipse'; radii: Point };
export type ShapeReason = 'triangle' | 'curved' | 'four' | 'open';
const point = (v: unknown): v is Point =>
  Array.isArray(v) &&
  v.length === 2 &&
  v.every((n) => typeof n === 'number' && Number.isFinite(n) && n >= 5 && n <= 95);
export function parseShapes(value: unknown): readonly Shape[] {
  if (!Array.isArray(value) || value.length !== 9)
    throw new Error('Expected nine reviewed-recipe shape definitions.');
  const ids = new Set<string>();
  for (const s of value) {
    if (!s || typeof s.id !== 'string' || !/^[a-z][a-z-]{2,30}$/.test(s.id) || ids.has(s.id))
      throw new Error('Invalid shape ID.');
    ids.add(s.id);
    if (s.kind === 'ellipse') {
      if (
        !exactObject(s, ['id', 'kind', 'radii']) ||
        !point(s.radii) ||
        s.radii.some((n) => n > 42)
      )
        throw new Error('Invalid ellipse.');
    } else if (s.kind === 'path') {
      if (
        !exactObject(s, ['id', 'kind', 'points', 'closed', 'curve']) ||
        !Array.isArray(s.points) ||
        s.points.length < 3 ||
        s.points.length > 8 ||
        !s.points.every(point) ||
        typeof s.closed !== 'boolean'
      )
        throw new Error('Invalid path.');
      const points = s.points as Point[];
      if (new Set(points.map((p) => p.join(','))).size !== points.length)
        throw new Error('Duplicate vertex.');
      if (
        s.curve !== null &&
        (!exactObject(s.curve, ['edge', 'control']) ||
          !Number.isInteger(s.curve.edge) ||
          (s.curve.edge as number) < 0 ||
          (s.curve.edge as number) >= points.length - (s.closed ? 0 : 1) ||
          !point(s.curve.control))
      )
        throw new Error('Invalid curved boundary.');
      if (s.curve !== null) {
        const c = s.curve as { edge: number; control: Point };
        if (triangleArea([points[c.edge], c.control, points[(c.edge + 1) % points.length]]) < 1)
          throw new Error('A curved foil must genuinely curve.');
      }
    } else throw new Error('Unknown shape kind.');
  }
  return value as Shape[];
}
export function triangleArea(points: readonly Point[]): number {
  if (points.length !== 3) return 0;
  const [a, b, c] = points;
  return Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) / 2;
}
export function isTriangle(shape: Shape): boolean {
  return (
    shape.kind === 'path' &&
    shape.closed &&
    shape.curve === null &&
    shape.points.length === 3 &&
    triangleArea(shape.points) > 1
  );
}
export function shapeReason(shape: Shape): ShapeReason {
  if (isTriangle(shape)) return 'triangle';
  if (shape.kind === 'ellipse' || shape.curve) return 'curved';
  if (!shape.closed) return 'open';
  if (shape.points.length === 4) return 'four';
  throw new Error('Unsupported distractor geometry.');
}
/** Identical geometry drives rendering, keys and descriptive access. Quadratic
 * curves are sampled, never substituted with a misleading straight edge. */
export function pathSegments(shape: Shape): readonly (readonly [Point, Point])[] {
  if (shape.kind === 'ellipse') {
    const pointAt = (index: number): Point => {
      const angle = ((index % 64) * 2 * Math.PI) / 64;
      return [50 + shape.radii[0] * Math.cos(angle), 50 + shape.radii[1] * Math.sin(angle)];
    };
    return Array.from({ length: 64 }, (_, i) => [pointAt(i), pointAt(i + 1)] as const);
  }
  const segments: [Point, Point][] = [];
  const edges = shape.points.length - (shape.closed ? 0 : 1);
  for (let i = 0; i < edges; i++) {
    const a = shape.points[i],
      b = shape.points[(i + 1) % shape.points.length];
    if (shape.curve?.edge === i) {
      const c = shape.curve.control;
      let previous = a;
      for (let step = 1; step <= 24; step++) {
        const t = step / 24,
          u = 1 - t;
        const next: Point = [
          u * u * a[0] + 2 * u * t * c[0] + t * t * b[0],
          u * u * a[1] + 2 * u * t * c[1] + t * t * b[1],
        ];
        segments.push([previous, next]);
        previous = next;
      }
    } else segments.push([a, b]);
  }
  return segments;
}
export function segmentLayout(a: Point, b: Point, size: number) {
  const scale = size / 100,
    dx = (b[0] - a[0]) * scale,
    dy = (b[1] - a[1]) * scale,
    length = Math.hypot(dx, dy);
  return {
    left: ((a[0] + b[0]) * scale) / 2 - length / 2,
    top: ((a[1] + b[1]) * scale) / 2 - 1.5,
    width: length,
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
}
export function correctShapeId(shapes: readonly Shape[]): string {
  const correct = shapes.filter(isTriangle);
  if (correct.length !== 1) throw new Error('A round must contain exactly one valid triangle.');
  return correct[0].id;
}
