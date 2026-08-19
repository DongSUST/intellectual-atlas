import type { FilterKey } from '../types'

interface Props {
  filter: FilterKey
  focusActive: boolean
  visibleIds: Set<string>
}

const DEPTH = [
  'Representation', 'Rules', 'Relations', 'Emergence', 'Systems', 'Causality', 'Observer',
  'Civilization', 'Technology / Economy', 'Market', 'Asset', 'Geometry', 'Permission', 'Action',
]

const CX = 913, CY = 642, R = 174
const CYCLE = [
  { t: 'History', a: -55 },
  { t: 'Agents', a: -20 },
  { t: 'Beliefs', a: 30 },
  { t: 'Actions', a: 80 },
  { t: 'Environment', a: 115 },
  { t: 'Selection', a: 160 },
  { t: 'New History', a: 205 },
]
const CYCLE_ARROWS = [-37.5, 5, 55, 97.5, 137.5, 182.5, 222.5]
const rad = (d: number) => (d * Math.PI) / 180

const STAGES = [
  { en: 'FIELD', zh: '场', y: 322 },
  { en: 'GENERATOR', zh: '发生器', y: 401 },
  { en: 'LEADERSHIP', zh: '领导股', y: 480 },
  { en: 'GEOMETRY / PERMISSION', zh: '几何 / 许可', y: 559 },
  { en: 'VALIDATION', zh: '验证', y: 638 },
  { en: 'SIZING', zh: '仓位', y: 741 },
]

