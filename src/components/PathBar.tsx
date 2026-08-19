import { PATHS } from '../data/paths'

interface Props {
  activePathId: string | null
  onSelect: (id: string | null) => void
}

export function PathBar({ activePathId, onSelect }: Props) {
  const active = PATHS.find((p) => p.id === activePathId) ?? null
  return (
    <div className="pathbar">
      <div className="pathbar-row">
        <span className="pathbar-title">PATH MODE · 思想路径</span>
        {PATHS.map((p) => (
          <button
            key={p.id}
            className={p.id === activePathId ? 'path-chip on' : 'path-chip'}
            onClick={() => onSelect(p.id === activePathId ? null : p.id)}
          >
            <span className="path-num">{p.id.slice(-1)}</span>{p.title}
          </button>
        ))}
      </div>
      {active && (
        <p className="pathbar-desc">
          <b>{active.title} · {active.titleZh}</b>
          <span> — {active.description} / {active.descriptionZh}</span>
        </p>
      )}
    </div>
  )
}
