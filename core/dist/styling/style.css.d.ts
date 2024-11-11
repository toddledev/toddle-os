import type { Component } from '../src/component/component.types';
import { OldTheme, Theme, ThemeOptions } from '../src/styling/theme';
export declare function kebabCase(string: string): string;
export declare const createStylesheet: (root: Component, components: Component[], theme: Theme | OldTheme, options: ThemeOptions) => any;
export declare const getAllFonts: (components: Component[]) => Set<any>;