export function RegionsLayer({ filter, focusActive, visibleIds }: Props) {
  const showMeta = visibleIds.has('grothendieck')
  const showEngine = ['arthur', 'lo', 'soros'].some((id) => visibleIds.has(id))
  const chainVisible = ['druckenmiller', 'stine', 'oneil', 'minervini', 'phantom', 'thorp'].filter((id) => visibleIds.has(id)).length
  const showCrossing = visibleIds.has('chanzhong')
  const showSynthesis = filter !== 'reality' && filter !== 'cognition' && filter !== 'meta'
  const cls = (cond: boolean) => (cond ? 'region' : 'region region-hidden')
  const focus = focusActive ? ' region-dim' : ''

  return (
    <g className="regions-layer">
      {/* ── zone frame ─────────────────────────────────────────────── */}
      <g className={cls(true) + focus}>
        <text className="zone-title" x={295} y={48} textAnchor="middle">REALITY</text>
        <text className="zone-sub" x={295} y={64} textAnchor="middle">现实如何生成</text>
        <text className="zone-title" x={730} y={48} textAnchor="middle">COGNITION</text>
        <text className="zone-sub" x={730} y={64} textAnchor="middle">认知如何成立</text>
        <text className="zone-title" x={1260} y={48} textAnchor="middle">ACTION</text>
        <text className="zone-sub" x={1260} y={64} textAnchor="middle">在不确定中如何行动</text>
        <text className="zone-arrow" x={505} y={56} textAnchor="middle">→</text>
        <text className="zone-arrow" x={965} y={56} textAnchor="middle">→</text>
        <line className="zone-divider" x1={500} y1={84} x2={500} y2={788} />
        <line className="zone-divider" x1={960} y1={84} x2={960} y2={788} />
      </g>

      {/* ── abstraction-depth ruler ────────────────────────────────── */}
      <g className={cls(true) + focus}>
        <text className="ruler-title" transform="rotate(-90 64 200)" x={64} y={200} textAnchor="middle">
          ABSTRACT DEPTH · 抽象深度
        </text>
        <line className="ruler-line" x1={56} y1={205} x2={56} y2={790} />
        {DEPTH.map((d, i) => {
          const y = 205 + i * 45
          return (
            <g key={d}>
              <line className="ruler-tick" x1={52} y1={y} x2={56} y2={y} />
              <text className="ruler-label" x={60} y={y + 2.4}>{d}</text>
            </g>
          )
        })}
      </g>

      {/* ── META-LAYER ─────────────────────────────────────────────── */}
      <g className={cls(showMeta) + focus}>
        <rect className="meta-band" x={140} y={80} width={490} height={132} rx={9} />
        <text className="meta-title" x={154} y={102}>META-LAYER · 元层</text>
        <text className="meta-sub" x={154} y={116}>Representation · Relative Structure · Rising Sea</text>
        <text className="meta-quote" x={435} y={110} fontStyle="italic">Don't attack the problem itself.</text>
        <text className="meta-quote" x={435} y={124} fontStyle="italic">Change the space in which it lives.</text>
        <text className="meta-quote-zh" x={435} y={142}>不要只攻击问题本身，</text>
        <text className="meta-quote-zh" x={435} y={156}>改变问题所在的空间。</text>
        {/* rising sea */}
        <rect className="sea" x={140} y={188} width={490} height={24} />
        <path className="sea-wave" d="M140 199 C 165 193, 190 205, 215 199 S 265 193, 290 199 S 340 205, 365 199 S 415 193, 440 199 S 490 205, 515 199 S 565 193, 590 199 S 620 202, 630 199" />
        <text className="sea-label" x={614} y={207} textAnchor="end">RISING SEA · 上升之海</text>
      </g>

      {/* ── CALIBRATION TRIANGLE · center text ─────────────────────── */}
      <g className={cls(true) + focus}>
        <text className="calib-title" x={890} y={458} textAnchor="middle">MODEL ≠ REALITY</text>
        <text className="calib-sub" x={890} y={472} textAnchor="middle">A model must be causally meaningful,</text>
        <text className="calib-sub" x={890} y={485} textAnchor="middle">cognitively calibrated, probabilistically testable.</text>
      </g>

      {/* ── EVOLUTIONARY REFLEXIVE SYSTEM ──────────────────────────── */}
      <g className={cls(showEngine) + focus}>
        <circle className="engine-ring" cx={CX} cy={CY} r={R} />
        <text className="engine-title" x={CX} y={635} textAnchor="middle">EVOLUTIONARY</text>
        <text className="engine-title" x={CX} y={648} textAnchor="middle">REFLEXIVE SYSTEM</text>
        <text className="engine-sub" x={CX} y={663} textAnchor="middle">演化反馈系统</text>
        <text className="engine-quote" x={860} y={568} textAnchor="middle">History enters the present.</text>
        <text className="engine-quote" x={1040} y={752} textAnchor="middle">Agents adapt to environment.</text>
        <text className="engine-quote" x={840} y={766} textAnchor="middle">Beliefs and actions reshape environment.</text>
        {CYCLE.map((c) => (
          <text key={c.t} className="cycle-label" x={CX + R * Math.cos(rad(c.a))} y={CY + R * Math.sin(rad(c.a))} textAnchor="middle">
            {c.t}
          </text>
        ))}
        {CYCLE_ARROWS.map((a) => (
          <text key={a} className="cycle-arrow" x={CX + R * Math.cos(rad(a))} y={CY + R * Math.sin(rad(a))} textAnchor="middle">→</text>
        ))}
        <text className="cycle-arrow" x={CX + R * Math.cos(rad(240))} y={CY + R * Math.sin(rad(240))} textAnchor="middle">↺</text>
      </g>

      {/* ── MARKET ACTION CHAIN rail ───────────────────────────────── */}
      <g className={cls(chainVisible >= 2) + focus}>
        <line className="chain-rail" x1={1440} y1={300} x2={1440} y2={760} />
        <text className="chain-title" x={1330} y={294} textAnchor="middle">FUNCTIONAL CHAIN · 功能链</text>
        {STAGES.map((s) => (
          <text key={s.en} className="stage-label" x={1228} y={s.y} textAnchor="end">
            <tspan className="stage-en">{s.en}</tspan>
            <tspan className="stage-zh"> {s.zh}</tspan>
          </text>
        ))}
      </g>

      {/* ── THE CROSSING ───────────────────────────────────────────── */}
      <g className={cls(showCrossing) + focus}>
        <text className="crossing-title" x={780} y={806} textAnchor="middle">THE CROSSING · 交叉处</text>
        <path className="crossing-ring" d="M 815 816.4 A 70 70 0 1 1 745 816.4" />
        <text className="crossing-cap" x={780} y={958} textAnchor="middle">Reality ∩ Cognition ∩ Action</text>
        <text className="crossing-cap-sub" x={780} y={971} textAnchor="middle">A historical example of personal synthesis across domains.</text>
      </g>

      {/* ── CURRENT SYNTHESIS ──────────────────────────────────────── */}
      <g className={cls(showSynthesis) + focus}>
        <rect className="synthesis-box" x={1230} y={806} width={330} height={134} rx={9} />
        <text className="synth-title" x={1395} y={828} textAnchor="middle">CURRENT SYNTHESIS</text>
        <text className="synth-sub" x={1395} y={842} textAnchor="middle">当前综合工作台</text>
        <text className="synth-loop" x={1395} y={864} textAnchor="middle">SENSE → MODEL → ACT → LEARN ↺</text>
        <text className="synth-var" x={1395} y={884} textAnchor="middle">History · Relations · Causality · Observer · Field</text>
        <text className="synth-var" x={1395} y={897} textAnchor="middle">Generator · Geometry · Permission · Experience · Adaptation</text>
        <text className="synth-hl" x={1395} y={915} textAnchor="middle">Field → Generator → Geometry → Permission → Action</text>
        <text className="synth-cap" x={1395} y={931} textAnchor="middle">This is an open working architecture, not a final theory.</text>
      </g>
    </g>
  )
}
