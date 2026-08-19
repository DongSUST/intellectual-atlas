// ── Interactive Intellectual Atlas · data schema ─────────────────────────────
export type Zone = 'reality' | 'cognition' | 'action' | 'meta'
export type FilterTag = 'system' | 'market'
export type FilterKey = 'all' | Zone | FilterTag

export type EdgeType = 'generative' | 'structural' | 'flow' | 'feedback' | 'functional'

export type SymbolId =
  | 'morphism' | 'grid' | 'loops' | 'hub' | 'tree' | 'nested' | 'flow' | 'dag'
  | 'target' | 'curve' | 'stair' | 'layers' | 'waves' | 'compass' | 'hockey'
  | 'adapt' | 'infinity' | 'field' | 'pulse' | 'cup' | 'vcp' | 'shield' | 'ring' | 'branch'

export interface AtlasNode {
  id: string
  name: string
  nameZh?: string
  /** primary zone (spatial column) */
  zone: Zone
  /** all zones the node belongs to (filter membership) */
  zones?: Zone[]
  tags?: FilterTag[]
  /** abstract-depth layer, from the Reality depth ladder */
  layer: string
  operator: string
  operatorZh?: string
  /** 功能名称 — the functional name inside its sub-system */
  function?: string
  functionZh?: string
  question: string
  questionZh?: string
  /** bilingual concept chips: "EN 中文" */
  concepts: string[]
  description: string
  descriptionZh: string
  symbol: SymbolId
  /** extra search keywords */
  keywords?: string[]
  /** hand-placed world coordinates (no force layout) */
  x: number
  y: number
  /** 'standard' | 'meta' | 'crossing' */
  style?: 'standard' | 'meta' | 'crossing'
}

export interface AtlasEdge {
  source: string
  target: string
  type: EdgeType
  label?: string
  labelZh?: string
  description?: string
  direction: 'forward' | 'mutual'
  curve?: { kind: 'quadratic'; cx: number; cy: number } | { kind: 'cubic'; c1: [number, number]; c2: [number, number] }
  alwaysShowLabel?: boolean
}

export interface AtlasPath {
  id: string
  title: string
  titleZh: string
  nodes: string[]
  description: string
  descriptionZh: string
}

export const EDGE_TYPE_INFO: Record<EdgeType, { en: string; zh: string; color: string }> = {
  generative: { en: 'Generative Influence', zh: '生成关系', color: '#1C2B45' },
  structural: { en: 'Structural Resonance', zh: '结构同构', color: '#7A8699' },
  flow:        { en: 'Information Flow',   zh: '信息流',   color: '#5C86AD' },
  feedback:    { en: 'Feedback Loop',      zh: '反馈',     color: '#6B8F7E' },
  functional:  { en: 'Functional Chain',   zh: '功能链',   color: '#B98A3E' },
}
