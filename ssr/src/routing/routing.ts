import { PageComponent } from '@toddle/core/src/component/component.types'
import { isDefined } from '@toddle/core/src/utils/util'
import { ProjectFiles } from '@toddle/ssr/src/ssr.types'

export const matchPageForUrl = ({
  url,
  components,
}: {
  url: URL
  components: ProjectFiles['components']
}) => {
  const pathSegments = getPathSegments(url)
  return getPages(components)
    .sort((a, b) => a.route.path.length - b.route.path.length)
    .find((component) => {
      return (
        pathSegments.length <= component.route.path.length &&
        component.route.path.every(
          (segment, index) =>
            segment.type === 'param' ||
            segment.optional === true ||
            segment.name === pathSegments[index],
        )
      )
    })
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
