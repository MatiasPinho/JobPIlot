/** @type {import('tailwindcss').Config} */

function om(channel) {
  return ({ opacityValue }) =>
    opacityValue !== undefined
      ? `rgb(var(--c-${channel}) / ${opacityValue})`
      : `rgb(var(--c-${channel}))`
}

export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          '"Cascadia Code"',
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
      },
      colors: {
        'om-base':          om('base'),
        'om-surface':       om('surface'),
        'om-raised':        om('raised'),
        'om-code':          om('code'),
        'om-dim':           om('dim'),
        'om-muted':         om('muted'),
        'om-border':        om('border'),
        'om-fg-muted':      om('fg-muted'),
        'om-fg-dim':        om('fg-dim'),
        'om-fg':            om('fg'),
        'om-cream':         om('cream'),
        'om-warm':          om('warm'),
        'om-red':           om('red'),
        'om-amber':         om('amber'),
        'om-green':         om('green'),
        'om-terracotta':    om('terracotta'),
        'om-gray':          om('gray'),
        'om-done':          om('done'),
        'om-violet':        om('violet'),
        'om-amber-deep':    om('amber-deep'),
      },
    },
  },
  plugins: [],
}
