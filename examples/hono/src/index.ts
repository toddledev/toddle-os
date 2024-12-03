import { Hono } from 'hono'
import type { HonoEnv } from '../hono'
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

// TODO: add missing routes below
// .toddle/custom-code
// .toddle/fonts/...
// .toddle/serviceWorker/...
// .toddle/manifest/...
// .toddle/icon/...
// .toddle/api-proxy/...
// reset stylesheet ...
// others?

app.get('/*', toddlePage)

export default app
