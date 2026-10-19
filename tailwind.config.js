/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--primary)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          hover: "var(--primary-hover)",
        },
        card: {
          DEFAULT: "var(--card-background)",
          foreground: "var(--foreground)",
        },
        destructive: {
          DEFAULT: "hsl(0 100% 50%)",
          foreground: "hsl(0 0% 100%)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        sage: {
          50: '#f0fdf6',
          100: '#dcfce9',
          200: '#bbf7d6',
          300: '#8fd8b5',
          400: '#6bb896',
          500: '#4a9e7a',
          600: '#368061',
          700: '#2d664f',
          800: '#275241',
          900: '#224437',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      height: {
        header: "var(--header-height)",
      },
      padding: {
        header: "var(--header-height)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
