const list = await (await fetch('http://127.0.0.1:9222/json/list')).json()
const page = list.find((t) => t.type === 'page' && t.url.includes('4173'))
const ws = new WebSocket(page.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
function send(method, params = {}) { return new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) }) }
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id) } }
await new Promise((r) => { ws.onopen = r })
const r = await send('Runtime.evaluate', {
  expression: `(() => {
    const lines = [...document.querySelectorAll('.edge-line')]
    const cards = [...document.querySelectorAll('.node-bg')]
    const ids = cards.map(c => c.closest('.node').getAttribute('data-id'))
    const hits = []
    lines.forEach((line, li) => {
      const len = line.getTotalLength()
      const ctm = line.getScreenCTM()
      if (!ctm) return
      for (let t = 0.02; t < 1; t += 0.02) {
        const p = line.getPointAtLength(t * len)
        const sp = new DOMPoint(p.x, p.y).matrixTransform(ctm)
        cards.forEach((c, ci) => {
          const b = c.getBoundingClientRect()
          if (sp.x >= b.x - 1 && sp.x <= b.x + b.width + 1 && sp.y >= b.y - 1 && sp.y <= b.y + b.height + 1) {
            hits.push({ li, ci, node: ids[ci], t: +t.toFixed(2), wx: +p.x.toFixed(0), wy: +p.y.toFixed(0) })
          }
        })
      }
    })
    // dedupe consecutive
    const seen = new Set()
    const uniq = []
    for (const h of hits) {
      const k = h.li + ':' + h.ci
      if (seen.has(k)) continue
      seen.add(k)
      uniq.push(h)
    }
    return uniq
  })()`,
  returnByValue: true
})
console.log(JSON.stringify(r.result.value, null, 1))
ws.close()