import type { ReactNode } from 'react'
import type { SymbolId } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// Minimal stroke-based line icons (20 × 20 viewBox). No emoji, no images.
// ─────────────────────────────────────────────────────────────────────────────

const S = {
  morphism: (
    <>
      <text x="1.2" y="14.6" className="sym-text">A</text>
      <path d="M6.5 10h6" />
      <path d="M10.8 7.6l2.4 2.4-2.4 2.4" />
      <text x="14.6" y="14.6" className="sym-text">B</text>
    </>
  ),
  grid: (
    <>
      {[4, 10, 16].map((x) => [4, 10, 16].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" />))}
    </>
  ),
  loops: (
    <>
      <circle cx="7" cy="10" r="4.4" />
      <circle cx="13" cy="10" r="4.4" />
    </>
  ),
  hub: (
    <>
      <circle cx="10" cy="10" r="2.1" />
      {[[3, 3.6], [17, 3.6], [3, 16.4], [17, 16.4], [10, 1.8]].map(([x, y], i) => (
        <g key={i}><line x1="10" y1="10" x2={x} y2={y} /><circle cx={x} cy={y} r="1.3" /></g>
      ))}
    </>
  ),
  tree: (
    <path d="M10 17.5V11M10 11L4.5 5.8M10 11l5.5-5.2M4.5 5.8L2.2 2.8M4.5 5.8l2.4-3M15.5 5.8L17.8 2.8M15.5 5.8l-2.4-3" />
  ),
  nested: (
    <>
      <circle cx="10" cy="10" r="8.4" />
      <circle cx="10" cy="10" r="5.2" />
      <circle cx="10" cy="10" r="2.1" />
    </>
  ),
  flow: (
    <>
      <path d="M2 6.6h15.4M2 10h11.4M2 13.4h15.4" />
      <path d="M11.2 7.7l2.3-1.1-2.3-1.1" fill="currentColor" stroke="none" />
    </>
  ),
  dag: (
    <>
      <circle cx="4.4" cy="14" r="2.1" />
      <circle cx="10" cy="4.6" r="2.1" />
      <circle cx="15.6" cy="14" r="2.1" />
      <path d="M6.1 12.5l2.5-6M13.9 12.5l-2.5-6" />
      <path d="M7.4 8.6l1.5-2.7M11.1 5.9l1.5 2.7" fill="currentColor" stroke="none" />
    </>
  ),
  target: (
    <>
      <circle cx="10" cy="10" r="8" />
      <line x1="10" y1="1.4" x2="10" y2="4.6" />
      <line x1="10" y1="15.4" x2="10" y2="18.6" />
      <line x1="1.4" y1="10" x2="4.6" y2="10" />
      <line x1="15.4" y1="10" x2="18.6" y2="10" />
      <circle cx="10" cy="10" r="1.5" />
    </>
  ),
  curve: (
    <>
      <path d="M2 14.5C5.6 14.5 7 4 10 4s4.4 10.5 8 10.5" />
      <path d="M2 17.4h16" />
    </>
  ),
  stair: (
    <path d="M2.5 17.2h4.2v-4.4h4.2V8.4h4.2V3h2.4" />
  ),
  layers: (
    <>
      <path d="M2 5.8c2.6-1.7 5.4-1.7 8 0s5.4 1.7 8 0" />
      <path d="M2 10c2.6-1.7 5.4-1.7 8 0s5.4 1.7 8 0" />
      <path d="M2 14.2c2.6-1.7 5.4-1.7 8 0s5.4 1.7 8 0" />
    </>
  ),
  waves: (
    <path d="M2 10C4.7 3.6 7.3 3.6 10 10s5.3 6.4 8 0" />
  ),
  compass: (
    <>
      <circle cx="10" cy="10" r="8" />
      <path d="M10 3.2l3.9 6.8-3.9 6.8-3.9-6.8z" />
    </>
  ),
  hockey: (
    <>
      <path d="M2 16.6C8 15.8 11.8 13.6 13.8 9.6S17 3.8 18 2.4" />
      <path d="M2 17.6h16" />
    </>
  ),
  adapt: (
    <>
      <path d="M7.2 3.2A6.8 6.8 0 1 1 4.6 13" />
      <path d="M3.2 14.4l1.4-1.4 1.4 1.4" />
    </>
  ),
  infinity: (
    <path d="M5 10c0-3.6 2.4-5.6 5-5.6s4.4 2 4.4 5.6-2 5.6-4.4 5.6S5 13.6 5 10z" />
  ),
  field: (
    <>
      <circle cx="10" cy="10" r="2" />
      <circle cx="10" cy="10" r="5.2" />
      <path d="M10 1.4a8.6 8.6 0 0 1 8.6 8.6M10 18.6A8.6 8.6 0 0 1 1.4 10" />
    </>
  ),
  pulse: (
    <>
      <circle cx="10" cy="10" r="1.9" />
      <line x1="10" y1="1.8" x2="10" y2="4.4" />
      <line x1="10" y1="15.6" x2="10" y2="18.2" />
      <line x1="1.8" y1="10" x2="4.4" y2="10" />
      <line x1="15.6" y1="10" x2="18.2" y2="10" />
      <path d="M5.2 3.2l1.6 1.6M13.2 15.2l1.6 1.6M14.8 3.2l-1.6 1.6M6.8 15.2l-1.6 1.6" />
    </>
  ),
  cup: (
    <>
      <path d="M2.5 13.5c0-7.4 3.4-10 7.5-10s7.5 2.6 7.5 8c0 3.6-2 5.6-4.6 5.6s-4.6-2-4.6-5.6" />
      <path d="M17.5 6.4c1.2 1.6 1.8 3.2 1.8 4.8" />
    </>
  ),
  vcp: (
    <>
      <path d="M3.4 4.6l6.6 8.4 6.6-8.4" />
      <path d="M6.9 4.6l3.1 4 3.1-4" opacity="0.55" />
      <path d="M3.4 17h13.2" />
    </>
  ),
  shield: (
    <>
      <path d="M10 1.8l7.2 3v6.2c0 4.6-3.2 7.7-7.2 9.2-4-1.5-7.2-4.6-7.2-9.2V4.8z" />
      <path d="M6.8 10.2l2.1 2.1 4.3-4.6" />
    </>
  ),
  ring: (
    <>
      <path d="M3.9 10a6.1 6.1 0 0 1 12.2 0" />
      <circle cx="10" cy="13.6" r="1.4" />
    </>
  ),
  branch: (
    <>
      <path d="M2.2 16.8c2.6-3.4 3.9-6.4 7.6-8.4" />
      <path d="M9.8 8.4c2-2.1 4.8-3.2 7.6-4.2" />
      <path d="M9.8 8.4c-.9 2.1-1.2 4.3-.6 6.6" />
      <path d="M8.2 15.6c-1.2.8-2.3 1.3-3.6 1.6" />
    </>
  ),
} as Record<SymbolId, ReactNode>

export function Symbol({ id, size = 16 }: { id: SymbolId; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="node-symbol-svg"
    >
      {S[id]}
    </svg>
  )
}
