import type { FilterKey } from '../types'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'reality', label: 'REALITY' },
  { key: 'cognition', label: 'COGNITION' },
  { key: 'action', label: 'ACTION' },
  { key: 'meta', label: 'META' },
  { key: 'system', label: 'SYSTEM' },
  { key: 'market', label: 'MARKET' },
]

interface Props {
  query: string
  onQuery: (q: string) => void
  filter: FilterKey
  onFilter: (f: FilterKey) => void
  matchCount: number
  onFit: () => void
  onReset: () => void
}

export function Toolbar({ query, onQuery, filter, onFilter, matchCount, onFit, onReset }: Props) {
  return (
    <div className="toolbar">
      <label className="search-box">
        <svg className="search-icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="M12.6 12.6L17 17" />
        </svg>
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') onQuery('') }}
          placeholder="Search · 搜索人物 / 概念 / 关键词"
          aria-label="搜索"
        />
        {query && <button className="search-clear" onClick={() => onQuery('')} aria-label="清除">×</button>}
        {matchCount > 0 && <span className="search-count">{matchCount}</span>}
      </label>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button key={f.key} className={filter === f.key ? 'chip on' : 'chip'} onClick={() => onFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="view-row">
        <button className="view-btn" onClick={onFit}>Fit 适配</button>
        <button className="view-btn" onClick={onReset}>Reset 重置</button>
      </div>
    </div>
  )
}
