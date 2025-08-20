/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      // Mobile devices (320px - 767px)
      'xs': '320px',
      'sm': '480px',
      
      // Tablets (768px - 1023px)
      'md': '768px',
      'lg': '1024px',
      
      // Notebooks/Laptops (1024px - 1439px)
      'notebook': '1024px',
      'laptop': '1280px',
      
      // MacBooks (1440px - 1679px)
      'macbook': '1440px',
      'macbook-13': '1440px',  // MacBook Pro M1 13" específico
      'macbook-air': '1440px',
      'macbook-pro': '1512px',
      'macbook-pro-14': '1512px',
      'macbook-pro-16': '1728px',
      
      // Desktop grandes (1680px+)
      'xl': '1680px',
      'desktop': '1920px',
      '2xl': '2560px',
      '3xl': '3840px',
      
      // Breakpoints específicos para altura (útil para MacBooks)
      'h-sm': { 'raw': '(min-height: 600px)' },
      'h-md': { 'raw': '(min-height: 768px)' },
      'h-lg': { 'raw': '(min-height: 900px)' },
      'h-xl': { 'raw': '(min-height: 1080px)' },
      
      // Breakpoints para orientação
      'portrait': { 'raw': '(orientation: portrait)' },
      'landscape': { 'raw': '(orientation: landscape)' },
      
      // Breakpoints para densidade de pixels (Retina displays)
      'retina': { 'raw': '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)' },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-poppins)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      spacing: {
        // Espaçamentos específicos para diferentes dispositivos
        'mobile': '1rem',
        'tablet': '1.5rem',
        'notebook': '2rem',
        'macbook': '2.5rem',
        'desktop': '3rem',
      },
      fontSize: {
        // Tamanhos de fonte responsivos
        'xs-mobile': ['0.75rem', { lineHeight: '1rem' }],
        'sm-mobile': ['0.875rem', { lineHeight: '1.25rem' }],
        'base-mobile': ['1rem', { lineHeight: '1.5rem' }],
        'lg-mobile': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl-mobile': ['1.25rem', { lineHeight: '1.75rem' }],
        
        'xs-tablet': ['0.875rem', { lineHeight: '1.25rem' }],
        'sm-tablet': ['1rem', { lineHeight: '1.5rem' }],
        'base-tablet': ['1.125rem', { lineHeight: '1.75rem' }],
        'lg-tablet': ['1.25rem', { lineHeight: '1.75rem' }],
        'xl-tablet': ['1.5rem', { lineHeight: '2rem' }],
        
        'xs-desktop': ['1rem', { lineHeight: '1.5rem' }],
        'sm-desktop': ['1.125rem', { lineHeight: '1.75rem' }],
        'base-desktop': ['1.25rem', { lineHeight: '1.75rem' }],
        'lg-desktop': ['1.5rem', { lineHeight: '2rem' }],
        'xl-desktop': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

module.exports = config;