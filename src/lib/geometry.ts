import type { AtlasEdge } from '../types'

export interface Pt { x: number; y: number }

function norm(dx: number, dy: number): [number, number] {
  const l = Math.hypot(dx, dy) || 1
  return [dx / l, dy / l]
}

export function quadPoint(a: Pt, c: Pt, b: Pt, t: number): Pt {
  const u = 1 - t
  return { x: u * u * a.x + 2 * t * u * c.x + t * t * b.x, y: u * u * a.y + 2 * t * u * c.y + t * t * b.y }
}

export function cubicPoint(a: Pt, c1: Pt, c2: Pt, b: Pt, t: number): Pt {
  const u = 1 - t
  return {
    x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
    y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
  }
}

export function midPoint(a: Pt, b: Pt, curve?: AtlasEdge['curve']): Pt {
  if (!curve) return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  if (curve.kind === 'quadratic') return quadPoint(a, { x: curve.cx, y: curve.cy }, b, 0.5)
  return cubicPoint(a, { x: curve.c1[0], y: curve.c1[1] }, { x: curve.c2[0], y: curve.c2[1] }, b, 0.5)
}

/** SVG path string for an edge (optionally curved), shortened at both ends
 *  so arrowheads stop exactly at the card boundary along the tangent direction. */
export function edgePath(a: Pt, b: Pt, curve?: AtlasEdge['curve'], insetA = 26, insetB = 26): string {
  if (!curve) {
    const [ux, uy] = norm(b.x - a.x, b.y - a.y)
    const s = { x: a.x + ux * insetA, y: a.y + uy * insetA }
    const e = { x: b.x - ux * insetB, y: b.y - uy * insetB }
    return `M ${s.x} ${s.y} L ${e.x} ${e.y}`
  }
  if (curve.kind === 'quadratic') {
    const c = { x: curve.cx, y: curve.cy }
    const [ux1, uy1] = norm(c.x - a.x, c.y - a.y)
    const [ux2, uy2] = norm(b.x - c.x, b.y - c.y)
    const s = { x: a.x + ux1 * insetA, y: a.y + uy1 * insetA }
    const e = { x: b.x - ux2 * insetB, y: b.y - uy2 * insetB }
    return `M ${s.x} ${s.y} Q ${c.x} ${c.y} ${e.x} ${e.y}`
  }
  const c1 = { x: curve.c1[0], y: curve.c1[1] }
  const c2 = { x: curve.c2[0], y: curve.c2[1] }
  const [ux1, uy1] = norm(c1.x - a.x, c1.y - a.y)
  const [ux2, uy2] = norm(b.x - c2.x, b.y - c2.y)
  const s = { x: a.x + ux1 * insetA, y: a.y + uy1 * insetA }
  const e = { x: b.x - ux2 * insetB, y: b.y - uy2 * insetB }
  return `M ${s.x} ${s.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${e.x} ${e.y}`
}
