import type { ProjectFiles } from '@toddle/ssr/ssr.types'
import type {
  Component,
  NodeModel,
} from '../../../core/src/component/component.types'
import { isDefined } from '../../../core/src/utils/util'

export function takeIncludedComponents({
  root,
  projectComponents,
  packages = {},
}: {
  projectComponents: ProjectFiles['components']
  packages: ProjectFiles['packages']
  root: Component
}) {
  const components = {
    ...projectComponents,
    // Join the project components with all package components
    ...Object.fromEntries(
      Object.values(packages).flatMap((installedPackage) =>
        Object.values(installedPackage.components).map((component) => [
          `${installedPackage.manifest.name}/${component!.name}`,
          component,
        ]),
      ),
    ),
  }

  return [
    root,
    // Traverse all components from the root component
    ...takeComponentsIncludedInProject(root, components),
  ]
}

function takeComponentsIncludedInProject(
  parent: Component,
  components: Partial<Record<string, Component>>,
) {
  const dependencies = new Map<string, Component>()
  const visitNode = (node: NodeModel, packageName?: string) => {
    if (node.type !== 'component') {
      return
    }
    const nodeName = [node.package ?? packageName, node.name]
      .filter(isDefined)
      .join('/')
    if (dependencies.has(nodeName)) {
      return
    }
    const component = components[nodeName]
    if (!isDefined(component)) {
      return
    }

    // Only add known/existing dependencies
    if (Object.hasOwn(components, nodeName)) {
      dependencies.set(nodeName, { ...component, name: nodeName })
    }

    Object.values(component.nodes).forEach((node) =>
      visitNode(
        node,
        (node.type === 'component' ? node.package : undefined) ?? packageName,
      ),
    )
  }

  Object.values(parent.nodes).forEach((node) =>
    visitNode(node, node.type === 'component' ? node.package : undefined),
  )

  return Array.from(dependencies.values())
}
