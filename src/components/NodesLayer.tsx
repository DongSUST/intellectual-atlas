import type { AtlasNode } from '../types'
import { NodeCard } from './NodeCard'

interface Props {
  nodes: AtlasNode[]
  visibleIds: Set<string>
  selectedId: string | null
  neighbors: Set<string>
  matches: Set<string>
  pathIndexById: Map<string, number>
  onSelect: (id: string) => void
}

export function NodesLayer({ nodes, visibleIds, selectedId, neighbors, matches, pathIndexById, onSelect }: Props) {
  return (
    <g className="nodes-layer">
      {nodes.map((n) => {
        if (!visibleIds.has(n.id)) return null
        const pathIndex = pathIndexById.get(n.id) ?? null
        let dim = false
        if (pathIndexById.size) dim = pathIndex === null
        else if (selectedId) dim = n.id !== selectedId && !neighbors.has(n.id)
        else if (matches.size) dim = !matches.has(n.id)
        return (
          <NodeCard
            key={n.id}
            node={n}
            dim={dim}
            selected={n.id === selectedId}
            matched={matches.has(n.id)}
            pathIndex={pathIndex}
            onSelect={onSelect}
          />
        )
      })}
    </g>
  )
}
