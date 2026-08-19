import type { AtlasEdge, AtlasNode } from '../types'
import { edgePath, midPoint } from '../lib/geometry'
import { cardSize } from '../lib/card'

interface Props {
  edges: AtlasEdge[]
  nodeById: Map<string, AtlasNode>
  visibleIds: Set<string>
  selectedId: string | null
  hoveredEdgeId: string | null
  activePathId: string | null
  pathEdgeIds: Set<string>
  matches: Set<string>
  onHover: (id: string | null) => void
}

const STROKE: Record<AtlasEdge['type'], number> = {
  generative: 1.7,
  structural: 1.3,
  flow: 1.2,
  feedback: 1.7,
  functional: 1.9,
}

export function EdgesLayer(props: Props) {
  const { edges, nodeById, visibleIds, selectedId, hoveredEdgeId, activePathId, pathEdgeIds, matches, onHover } = props

  return (
    <g className="edges-layer">
      {edges.map((e, i) => {
        const a = nodeById.get(e.source)
        const b = nodeById.get(e.target)
        if (!a || !b) return null
        if (!visibleIds.has(a.id) || !visibleIds.has(b.id)) return null
        const id = `${e.source}--${e.target}`
        const onPath = activePathId !== null && pathEdgeIds.has(id)
        const incidentToSelected = selectedId !== null && (e.source === selectedId || e.target === selectedId)
        const incidentToMatch = matches.size > 0 && (matches.has(e.source) || matches.has(e.target))

        let opacity = 1
        if (hoveredEdgeId) opacity = id === hoveredEdgeId ? 1 : 0.3
        else if (onPath) opacity = 1
        else if (selectedId) opacity = incidentToSelected ? 1 : 0.07
        else if (matches.size) opacity = incidentToMatch ? 0.55 : 0.06

        // arrowheads stop at the card boundary along the tangent direction
        const sa = cardSize(a)
        const sb = cardSize(b)
        const insetFor = (dir: [number, number], w: number, h: number) => {
          const len = Math.hypot(dir[0], dir[1]) || 1
          const ux = Math.abs(dir[0]) / len
          const uy = Math.abs(dir[1]) / len
          const tx = ux > 1e-6 ? w / 2 / ux : Infinity
          const ty = uy > 1e-6 ? h / 2 / uy : Infinity
          return Math.min(tx, ty) + 6
        }
        let dirA: [number, number]
        let dirB: [number, number]
        if (!e.curve) {
          dirA = [b.x - a.x, b.y - a.y]
          dirB = dirA
        } else if (e.curve.kind === 'quadratic') {
          dirA = [e.curve.cx - a.x, e.curve.cy - a.y]
          dirB = [b.x - e.curve.cx, b.y - e.curve.cy]
        } else {
          dirA = [e.curve.c1[0] - a.x, e.curve.c1[1] - a.y]
          dirB = [b.x - e.curve.c2[0], b.y - e.curve.c2[1]]
        }
        const d = edgePath(a, b, e.curve, insetFor(dirA, sa.w, sa.h), insetFor(dirB, sb.w, sb.h))
        const mid = midPoint(a, b, e.curve)
        const showLabel =
          e.alwaysShowLabel || id === hoveredEdgeId || incidentToSelected || onPath

        const markerEnd = e.type === 'structural' ? undefined : `url(#mk-${e.type})`
        const markerStart = e.direction === 'mutual' && e.type !== 'structural' ? `url(#mk-${e.type})` : undefined

        return (
          <g
            key={id}
            data-src={e.source}
            data-tgt={e.target}
            data-type={e.type}
            className={`edge edge-${e.type}${onPath ? ' edge-on-path' : ''} edge-load${e.type === 'flow' ? ' flow-anim' : ''}`}
            opacity={opacity}
            onMouseEnter={() => onHover(id)}
            onMouseLeave={() => onHover(null)}
            onClick={(ev) => ev.stopPropagation()}
          >
            {/* wide invisible hit area */}
            <path d={d} fill="none" stroke="transparent" strokeWidth={14} className="edge-hit" />
            <path
              d={d}
              fill="none"
              strokeWidth={onPath ? 3.3 : STROKE[e.type]}
              pathLength={1}
              markerStart={markerStart}
              markerEnd={markerEnd}
              className="edge-line"
              style={{ animationDelay: `${Math.min(i * 24, 900)}ms` }}
            />
            {showLabel && e.label && (
              <text className="edge-label" x={mid.x} y={mid.y - 8} textAnchor="middle">
                {e.label}
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}
