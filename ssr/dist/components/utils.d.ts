import type { Component } from '@toddle/core/src/component/component.types';
import type { ProjectFiles } from '@toddle/ssr/ssr.types';
export declare function takeIncludedComponents({ root, projectComponents, packages, }: {
    projectComponents: ProjectFiles['components'];
    packages: ProjectFiles['packages'];
    root: Component;
}): Component[];
