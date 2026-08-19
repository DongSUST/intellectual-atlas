import type { MouseEvent } from 'react'
import type { AtlasNode } from '../types'
import { Symbol } from './Symbol'
import { cardSize } from '../lib/card'

interface Props {
  node: AtlasNode
  dim: boolean
  selected: boolean
  matched: boolean
  pathIndex: number | null
  onSelect: (id: string) => void
}

export function NodeCard({ node, dim, selected, matched, pathIndex, onSelect }: Props) {
  const { w, h } = cardSize(node)

  const click = (e: MouseEvent<SVGGElement>) => {
    e.stopPropagation()
    onSelect(node.id)
  }

  return (
    <g
      className={`node${dim ? ' node-dim' : ''}`}
      data-id={node.id}
      transform={`translate(${node.x} ${node.y})`}
      onClick={click}
      role="button"
      aria-label={node.name}
    >
      {node.style !== 'meta' && node.style !== 'crossing' && (
        <text className="node-layer" x={0} y={-h / 2 - 9} textAnchor="middle">
          {node.layer}
        </text>
      )}

      {matched && (
        <circle className="search-ring" cx={0} cy={0} r={Math.max(w, h) / 2 + 11} />
      )}

      {pathIndex !== null && (
        <g className="path-badge" transform={`translate(${w / 2 + 4} ${-h / 2 - 8})`}>
          <circle r="8.6" />
          <text y="3.1" textAnchor="middle">{pathIndex}</text>
        </g>
      )}

      {/* card is centred on the node coordinate; separate group keeps CSS hover transform independent */}
      <g transform={`translate(${-w / 2} ${-h / 2})`}>
      <g className={`node-card${selected ? ' selected' : ''}`}>
        <rect className="node-bg" width={w} height={h} rx="7" />

        {node.style === 'crossing' ? (
          <>
            <text className="cross-name" x={w / 2} y={21} textAnchor="middle">{node.name}</text>
            <text className="cross-op" x={w / 2} y={37} textAnchor="middle">Personal Synthesis</text>
            <text className="cross-kw" x={w / 2} y={51} textAnchor="middle">Mathematics · Markets · Philosophy</text>
            <text className="cross-kw" x={w / 2} y={62} textAnchor="middle">Economics · Action</text>
          </>
        ) : (
          <>
            <g className="node-symbol" transform={`translate(${11} ${11})`}>
              <Symbol id={node.symbol} />
            </g>
            <text className="node-name" x={33} y={node.style === 'meta' ? 25 : 20}>
              {node.name}
              {node.nameZh && <tspan className="node-zh"> {node.nameZh}</tspan>}
            </text>
            <text className="node-op" x={11} y={h - 9}>
              {node.operator}
            </text>
          </>
        )}
      </g>
      </g>
    </g>
  )
}
