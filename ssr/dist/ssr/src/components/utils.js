"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeIncludedComponents = takeIncludedComponents;
const util_1 = require("../../../core/src/utils/util");
function takeIncludedComponents({ root, projectComponents, packages = {}, }) {
    const components = {
        ...projectComponents,
        // Join the project components with all package components
        ...Object.fromEntries(Object.values(packages).flatMap((installedPackage) => Object.values(installedPackage.components).map((component) => [
            `${installedPackage.manifest.name}/${component.name}`,
            component,
        ]))),
    };
    return [
        root,
        // Traverse all components from the root component
        ...takeComponentsIncludedInProject(root, components),
    ];
}
function takeComponentsIncludedInProject(parent, components) {
    const dependencies = new Map();
    const visitNode = (node, packageName) => {
        if (node.type !== 'component') {
            return;
        }
        const nodeName = [node.package ?? packageName, node.name]
            .filter(util_1.isDefined)
            .join('/');
        if (dependencies.has(nodeName)) {
            return;
        }
        const component = components[nodeName];
        if (!(0, util_1.isDefined)(component)) {
            return;
        }
        // Only add known/existing dependencies
        if (Object.hasOwn(components, nodeName)) {
            dependencies.set(nodeName, { ...component, name: nodeName });
        }
        Object.values(component.nodes).forEach((node) => visitNode(node, (node.type === 'component' ? node.package : undefined) ?? packageName));
    };
    Object.values(parent.nodes).forEach((node) => visitNode(node, node.type === 'component' ? node.package : undefined));
    return Array.from(dependencies.values());
}
//# sourceMappingURL=utils.js.map