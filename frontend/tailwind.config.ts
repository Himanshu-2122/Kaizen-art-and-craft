import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        "xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Open Sans", "Lato", "mr-eaves-xl-modern", "Inter", "sans-serif"],
        display: ["Open Sans", "Lato", "mr-eaves-xl-modern", "Playfair Display", "serif"],
        heading: ["Open Sans", "Lato", "sans-serif"],
        mreaves: ["mr-eaves-xl-modern", "sans-serif"],
      },
      boxShadow: {
        xs: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
        sm: "0 2px 8px rgba(0, 0, 0, 0.08)",
        md: "0 4px 16px rgba(0, 0, 0, 0.1)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.12)",
        mega: "0 10px 30px rgba(0, 0, 0, 0.12)",
      },
      colors: {
        // Kaizen Livings Exact Tokens
        "ul-orange": "#DF6B3B",
        "ul-orange-hover": "#C85A2E",
        "ul-orange-active": "#A8441F",
        "ul-orange-light": "#FBE4DA",
        "ul-charcoal": "#323232",
        "ul-gray": "#666666",
        "ul-gray-light": "#999999",
        "ul-border": "#E0E0E0",
        "ul-section": "#F5F5F5",
        "ul-warm": "#F8F1EB",
        "ul-sale": "#0FB67E",
        "ws-brown": "#5a3825",
        "fe-orange": "#DF6B3B",
        "fe-orange-hover": "#C85A2E",
        "fe-orange-active": "#A8441F",
        "fe-orange-light": "#FBE4DA",
        "fe-dark": "#323232",
        "fe-warm": "#F8F1EB",
        "fe-neutral": "#F5F5F5",
        "fe-gray-muted": "#666666",
        "fe-gray-light": "#E0E0E0",
        "fe-success": "#0FB67E",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "#C85A2E",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
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
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        wood: "hsl(var(--wood))",
        "warm-gray": "hsl(var(--warm-gray))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 1px)",
        sm: "calc(var(--radius) - 2px)",
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
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
