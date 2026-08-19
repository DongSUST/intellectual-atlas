// Interaction acceptance tests via CDP (no nested template literals)
const list = await (await fetch('http://127.0.0.1:9222/json/list')).json()
const page = list.find((t) => t.type === 'page' && t.url.includes('4173'))
const ws = new WebSocket(page.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
function send(method, params = {}) { return new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })) }) }
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result) } }
await new Promise((r) => { ws.onopen = r })
await send('Runtime.enable')
async function evalJs(expr) {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })
  if (r.exceptionDetails) throw new Error('EVAL ERR: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text))
  return r.result.value
}
const results = []
const check = (name, ok, detail) => results.push((ok ? 'PASS' : 'FAIL') + ' | ' + name + (detail ? ' | ' + detail : ''))
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

await send('Page.navigate', { url: 'http://localhost:4173/?v=' + Date.now() })
await sleep(2600)

check('initial: 24 nodes mounted', (await evalJs("document.querySelectorAll('.node').length")) === 24)
check('initial: no detail panel', (await evalJs("document.querySelectorAll('.detail-panel').length")) === 0)
check('initial: path bar has 6 paths', (await evalJs("document.querySelectorAll('.pathbar .path-chip').length")) === 6)
check('initial: legend present', (await evalJs("document.querySelectorAll('.legend').length")) === 1)
check('initial: zone titles', JSON.stringify(await evalJs("[...document.querySelectorAll('.zone-title')].map(function(e){return e.textContent})")) === JSON.stringify(['REALITY', 'COGNITION', 'ACTION']))

await evalJs("(function(){ var n=[...document.querySelectorAll('.node')].find(function(n){return n.getAttribute('data-id')==='arthur'}); n.dispatchEvent(new MouseEvent('click',{bubbles:true})); return true })()")
await sleep(400)
check('click Arthur opens panel', (await evalJs("document.querySelectorAll('.detail-panel').length")) === 1)
check('panel shows Arthur', String(await evalJs("document.querySelector('.detail-panel h2').textContent")).indexOf('Arthur') >= 0)
check('panel role shows Evolutionary Mechanism', String(await evalJs("document.querySelector('.detail-panel .dp-role').textContent")).indexOf('Evolutionary Mechanism') >= 0)
check('dimming keeps Arthur+neighbours lit (7 total)', await evalJs("(function(){ var lit=[...document.querySelectorAll('.node:not(.node-dim)')].map(function(n){return n.getAttribute('data-id')}); return lit.length === 7 && lit.indexOf('arthur')>=0 && lit.indexOf('darwin')>=0 && lit.indexOf('lo')>=0 && lit.indexOf('soros')>=0 && lit.indexOf('perez')>=0 && lit.indexOf('anderson')>=0 && lit.indexOf('qian')>=0 })()"))
check('panel connections non-empty', (await evalJs("document.querySelectorAll('.dp-conns li').length")) > 0)
check('panel suggests path2+path3', await evalJs("(function(){ var t=[...document.querySelectorAll('.dp-paths .path-chip')].map(function(e){return e.textContent}).join(' '); return t.indexOf('Evolutionary Markets')>=0 && t.indexOf('Technology to Extreme Winner')>=0 })()"))

await evalJs("(function(){ document.querySelector('.map-wrap svg').dispatchEvent(new MouseEvent('click',{bubbles:true})); return true })()")
await sleep(300)
check('click empty space closes panel', (await evalJs("document.querySelectorAll('.detail-panel').length")) === 0)

async function setSearch(q) {
  await evalJs("(function(){ var i=document.querySelector('.search-box input'); var set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; set.call(i,'" + q + "'); i.dispatchEvent(new Event('input',{bubbles:true})); return true })()")
  await sleep(700)
}
await setSearch('causality')
check('search causality → pearl only', await evalJs("[...document.querySelectorAll('.node:not(.node-dim)')].map(function(n){return n.getAttribute('data-id')}).join(',')") === 'pearl')
check('search ring on Pearl', (await evalJs("document.querySelectorAll('.node[data-id=pearl] .search-ring').length")) === 1)
await setSearch('network')
check('search network → barabasi+pentland', await evalJs("[...document.querySelectorAll('.node:not(.node-dim)')].map(function(n){return n.getAttribute('data-id')}).sort().join(',')") === 'barabasi,pentland')
await setSearch('permission')
check('search permission → minervini+phantom', await evalJs("[...document.querySelectorAll('.node:not(.node-dim)')].map(function(n){return n.getAttribute('data-id')}).sort().join(',')") === 'minervini,phantom')
await setSearch('Arthur')
check('search Arthur → arthur only', await evalJs("[...document.querySelectorAll('.node:not(.node-dim)')].map(function(n){return n.getAttribute('data-id')}).join(',')") === 'arthur')
await setSearch('')
check('search cleared → 24 lit', (await evalJs("document.querySelectorAll('.node:not(.node-dim)').length")) === 24)

