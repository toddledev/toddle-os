"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOldThemeCss = exports.getThemeCss = void 0;
const theme_const_1 = require("@toddle/core/src/styling/theme.const");
const getThemeCss = (theme, options) => {
    if ('breakpoints' in theme) {
        return (0, exports.getOldThemeCss)(theme);
    }
    return `
${options.includeResetStyle ? theme_const_1.RESET_STYLES : ''}

@layer base {
  ${options.createFontFaces
        ? theme.fonts
            .map((font) => `
    ${font.variants
            .map((variant) => `
    @font-face {
      font-family: "${font.family}";
      font-style: ${variant.italic ? 'italic' : 'normal'};
      font-weight: ${variant.weight};
      font-display: auto;
      src: local("${variant.url.substring(variant.url.lastIndexOf('/') + 1)}"), url("${variant.url.replace('https://fonts.gstatic.com', '/.toddle/fonts/font')}") format("woff2");
    }
    `)
            .join('\n')}
    `)
            .join('\n')
        : ''}

  body, :host {
    /* Color */
      ${theme.color
        .flatMap((group) => group.tokens.map((color) => `--${color.name}: ${color.value};`))
        .join('\n')}
  /* Fonts */
    ${theme.fonts
        .map((font) => `--font-${font.name}: '${font.family}',${font.type};`)
        .join('\n')}

    /* Font size */
    ${theme['font-size']
        .flatMap((group) => group.tokens.map((variable) => `--${variable.name}: ${variable.type === 'variable'
        ? `var(--${variable.value})`
        : variable.value};`))
        .join('\n')}

    /* Font weight */
    ${theme['font-weight']
        .flatMap((group) => {
        return group.tokens.map((variable) => `--${variable.name}: ${variable.type === 'variable'
            ? `var(--${variable.value})`
            : variable.value};`);
    })
        .join('\n')}

    /* Shadows */
    ${theme.shadow
        .flatMap((group) => {
        return group.tokens.map((variable) => `--${variable.name}: ${variable.type === 'variable'
            ? `var(--${variable.value})`
            : variable.value};`);
    })
        .join('\n')}

    /* Border radius */
    ${theme['border-radius']
        .flatMap((group) => {
        return group.tokens.map((token) => `--${token.name}: ${token.type === 'variable' ? `var(--${token.value})` : token.value};`);
    })
        .join('\n')}

    /* Spacing */
    ${theme.spacing
        .map((group) => {
        return group.tokens
            .map((token) => `--${token.name}: ${token.type === 'variable'
            ? `var(--${token.value})`
            : token.value};`)
            .join('\n');
    })
        .join('\n')}

    /* Z-index */
    ${theme['z-index']
        .map((group) => {
        return group.tokens
            .map((token) => `--${token.name}: ${token.type === 'variable'
            ? `var(--${token.value})`
            : token.value};`)
            .join('\n');
    })
        .join('\n')}
  }

  @keyframes animation-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes animation-fade-in {
    from {
      opacity:0;
    }
    to {
      opacity:1;
    }
  }


  @keyframes animation-fade-out {
    from {
      opacity:1;
    }
    to {
      opacity:0;
    }
  }
}
`;
};
exports.getThemeCss = getThemeCss;
const getOldThemeCss = (theme) => {
    const colorVars = Object.entries(theme.colors).flatMap(([color, { variants }]) => Object.entries(variants).map(([variant, { value }]) => `--${color}-${variant}:${value}`));
    return `




body, :host {
  ${Object.entries(theme.fontFamily)
        .map(([name, { value: [family, ...fallback], },]) => `--font-${name}: '${family}',${fallback.join(',')};`)
        .join('\n')}

  ${Object.entries(theme.fontWeight)
        .map(([name, { value }]) => `--font-weight-${name}: ${value};`)
        .join('\n')}

  ${Object.entries(theme.fontSize)
        .map(([name, { value }]) => `--font-size-${name}: ${value};`)
        .join('\n')}

  --spacing:${theme.spacing}rem;
    ${colorVars.join(';\n')};


  --text-xxs:0.625rem;
  --line-height-xxs:0.9rem;

  --text-xs:0.75rem;
  --line-height-xs:1rem;

  --text-sm:0.875rem;
  --line-height-sm:1.25rem;

  --text-base:1rem;
  --line-height-base:1.5rem;

  --text-lg:1.125rem;
  --line-height-lg:1.75rem;

  --text-xl:1.25rem;
  --line-height-xl:1.75rem;

  --text-2xl:1.5rem;
  --line-height-2xl:2rem;

  --text-3xl:1.875rem;
  --line-height-3xl:2.25rem;

  --text-4xl:2.25rem;
  --line-height-4xl:2.5rem;

  --text-5xl:3rem;
  --line-height-5xl:3rem;

  ${Object.entries(theme.shadow)
        .map(([name, { value }]) => `--shadow-${name}:${value};`)
        .join('\n')}
}

${theme_const_1.RESET_STYLES}

@keyframes animation-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes animation-fade-in {
  from {
    opacity:0;
  }
  to {
    opacity:1;
  }
}


@keyframes animation-fade-out {
  from {
    opacity:1;
  }
  to {
    opacity:0;
  }
}`;
};
exports.getOldThemeCss = getOldThemeCss;
//# sourceMappingURL=theme.js.map