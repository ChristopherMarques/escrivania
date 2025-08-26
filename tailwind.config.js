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
    backgroundImage: {
      "gradient-primary": "linear-gradient(135deg, oklch(0.6 0.2 270) 0%, oklch(0.75 0.15 200) 100%)",
      "gradient-escrivania": "linear-gradient(135deg, oklch(0.6 0.2 270) 0%, oklch(0.75 0.15 200) 100%)",
      "gradient-purple": "linear-gradient(135deg, oklch(0.7 0.2 270) 0%, oklch(0.5 0.24 270) 100%)",
      "gradient-blue": "linear-gradient(135deg, oklch(0.8 0.15 200) 0%, oklch(0.6 0.22 200) 100%)",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      // Mobile devices (320px - 767px)
      xs: "320px",
      sm: "480px",

      // Tablets (768px - 1023px)
      md: "768px",
      lg: "1024px",

      // Notebooks/Laptops (1024px - 1439px)
      notebook: "1024px",
      laptop: "1280px",

      // MacBooks (1440px - 1679px)
      macbook: "1440px",
      "macbook-13": "1440px", // MacBook Pro M1 13" específico
      "macbook-air": "1440px",
      "macbook-pro": "1512px",
      "macbook-pro-14": "1512px",
      "macbook-pro-16": "1728px",

      // Desktop grandes (1680px+)
      xl: "1680px",
      desktop: "1920px",
      "2xl": "2560px",
      "3xl": "3840px",

      // Breakpoints específicos para altura (útil para MacBooks)
      "h-sm": { raw: "(min-height: 600px)" },
      "h-md": { raw: "(min-height: 768px)" },
      "h-lg": { raw: "(min-height: 900px)" },
      "h-xl": { raw: "(min-height: 1080px)" },

      // Breakpoints para orientação
      portrait: { raw: "(orientation: portrait)" },
      landscape: { raw: "(orientation: landscape)" },

      // Breakpoints para densidade de pixels (Retina displays)
      retina: {
        raw: "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        // Cores específicas do projeto Escrivania Digital
        'escrivania': {
          purple: {
            50: 'oklch(0.95 0.05 270)',
            100: 'oklch(0.9 0.1 270)',
            200: 'oklch(0.85 0.15 270)',
            300: 'oklch(0.8 0.18 270)',
            400: 'oklch(0.7 0.2 270)',
            500: 'oklch(0.6 0.2 270)', // Primary purple
            600: 'oklch(0.55 0.22 270)',
            700: 'oklch(0.5 0.24 270)',
            800: 'oklch(0.4 0.26 270)',
            900: 'oklch(0.3 0.28 270)',
          },
          blue: {
            50: 'oklch(0.95 0.05 200)',
            100: 'oklch(0.9 0.08 200)',
            200: 'oklch(0.85 0.12 200)',
            300: 'oklch(0.8 0.15 200)',
            400: 'oklch(0.75 0.15 200)', // Accent blue
            500: 'oklch(0.7 0.18 200)',
            600: 'oklch(0.65 0.2 200)',
            700: 'oklch(0.6 0.22 200)',
            800: 'oklch(0.5 0.24 200)',
            900: 'oklch(0.4 0.26 200)',
          },
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
        mobile: "1rem",
        tablet: "1.5rem",
        notebook: "2rem",
        macbook: "2.5rem",
        desktop: "3rem",
      },
      fontSize: {
        // Tamanhos de fonte responsivos
        "xs-mobile": ["0.75rem", { lineHeight: "1rem" }],
        "sm-mobile": ["0.875rem", { lineHeight: "1.25rem" }],
        "base-mobile": ["1rem", { lineHeight: "1.5rem" }],
        "lg-mobile": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl-mobile": ["1.25rem", { lineHeight: "1.75rem" }],

        "xs-tablet": ["0.875rem", { lineHeight: "1.25rem" }],
        "sm-tablet": ["1rem", { lineHeight: "1.5rem" }],
        "base-tablet": ["1.125rem", { lineHeight: "1.75rem" }],
        "lg-tablet": ["1.25rem", { lineHeight: "1.75rem" }],
        "xl-tablet": ["1.5rem", { lineHeight: "2rem" }],

        "xs-desktop": ["1rem", { lineHeight: "1.5rem" }],
        "sm-desktop": ["1.125rem", { lineHeight: "1.75rem" }],
        "base-desktop": ["1.25rem", { lineHeight: "1.75rem" }],
        "lg-desktop": ["1.5rem", { lineHeight: "2rem" }],
        "xl-desktop": ["1.875rem", { lineHeight: "2.25rem" }],
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
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "gradient": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
        "float": "float 3s ease-in-out infinite",
        "gradient": "gradient 3s ease infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

module.exports = config;
