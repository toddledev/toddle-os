import {
  get404Page,
  getHtmlLanguage,
  matchPageForUrl,
} from '@toddledev/ssr/dist'
import { Context } from 'hono'
import { HonoEnv } from '../../hono'

export const toddlePage = async (c: Context<HonoEnv>) => {
  const url = new URL(c.req.url)
  let page = matchPageForUrl({
    url,
    components: c.env.project.files.components,
  })
  if (!page) {
    page = get404Page(c.env.project.files.components)
    if (!page) {
      return c.html('Page not found', { status: 404 })
    }
  }
  const language = getHtmlLanguage({
    pageInfo: page.route.info,
    formulaContext: undefined as any,
    defaultLanguage: 'en',
  })
  return c.html(`<!DOCTYPE html>
<html lang="${language}">
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    <h1>${page.name}</h1>
  </body>
</html>`)
}
