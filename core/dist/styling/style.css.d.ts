import type { Component } from '@toddle/core/src/component/component.types';
import { OldTheme, Theme, ThemeOptions } from '@toddle/core/src/styling/theme';
export declare function kebabCase(string: string): string;
export declare const createStylesheet: (root: Component, components: Component[], theme: Theme | OldTheme, options: ThemeOptions) => string;
export declare const getAllFonts: (components: Component[]) => Set<string>;
