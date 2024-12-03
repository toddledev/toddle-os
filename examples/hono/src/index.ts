import { RESET_STYLES } from '@toddledev/core/dist/styling/theme.const'
import { readFileSync } from 'fs'
import { Hono } from 'hono'
import { resolve } from 'path'
import type { HonoEnv } from '../hono'
import { favicon } from './routes/favicon'
import { manifest } from './routes/manifest'
import { robots } from './routes/robots'
import { sitemap } from './routes/sitemap'
import { toddlePage } from './routes/toddlePage'
import { getProject } from './utils/project'

const app = new Hono<HonoEnv>()

// Load the project onto context as a middleware
app.use(async (c, next) => {
  const project = getProject()
  if (!project) {
    return c.text('Project not found', { status: 404 })
  }
  c.env.project = project
  await next()
})

app.get('/sitemap.xml', sitemap)
app.get('/robots.txt', robots)
app.get('/manifest.json', manifest)
app.get('/favicon.ico', favicon)
app.get('/_static/reset.css', (c) => {
  c.header('Content-Type', 'text/css')
  c.header('Cache-Control', 'public, max-age=3600')
  return c.body(RESET_STYLES)
})
app.get('/_static/page.main.js', (c) => {
  c.header('Content-Type', 'text/javascript')
  c.header('Cache-Control', 'public, max-age=3600')
  // TODO: stream this file instead of reading it all into memory
  const projectData = readFileSync(
    resolve(__dirname, '../../../packages/runtime/dist/page.main.js'),
    'utf8',
  )
  return c.body(projectData)
})

// TODO: add missing routes below
// .toddle/custom-code
// .toddle/fonts/...
// .toddle/serviceWorker/...
// .toddle/api-proxy/...

app.get('/*', toddlePage)

export default app
