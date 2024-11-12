import type { ProjectFiles } from '@toddle/ssr/ssr.types';
import type { Component } from '../../../core/src/component/component.types';
export declare function takeIncludedComponents({ root, projectComponents, packages, }: {
    projectComponents: ProjectFiles['components'];
    packages: ProjectFiles['packages'];
    root: Component;
}): Component[];
