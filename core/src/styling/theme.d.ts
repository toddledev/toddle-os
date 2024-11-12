export interface ThemeOptions {
    includeResetStyle: boolean;
    createFontFaces: boolean;
}
export type StyleToken = {
    name: string;
    type: 'value' | 'variable';
    value: string;
};
export type StyleTokenGroup = {
    name: string;
    tokens: StyleToken[];
};
export type StyleTokenCategory = 'spacing' | 'color' | 'font-size' | 'font-weight' | 'z-index' | 'border-radius' | 'shadow';
export type FontFamily = {
    name: string;
    family: string;
    provider: 'google' | 'upload';
    type: 'serif' | 'sans-serif' | 'monospace' | 'cursive';
    variants: Array<{
        name: string;
        weight: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
        italic: boolean;
        url: string;
    }>;
};
export type OldTheme = {
    spacing: number;
    colors: Record<string, {
        order: number;
        variants: Record<string, {
            value: string;
            order: number;
        }>;
    }>;
    fontFamily: Record<string, {
        value: string[];
        order: number;
        default?: boolean;
    }>;
    fontWeight: Record<string, {
        value: string;
        order: number;
        default?: boolean;
    }>;
    fontSize: Record<string, {
        value: string;
        order: number;
        default?: boolean;
    }>;
    shadow: Record<string, {
        value: string;
        order: number;
    }>;
    breakpoints: Record<string, {
        value: number;
        order: number;
    }>;
};
export type Theme = {
    scheme?: 'dark' | 'light';
    color: StyleTokenGroup[];
    fonts: FontFamily[];
    'font-size': StyleTokenGroup[];
    'font-weight': StyleTokenGroup[];
    spacing: StyleTokenGroup[];
    'border-radius': StyleTokenGroup[];
    shadow: StyleTokenGroup[];
    'z-index': StyleTokenGroup[];
};
export declare const getThemeCss: (theme: Theme | OldTheme, options: ThemeOptions) => string;
export declare const getOldThemeCss: (theme: OldTheme) => string;
//# sourceMappingURL=theme.d.ts.map