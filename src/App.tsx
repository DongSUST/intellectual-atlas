import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { select } from 'd3-selection'
import 'd3-transition'
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior } from 'd3-zoom'
import { NODES } from './data/nodes'
import { EDGES } from './data/edges'
import { PATHS } from './data/paths'
import type { AtlasNode, FilterKey } from './types'
import { EdgesLayer } from './components/EdgesLayer'
import { NodesLayer } from './components/NodesLayer'
import { RegionsLayer } from './components/RegionsLayer'
import { Toolbar } from './components/Toolbar'
import { PathBar } from './components/PathBar'
import { Legend } from './components/Legend'
import { DetailPanel } from './components/DetailPanel'

export const WORLD_W = 1600
export const WORLD_H = 980

export default function App() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const gRef = useRef<SVGGElement | null>(null)
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [query, setQuery] = useState('')
  const [activePathId, setActivePathId] = useState<string | null>(null)
  const [legendOpen, setLegendOpen] = useState(false)
  const [errs, setErrs] = useState<string[]>([])

  const nodeById = useMemo(() => new Map(NODES.map((n) => [n.id, n])), [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return new Set<string>()
    const terms = q.split(/\s+/)
    return new Set(
      NODES.filter((n) => {
        const hay = [
          n.name, n.nameZh ?? '', n.operator, n.operatorZh ?? '', n.question, n.questionZh ?? '',
          n.layer, n.zone, ...n.concepts, ...(n.keywords ?? []),
        ].join(' ').toLowerCase()
        return terms.every((t) => hay.includes(t))
      }).map((n) => n.id)
    )
  }, [query])

  const activePath = useMemo(() => PATHS.find((p) => p.id === activePathId) ?? null, [activePathId])

  const pathEdgeIds = useMemo(() => {
    const ids = new Set<string>()
    if (activePath) {
      for (let i = 0; i < activePath.nodes.length - 1; i++) {
        ids.add(activePath.nodes[i] + '--' + activePath.nodes[i + 1])
      }
    }
    return ids
  }, [activePath])

  const visibleIds = useMemo(() => {
    if (filter === 'all') return new Set(NODES.map((n) => n.id))
    return new Set(
      NODES.filter((n) => {
        if (filter === 'system' || filter === 'market') return (n.tags ?? []).includes(filter)
        return (n.zones ?? [n.zone]).includes(filter)
      }).map((n) => n.id)
    )
  }, [filter])

  // ── d3-zoom ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const svg = svgRef.current
    const g = gRef.current
    if (!svg || !g) return
    const sel = select(svg)
    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.35, 3.5])
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        select(g).attr('transform', event.transform.toString())
      })
    sel.call(z)
    sel.on('dblclick.zoom', null) // keep node clicks calm; wheel + drag only
    zoomRef.current = z
    return () => {
      sel.on('.zoom', null)
    }
  }, [])

  const fitWorld = useCallback((animate = true) => {
    const svg = svgRef.current
    const z = zoomRef.current
    if (!svg || !z) return
    const w = svg.clientWidth
    const h = svg.clientHeight
    // viewBox scale + letterbox (preserveAspectRatio="xMidYMid meet")
    const vbs = Math.min(w / WORLD_W, h / WORLD_H)
    const lbx = (w - WORLD_W * vbs) / 2
    const lby = (h - WORLD_H * vbs) / 2
    let kTotal: number
    let cx = WORLD_W / 2
    let cy = WORLD_H / 2
    if (w < 700) {
      // narrow screens: start zoomed into the map centre instead of the whole world
      kTotal = 0.55
    } else {
      kTotal = Math.min((w - 48) / WORLD_W, (h - 48) / WORLD_H)
    }
    const k = kTotal / vbs
    const tx = ((w - WORLD_W * kTotal) / 2 - lbx) / vbs + (WORLD_W / 2 - cx) * k
    const ty = ((h - WORLD_H * kTotal) / 2 - lby) / vbs + (WORLD_H / 2 - cy) * k
    const t = zoomIdentity.translate(tx, ty).scale(k)
    const sel = select(svg)
    if (animate) (sel.transition().duration(700) as any).call(z.transform, t)
    else sel.call(z.transform, t)
  }, [])

  const fitNodes = useCallback((ids: Iterable<string>) => {
    const svg = svgRef.current
    const z = zoomRef.current
    if (!svg || !z) return
    const ns = [...ids].map((id) => nodeById.get(id)).filter((n): n is AtlasNode => !!n)
    if (!ns.length) return
    const w = svg.clientWidth
    const h = svg.clientHeight
    const vbs = Math.min(w / WORLD_W, h / WORLD_H)
    const lbx = (w - WORLD_W * vbs) / 2
    const lby = (h - WORLD_H * vbs) / 2
    const minX = Math.min(...ns.map((n) => n.x))
    const maxX = Math.max(...ns.map((n) => n.x))
    const minY = Math.min(...ns.map((n) => n.y))
    const maxY = Math.max(...ns.map((n) => n.y))
    const kTotal = Math.max(0.45, Math.min((w - 90) / Math.max(1, maxX - minX), (h - 90) / Math.max(1, maxY - minY), 1.1))
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const k = kTotal / vbs
    const tx = ((w - 0) / 2 - lbx) / vbs - cx * k
    const ty = ((h - 0) / 2 - lby) / vbs - cy * k
    const t = zoomIdentity.translate(tx, ty).scale(k)
    ;(select(svg).transition().duration(650) as any).call(z.transform, t)
  }, [nodeById])

  useEffect(() => {
    const id = requestAnimationFrame(() => fitWorld(false))
    return () => cancelAnimationFrame(id)
  }, [fitWorld])

  useEffect(() => {
    if (!matches.size) return
    const id = window.setTimeout(() => fitNodes(matches), 280)
    return () => window.clearTimeout(id)
  }, [matches, fitNodes])

  // ── error trap (visible in DOM dumps) ───────────────────────────────────
  useEffect(() => {
    const onErr = (e: ErrorEvent) => setErrs((prev) => [...prev.slice(-9), e.message])
    const onRej = (e: PromiseRejectionEvent) => setErrs((prev) => [...prev.slice(-9), 'rejection: ' + String(e.reason)])
    window.addEventListener('error', onErr)
    window.addEventListener('unhandledrejection', onRej)
    return () => {
      window.removeEventListener('error', onErr)
      window.removeEventListener('unhandledrejection', onRej)
    }
  }, [])

  const handleNodeSelect = useCallback((id: string) => {
    setSelectedId(id)
    setActivePathId(null)
  }, [])

  const handlePathSelect = useCallback((id: string | null) => {
    setActivePathId((prev) => (prev === id ? null : id))
    setSelectedId(null)
  }, [])

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
    if (q.trim()) {
      setSelectedId(null)
      setActivePathId(null)
    }
  }, [])

  const handleFilter = useCallback((f: FilterKey) => {
    setFilter(f)
    setSelectedId(null)
  }, [])

  const handleReset = useCallback(() => {
    setSelectedId(null)
    setActivePathId(null)
    setFilter('all')
    setQuery('')
    setHoveredEdgeId(null)
    fitWorld(true)
  }, [fitWorld])

  const selectedNode = selectedId ? nodeById.get(selectedId) ?? null : null

  const neighbors = useMemo(() => {
    const s = new Set<string>()
    if (selectedId) {
      for (const e of EDGES) {
        if (e.source === selectedId) s.add(e.target)
        if (e.target === selectedId) s.add(e.source)
      }
    }
    return s
  }, [selectedId])

  const pathIndexById = useMemo(() => {
    const m = new Map<string, number>()
    activePath?.nodes.forEach((id, i) => m.set(id, i + 1))
    return m
  }, [activePath])

  const focusActive = !!selectedId || !!activePath || matches.size > 0

  return (
    <div className="atlas-app">
      <header className="app-title">
        <h1>Interactive Intellectual Atlas <span className="v-tag">V0.1</span></h1>
        <p className="app-sub">A Genealogy of Generative Thought · 现实如何生成，认知如何成立，行动如何可能</p>
      </header>

      <Toolbar
        query={query}
        onQuery={handleSearch}
        filter={filter}
        onFilter={handleFilter}
        matchCount={matches.size}
        onFit={() => fitWorld(true)}
        onReset={handleReset}
      />

      <div className="map-wrap">
        <svg
          ref={svgRef}
          viewBox={'0 0 ' + WORLD_W + ' ' + WORLD_H}
          preserveAspectRatio="xMidYMid meet"
          onClick={() => setSelectedId(null)}
          role="img"
          aria-label="Interactive Intellectual Atlas — Reality → Cognition → Action"
        >
          <defs>
            <marker id="mk-generative" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="#1C2B45" />
            </marker>
            <marker id="mk-flow" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="#5C86AD" />
            </marker>
            <marker id="mk-feedback" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="#6B8F7E" />
            </marker>
            <marker id="mk-functional" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="#B98A3E" />
            </marker>
            <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2.2" floodColor="#1C2B45" floodOpacity="0.14" />
            </filter>
            <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8FAFCB" stopOpacity="0.55" />
              <stop offset="1" stopColor="#C9D8E4" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <g ref={gRef}>
            <rect x={-3000} y={-3000} width={WORLD_W + 6000} height={WORLD_H + 6000} fill="transparent" />
            <RegionsLayer filter={filter} focusActive={focusActive} visibleIds={visibleIds} />
            <EdgesLayer
              edges={EDGES}
              nodeById={nodeById}
              visibleIds={visibleIds}
              selectedId={selectedId}
              hoveredEdgeId={hoveredEdgeId}
              activePathId={activePathId}
              pathEdgeIds={pathEdgeIds}
              matches={matches}
              onHover={setHoveredEdgeId}
            />
            <NodesLayer
              nodes={NODES}
              visibleIds={visibleIds}
              selectedId={selectedId}
              neighbors={neighbors}
              matches={matches}
              pathIndexById={pathIndexById}
              onSelect={handleNodeSelect}
            />
          </g>
        </svg>
      </div>

      {selectedNode && (
        <DetailPanel
          node={selectedNode}
          activePathId={activePathId}
          onClose={() => setSelectedId(null)}
          onSelectPath={handlePathSelect}
        />
      )}

      <PathBar activePathId={activePathId} onSelect={handlePathSelect} />

      <Legend open={legendOpen} onToggle={() => setLegendOpen((o) => !o)} />

      <div id="errlog" aria-hidden="true">{errs.join(' | ')}</div>
    </div>
  )
}
