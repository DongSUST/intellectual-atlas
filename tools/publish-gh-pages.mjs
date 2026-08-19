// One-command deploy: build dist/ and publish it to the gh-pages branch (GitHub Pages).
// Usage: npm run deploy
import { execSync } from 'node:child_process'
import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const run = (cmd) => execSync(cmd, { stdio: 'inherit', shell: true })
const quiet = (cmd) => execSync(cmd, { encoding: 'utf8', shell: true })

run('npm run build')

const tmp = mkdtempSync(join(tmpdir(), 'ghpages-'))
try {
  run('git worktree add --detach "' + tmp + '" HEAD')
  const hasBranch = quiet('git branch --list gh-pages').includes('gh-pages')
  if (hasBranch) run('git -C "' + tmp + '" checkout gh-pages')
  else run('git -C "' + tmp + '" checkout --orphan gh-pages')
  run('git -C "' + tmp + '" rm -rf .')
  cpSync('dist', tmp, { recursive: true })
  writeFileSync(join(tmp, '.nojekyll'), '')
  run('git -C "' + tmp + '" add -A')
  const sha = quiet('git rev-parse --short HEAD').trim()
  run('git -C "' + tmp + '" commit -m "deploy: ' + sha + '" --allow-empty')
  run('git -C "' + tmp + '" push origin gh-pages --force')
  console.log('✓ Deployed to https://dongsust.github.io/intellectual-atlas/')
} finally {
  rmSync(tmp, { recursive: true, force: true })
  run('git worktree prune')
}
