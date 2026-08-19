import type { AtlasNode } from '../types'

export function cardSize(node: AtlasNode): { w: number; h: number } {
  if (node.style === 'meta') return { w: 200, h: 66 }
  if (node.style === 'crossing') return { w: 136, h: 68 }
  const nameW = node.name.length * 6.6 + (node.nameZh ? node.nameZh.length * 9 + 5 : 0)
  const w = Math.min(178, Math.max(104, nameW + 46))
  return { w, h: 52 }
}
