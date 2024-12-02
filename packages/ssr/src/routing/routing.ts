import { PageComponent } from '@toddledev/core/dist/component/component.types'
import { isDefined } from '@toddledev/core/dist/utils/util'
import { ProjectFiles } from '@toddledev/ssr/dist/ssr.types'

export const matchPageForUrl = ({
  url,
  components,
}: {
  url: URL
  components: ProjectFiles['components']
}): PageComponent | undefined => {
  const pathSegments = getPathSegments(url)
  const matches = getPages(components)
    .filter(
      (page) =>
        pathSegments.length <= page.route.path.length &&
        page.route.path.every(
          (segment, index) =>
            segment.type === 'param' ||
            segment.optional === true ||
            segment.name === pathSegments[index],
        ),
    )
    .sort((a, b) => {
      // Prefer shorter routes
      const diff = a.route.path.length - b.route.path.length
      if (diff !== 0) {
        return diff
      }
      for (let i = 0; i < pathSegments.length; i++) {
        // Prefer static segments over dynamic ones
        // We don't need to check if the name matches, since we did that in the filter above
        const aScore = a.route.path[i].type === 'static' ? 1 : 0
        const bScore = b.route.path[i].type === 'static' ? 1 : 0
        if (aScore !== bScore) {
          return bScore - aScore
        }
      }
      // TODO: Before giving up on a tie, we could compare the query params?
      return 0
    })
  return matches[0]
}

export const get404Page = (components: ProjectFiles['components']) =>
  getPages(components).find((page) => page.name === '404')

const getPages = (components: ProjectFiles['components']) =>
  Object.values(components).filter((c): c is PageComponent =>
    isDefined(c!.route),
  )

export const getPathSegments = (url: URL) =>
  url.pathname
    .substring(1)
    .split('/')
    .filter((s) => s !== '')
