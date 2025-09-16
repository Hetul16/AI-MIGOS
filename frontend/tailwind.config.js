/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // white with opacity
        input: 'var(--color-input)', // slate-800
        ring: 'var(--color-ring)', // cyan-500
        background: 'var(--color-background)', // slate-900
        foreground: 'var(--color-foreground)', // slate-50
        primary: {
          DEFAULT: 'var(--color-primary)', // indigo-500
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // violet-500
          foreground: 'var(--color-secondary-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-500
          foreground: 'var(--color-destructive-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // slate-700
          foreground: 'var(--color-muted-foreground)', // slate-400
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // cyan-500
          foreground: 'var(--color-accent-foreground)', // white
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // slate-800
          foreground: 'var(--color-popover-foreground)', // slate-50
        },
        card: {
          DEFAULT: 'var(--color-card)', // slate-800
          foreground: 'var(--color-card-foreground)', // slate-50
        },
        success: {
          DEFAULT: 'var(--color-success)', // emerald-500
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-500
          foreground: 'var(--color-warning-foreground)', // white
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-500
          foreground: 'var(--color-error-foreground)', // white
        },
      },
      fontFamily: {
        'heading': ['Outfit', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Poppins', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        'heading-light': '300',
        'heading-normal': '400',
        'heading-semibold': '600',
        'heading-bold': '700',
        'body-normal': '400',
        'body-medium': '500',
        'body-semibold': '600',
        'caption-normal': '400',
        'caption-medium': '500',
        'mono-normal': '400',
        'mono-medium': '500',
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'prominent': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'ai-glow': '0 0 20px rgba(6, 182, 212, 0.3)',
        'ai-glow-intense': '0 0 30px rgba(6, 182, 212, 0.5)',
      },
      animation: {
        'ai-pulse': 'ai-pulse 2s ease-in-out infinite',
        'progress-spin': 'progress-spin 1s linear infinite',
        'voting-shimmer': 'voting-shimmer 2s infinite',
        'slide-up': 'slide-up 300ms ease-out',
        'fade-in': 'fade-in 200ms ease-out',
      },
      keyframes: {
        'ai-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
          },
        },
        'progress-spin': {
          'from': {
            transform: 'rotate(0deg)',
          },
          'to': {
            transform: 'rotate(360deg)',
          },
        },
        'voting-shimmer': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        'slide-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          'from': {
            opacity: '0',
          },
          'to': {
            opacity: '1',
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}