interface Props {
  open: boolean
  onToggle: () => void
}

export function Legend({ open, onToggle }: Props) {
  return (
    <div className="legend">
      <button className="legend-toggle" onClick={onToggle}>
        LEGEND · 图例 <span className="legend-caret">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <ul className="legend-list">
          <li>
            <svg width="32" height="9"><line className="lg-generative" x1="0" y1="4.5" x2="25" y2="4.5" /><path d="M25 0.5l7 4-7 4z" fill="#1C2B45" /></svg>
            <span>Generative Influence · 生成关系</span>
          </li>
          <li>
            <svg width="32" height="9"><line className="lg-structural" x1="0" y1="4.5" x2="32" y2="4.5" /></svg>
            <span>Structural Resonance · 结构同构</span>
          </li>
          <li>
            <svg width="32" height="9"><line className="lg-flow" x1="0" y1="4.5" x2="25" y2="4.5" /><path d="M25 0.5l7 4-7 4z" fill="#5C86AD" /></svg>
            <span>Information Flow · 信息流</span>
          </li>
          <li>
            <svg width="32" height="9"><path d="M7 0.5l-7 4 7 4z" fill="#6B8F7E" /><line className="lg-feedback" x1="0" y1="4.5" x2="32" y2="4.5" /><path d="M25 0.5l7 4-7 4z" fill="#6B8F7E" /></svg>
            <span>Feedback Loop · 反馈</span>
          </li>
          <li>
            <svg width="32" height="9"><line className="lg-functional" x1="0" y1="4.5" x2="25" y2="4.5" /><path d="M25 0.5l7 4-7 4z" fill="#B98A3E" /></svg>
            <span>Functional Chain · 功能链</span>
          </li>
        </ul>
      )}
      <p className="legend-hint">点击节点查看详情 · 滚轮缩放 · 拖拽平移 · Click a node to explore</p>
    </div>
  )
}
