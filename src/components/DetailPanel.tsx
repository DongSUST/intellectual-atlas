import { NODES } from '../data/nodes'
import { EDGES } from '../data/edges'
import { PATHS } from '../data/paths'
import { EDGE_TYPE_INFO, type AtlasNode } from '../types'

interface Props {
  node: AtlasNode
  activePathId: string | null
  onClose: () => void
  onSelectPath: (id: string) => void
}

export function DetailPanel({ node, activePathId, onClose, onSelectPath }: Props) {
  const conns = EDGES.filter((e) => e.source === node.id || e.target === node.id)
  const paths = PATHS.filter((p) => p.nodes.includes(node.id))

  return (
    <aside className="detail-panel" role="dialog" aria-label={node.name}>
      <button className="dp-close" onClick={onClose} aria-label="关闭">×</button>
      <div className="dp-head">
        <h2>{node.name}</h2>
        {node.nameZh && <p className="dp-zh">{node.nameZh}</p>}
        <div className="dp-tags">
          <span className="tag">{(node.zones ?? [node.zone]).join(' · ')}</span>
          <span className="tag">{node.layer}</span>
          {node.function && (
            <span className="tag tag-accent">{node.function}{node.functionZh ? ' · ' + node.functionZh : ''}</span>
          )}
        </div>
      </div>

      <section>
        <h4>Role · Operator / 角色</h4>
        <p className="dp-role">{node.operator}{node.operatorZh ? <span className="dp-zh"> · {node.operatorZh}</span> : null}</p>
      </section>

      <section>
        <h4>Core Question / 核心问题</h4>
        <p>{node.question}</p>
        {node.questionZh && <p className="dp-zh">{node.questionZh}</p>}
      </section>

      <section>
        <h4>Key Concepts / 核心概念</h4>
        <div className="dp-chips">
          {node.concepts.map((c) => <span key={c} className="chip">{c}</span>)}
        </div>
      </section>

      <section>
        <h4>Contribution to the Map / 地图贡献</h4>
        <p>{node.description}</p>
        <p className="dp-zh">{node.descriptionZh}</p>
      </section>

      <section>
        <h4>Connections / 连接</h4>
        <ul className="dp-conns">
          {conns.map((e) => {
            const otherId = e.target === node.id ? e.source : e.target
            const other = NODES.find((n) => n.id === otherId)
            if (!other) return null
            const dir = e.target === node.id ? '←' : '→'
            const ti = EDGE_TYPE_INFO[e.type]
            return (
              <li key={e.source + '--' + e.target}>
                <span className="conn-arrow">{dir}</span>
                <b>{other.name}</b>
                {e.label && <span className="conn-label"> · {e.label}</span>}
                <span className="conn-type" style={{ color: ti.color }}>{ti.zh}</span>
              </li>
            )
          })}
        </ul>
      </section>

      {paths.length > 0 && (
        <section>
          <h4>Suggested Paths / 建议路径</h4>
          <div className="dp-paths">
            {paths.map((p) => (
              <button
                key={p.id}
                className={p.id === activePathId ? 'path-chip on' : 'path-chip'}
                onClick={() => onSelectPath(p.id)}
              >
                <span className="path-num">{p.id.slice(-1)}</span> {p.title} · {p.titleZh}
              </button>
            ))}
          </div>
        </section>
      )}
    </aside>
  )
}