async function setFilter(label) {
  await evalJs("(function(){ [...document.querySelectorAll('.filter-row .chip')].find(function(c){return c.textContent==='" + label + "'}).click(); return true })()")
  await sleep(400)
}
await setFilter('REALITY')
check('filter REALITY renders 11', (await evalJs("document.querySelectorAll('.nodes-layer .node').length")) === 11)
await setFilter('COGNITION')
check('filter COGNITION renders 7', (await evalJs("document.querySelectorAll('.nodes-layer .node').length")) === 7)
await setFilter('ACTION')
check('filter ACTION renders 12', (await evalJs("document.querySelectorAll('.nodes-layer .node').length")) === 12)
await setFilter('META')
check('filter META renders grothendieck', (await evalJs("document.querySelectorAll('.nodes-layer .node')[0].getAttribute('data-id')")) === 'grothendieck')
await setFilter('SYSTEM')
check('filter SYSTEM renders 13', (await evalJs("document.querySelectorAll('.nodes-layer .node').length")) === 13)
await setFilter('MARKET')
check('filter MARKET renders 13', (await evalJs("document.querySelectorAll('.nodes-layer .node').length")) === 13)
await setFilter('ALL')
check('filter ALL restores 24', (await evalJs("document.querySelectorAll('.nodes-layer .node').length")) === 24)

async function togglePath(name) {
  await evalJs("(function(){ [...document.querySelectorAll('.pathbar .path-chip')].find(function(c){return c.textContent.indexOf('" + name + "')>=0}).click(); return true })()")
  await sleep(500)
}
await togglePath('Evolutionary Markets')
check('path2 badges = 4', (await evalJs("document.querySelectorAll('.path-badge').length")) === 4)
check('path2 lit nodes = 4', (await evalJs("document.querySelectorAll('.node:not(.node-dim)').length")) === 4)
check('path2 thick edges = 3', (await evalJs("document.querySelectorAll('.edge-on-path').length")) === 3)
check('path2 description bar shown', String(await evalJs("document.querySelector('.pathbar-desc') ? document.querySelector('.pathbar-desc').textContent : ''")).indexOf('演化市场') >= 0)
check('path2 badges ordered 1234', await evalJs("[...document.querySelectorAll('.path-badge text')].map(function(t){return t.textContent}).join('')") === '1234')
await togglePath('Evolutionary Markets')
check('path2 toggles off', (await evalJs("document.querySelectorAll('.path-badge').length")) === 0)

const t0 = await evalJs("document.querySelector('.map-wrap svg > g').getAttribute('transform')")
await evalJs("(function(){ var svg=document.querySelector('.map-wrap svg'); var r=svg.getBoundingClientRect(); svg.dispatchEvent(new WheelEvent('wheel',{bubbles:true,cancelable:true,clientX:r.x+r.width/2,clientY:r.y+r.height/2,deltaY:-240})); return true })()")
await sleep(700)
const t1 = await evalJs("document.querySelector('.map-wrap svg > g').getAttribute('transform')")
check('wheel zoom changes transform', t0 !== t1, 'from ' + t0 + ' to ' + t1)

await evalJs("(function(){ [...document.querySelectorAll('.view-btn')].find(function(b){return b.textContent.indexOf('Fit')>=0}).click(); return true })()")
await sleep(900)
const t2 = await evalJs("document.querySelector('.map-wrap svg > g').getAttribute('transform')")
check('Fit button refits', t2 !== t1, t2)
await evalJs("(function(){ [...document.querySelectorAll('.view-btn')].find(function(b){return b.textContent.indexOf('Reset')>=0}).click(); return true })()")
await sleep(900)
check('Reset restores all-lit view', (await evalJs("document.querySelectorAll('.node:not(.node-dim)').length")) === 24)

await evalJs("(function(){ document.querySelector('.legend-toggle').click(); return true })()")
await sleep(200)
check('legend opens with 5 items', (await evalJs("document.querySelectorAll('.legend-list li').length")) === 5)

await togglePath('From Generator to Capital')
check('path4 badges = 5', (await evalJs("document.querySelectorAll('.path-badge').length")) === 5)
check('path4 thick functional edges = 4', (await evalJs("document.querySelectorAll('.edge-on-path').length")) === 4)
await togglePath('From Generator to Capital')

check('errlog empty (no runtime errors)', (await evalJs("document.getElementById('errlog').textContent")) === '')

console.log('RESULTS')
for (const r of results) console.log(r)
const failed = results.filter((r) => r.indexOf('FAIL') === 0).length
console.log('SUMMARY ' + (results.length - failed) + '/' + results.length + ' passed')
ws.close()
process.exit(failed > 0 ? 1 : 0)
