// CDP verification: wait for React mount, collect errors, check geometry, screenshot
const port = process.argv[2] || '9222'
const outShot = process.argv[3] || 'shot-final.png'
const navUrl = process.argv[4] || 'http://localhost:5173'
import fs from 'node:fs'

const list = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json()
const page = list.find((t) => t.type === 'page' && t.url.includes('localhost'))
if (!page) { console.error('NO PAGE TARGET', list.map(t => t.type + ' ' + t.url)); process.exit(2) }
const ws = new WebSocket(page.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
const events = []
function send(method, params = {}) {
  return new Promise((res, rej) => {
    const i = ++id
    pending.set(i, { res, rej })
    ws.send(JSON.stringify({ id: i, method, params }))
  })
}
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data)
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id); pending.delete(m.id)
    m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result)
  } else if (m.method) events.push(m)
}
await new Promise((r) => { ws.onopen = r })
await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable')
await send('Page.navigate', { url: navUrl })

let ready = false
for (let i = 0; i < 50; i++) {
  await new Promise((r) => setTimeout(r, 250))
  const r = await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".node").length', returnByValue: true })
  if (r.result.value >= 23) { ready = true; break }
}
console.log('MOUNTED:', ready)
await new Promise((r) => setTimeout(r, 1800))

const expr = `(() => {
  const $ = (s) => [...document.querySelectorAll(s)]
  const nodes = $('.node').length
  const edgeGroups = $('.edges-layer g.edge').length
  const zoneTitles = $('.zone-title').map(e => e.textContent)
  const errlog = (document.getElementById('errlog') || {}).textContent || ''
  const g = document.querySelector('.map-wrap svg > g')
  const transform = g ? g.getAttribute('transform') : 'none'
  const dims = document.querySelector('.map-wrap svg').getBoundingClientRect()
  const cardRects = $('.node-bg').map(r => { const b = r.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height } })
  const overlaps = []
  for (let i = 0; i < cardRects.length; i++) for (let j = i + 1; j < cardRects.length; j++) {
    const a = cardRects[i], b = cardRects[j]
    const ox = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x))
    const oy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))
    if (ox > 2 && oy > 2) overlaps.push({ i, j, ox: Math.round(ox), oy: Math.round(oy) })
  }
  // precise: sample points along each edge line, test against card rects
  const precise = new Set()
  $('.edge-line').forEach((line, li) => {
    const len = line.getTotalLength()
    const ctm = line.getScreenCTM()
    if (!ctm) return
    for (let t = 0.02; t < 1; t += 0.025) {
      const p = line.getPointAtLength(t * len)
      const sp = new DOMPoint(p.x, p.y).matrixTransform(ctm)
      cardRects.forEach((c, ci) => {
        if (sp.x >= c.x - 1 && sp.x <= c.x + c.w + 1 && sp.y >= c.y - 1 && sp.y <= c.y + c.h + 1) precise.add(li + ':' + ci)
      })
    }
  })
  const overflows = []
  $('.node-name').forEach(t => {
    const bb = t.getBBox()
    const card = t.closest('g.node-card')
    if (!card) return
    const rect = card.querySelector('rect')
    const w = rect.getBBox().width
    if (bb.x + bb.width > w - 5) overflows.push({ text: t.textContent.slice(0, 26), tw: Math.round(bb.width), cw: Math.round(w) })
  })
  const offscreen = cardRects.filter(c => c.x < -2 || c.y < -2 || c.x + c.w > dims.width + 2 || c.y + c.h > dims.height + 2)
  const badges = $('.path-badge').length
  return { nodes, edgeGroups, zoneTitles, errlog, transform, viewport: { w: Math.round(dims.width), h: Math.round(dims.height) }, cardCount: cardRects.length, overlaps, preciseHits: [...precise].slice(0, 50), overflows, offscreen: offscreen.length, badges }
})()`
const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })
console.log('REPORT ' + JSON.stringify(r.result.value, null, 1))

const errs = events.filter(e => e.method === 'Runtime.exceptionThrown' || (e.method === 'Log.entryAdded' && e.entry && (e.entry.level === 'error' || e.entry.level === 'warning')))
console.log('CONSOLE ' + JSON.stringify(errs.map(e => e.method === 'Runtime.exceptionThrown' ? 'EXCEPTION ' + (e.params.exceptionDetails.exception?.description || e.params.exceptionDetails.text) : e.entry.level.toUpperCase() + ' ' + e.entry.text), null, 1))

const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
fs.writeFileSync(outShot, Buffer.from(shot.data, 'base64'))
console.log('SHOT ' + outShot + ' ' + shot.data.length)
ws.close()
process.exit(0)
