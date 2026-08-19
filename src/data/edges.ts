import type { AtlasEdge } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// 29 edges · five relation types:
//   generative (solid navy) · structural (dashed, resonance) · flow (thin blue)
//   feedback (green, both-end arrows) · functional (amber, market chain)
// ─────────────────────────────────────────────────────────────────────────────

export const EDGES: AtlasEdge[] = [
  // ── META-LAYER · Structural Resonance 结构同构 ───────────────────────────
  {
    source: 'grothendieck', target: 'wolfram', type: 'structural', direction: 'mutual',
    label: 'Structural Resonance', labelZh: '结构同构',
    description: 'Changing the space of the problem → rule systems that generate reality.',
  },
  {
    source: 'grothendieck', target: 'wen', type: 'structural', direction: 'mutual',
    label: 'Structural Resonance', labelZh: '结构同构',
    curve: { kind: 'quadratic', cx: 450, cy: 240 },
    description: 'Relative structure → long-range entangled order.',
  },
  {
    source: 'grothendieck', target: 'barabasi', type: 'structural', direction: 'mutual',
    label: 'Structural Resonance', labelZh: '结构同构',
    curve: { kind: 'cubic', c1: [390, 300], c2: [330, 470] },
    description: 'Structure before stuff → network topology.',
  },
  {
    source: 'grothendieck', target: 'pearl', type: 'structural', direction: 'mutual',
    label: 'Structural Resonance', labelZh: '结构同构',
    description: 'Morphism of spaces → causal graphs.',
  },

  // ── REALITY · From Rules to Emergence ────────────────────────────────────
  {
    source: 'wolfram', target: 'wen', type: 'generative', direction: 'forward',
    label: 'Rules → Emergence', labelZh: '规则 → 涌现',
    description: 'Simple rules generate the entangled order of matter.',
  },
  {
    source: 'wen', target: 'barabasi', type: 'generative', direction: 'forward',
    label: 'Emergent structure → Network topology', labelZh: '涌现结构 → 网络拓扑',
    description: 'Long-range structure is the physics of networks.',
  },

  // ── STRUCTURE & FLOW ─────────────────────────────────────────────────────
  {
    source: 'barabasi', target: 'pentland', type: 'flow', direction: 'forward',
    label: 'Topology → Flow', labelZh: '拓扑 → 流动',
    description: 'Network structure decides how ideas travel.',
  },
  {
    source: 'pentland', target: 'soros', type: 'flow', direction: 'forward',
    label: 'Diffusion → Belief', labelZh: '扩散 → 信念',
    description: 'Flowing information congeals into shared beliefs.',
  },
  {
    source: 'pentland', target: 'druckenmiller', type: 'flow', direction: 'forward',
    label: 'Information → Diffusion → Belief → Action → Price',
    labelZh: '信息 → 扩散 → 信念 → 行动 → 价格',
    curve: { kind: 'cubic', c1: [730, 390], c2: [1010, 170] },
    alwaysShowLabel: true,
    description: 'Social flow feeds the macro field where beliefs become prices.',
  },

  // ── Systems resonances ───────────────────────────────────────────────────
  {
    source: 'qian', target: 'pentland', type: 'structural', direction: 'mutual',
    label: 'Open systems ↔ Collective behavior', labelZh: '开放系统 ↔ 集体行为',
    description: 'Metasynthesis of giant systems echoes social physics.',
  },
  {
    source: 'qian', target: 'arthur', type: 'structural', direction: 'mutual',
    label: 'Systems engineering ↔ Complexity economics', labelZh: '系统工程 ↔ 复杂经济',
    curve: { kind: 'quadratic', cx: 740, cy: 430 },
    description: 'Whole-systems thinking meets the economy as a complex system.',
  },

  // ── Evolutionary spine ───────────────────────────────────────────────────
  {
    source: 'darwin', target: 'arthur', type: 'generative', direction: 'forward',
    label: 'Variation & Selection → Economic evolution', labelZh: '变异与选择 → 经济演化',
    description: 'The evolutionary algorithm enters economics.',
  },
  {
    source: 'deutsch', target: 'perez', type: 'generative', direction: 'forward',
    label: 'Explanations → Technological revolutions', labelZh: '解释 → 技术革命',
    description: 'Good explanations power the surges that redefine economies.',
  },
  {
    source: 'morris', target: 'perez', type: 'generative', direction: 'forward',
    label: 'Energy & Development → Paradigm waves', labelZh: '能量与发展 → 范式浪潮',
    description: 'Civilizational energy underpins techno-economic paradigms.',
  },
  {
    source: 'perez', target: 'arthur', type: 'generative', direction: 'forward',
    label: 'Techno-economic paradigm → Increasing returns', labelZh: '技术-经济范式 → 报酬递增',
    description: 'Each paradigm propagates through increasing-returns economics.',
  },
  {
    source: 'perez', target: 'lilu', type: 'generative', direction: 'forward',
    label: 'Paradigm → Long-term value', labelZh: '范式 → 长期价值',
    description: 'Paradigm waves channel progress into durable business value.',
  },
  {
    source: 'arthur', target: 'anderson', type: 'generative', direction: 'forward',
    label: 'Increasing returns → Extreme winners', labelZh: '报酬递增 → 极端赢家',
    description: 'Increasing returns concentrate gains into extreme winners.',
  },
  {
    source: 'lilu', target: 'anderson', type: 'feedback', direction: 'mutual',
    label: 'Civilization ⇄ Extreme companies', labelZh: '文明 ⇄ 极端公司',
    curve: { kind: 'cubic', c1: [520, 560], c2: [1050, 640] },
    description: 'Civilization → Company meets Company → Civilization.',
  },

  // ── EVOLUTIONARY REFLEXIVE SYSTEM ────────────────────────────────────────
  {
    source: 'arthur', target: 'lo', type: 'feedback', direction: 'mutual',
    label: 'History ⇄ Adaptation', labelZh: '历史 ⇄ 适应',
    curve: { kind: 'quadratic', cx: 985, cy: 570 },
    description: 'History enters the present; agents adapt to it.',
  },
  {
    source: 'lo', target: 'soros', type: 'feedback', direction: 'mutual',
    label: 'Adaptation ⇄ Reflexivity', labelZh: '适应 ⇄ 反身性',
    curve: { kind: 'quadratic', cx: 957, cy: 736 },
    description: 'Adapting agents hold beliefs that reshape their environment.',
  },
  {
    source: 'soros', target: 'arthur', type: 'feedback', direction: 'mutual',
    label: 'Reflexivity → New history', labelZh: '反身性 → 新历史',
    curve: { kind: 'quadratic', cx: 803, cy: 604 },
    description: 'Reflexive reshaping is written back into history.',
  },

  // ── CALIBRATION TRIANGLE ─────────────────────────────────────────────────
  {
    source: 'stanovich', target: 'pearl', type: 'generative', direction: 'forward',
    label: 'Rationality → Causality', labelZh: '理性 → 因果',
    description: 'Observer calibration demands causally meaningful models.',
  },
  {
    source: 'pearl', target: 'thorp', type: 'generative', direction: 'forward',
    label: 'Causal → Probabilistic', labelZh: '因果 → 概率',
    curve: { kind: 'cubic', c1: [550, 100], c2: [1180, 740] },
    description: 'Causal meaning is tested probabilistically in real bets.',
  },
  {
    source: 'stanovich', target: 'thorp', type: 'structural', direction: 'mutual',
    label: 'Observer ⇄ Probabilistic calibration', labelZh: '观察者 ⇄ 概率校准',
    curve: { kind: 'cubic', c1: [950, 162], c2: [1150, 650] },
    description: 'Two calibrations of the same gap: model ≠ reality.',
  },

  // ── MARKET ACTION CHAIN · FUNCTIONAL CHAIN 功能链 ───────────────────────
  {
    source: 'druckenmiller', target: 'stine', type: 'functional', direction: 'forward',
    label: 'Field → Generator', labelZh: '场 → 发生器',
    description: 'The macro field frames where generators are hunted.',
  },
  {
    source: 'stine', target: 'oneil', type: 'functional', direction: 'forward',
    label: 'Generator → Leadership', labelZh: '发生器 → 领导股',
    description: 'The hidden generator must become market leadership.',
  },
  {
    source: 'oneil', target: 'minervini', type: 'functional', direction: 'forward',
    label: 'Leadership → Geometry', labelZh: '领导股 → 几何',
    description: 'Leadership states are traded through their geometry.',
  },
  {
    source: 'minervini', target: 'phantom', type: 'functional', direction: 'forward',
    label: 'Geometry → Validation', labelZh: '几何 → 验证',
    description: 'Permission must be maintained by proof.',
  },
  {
    source: 'phantom', target: 'thorp', type: 'functional', direction: 'forward',
    label: 'Validation → Sizing', labelZh: '验证 → 仓位',
    description: 'Proven positions receive the risk budget they have earned.',
  },
]
