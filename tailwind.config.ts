import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      fontFamily: {
        sans: ["Inter", "Geist", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      keyframes: {
        "fade-in-up": { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "dash-flow": { to: { strokeDashoffset: "-24" } },
        "node-pulse": { "0%, 100%": { opacity: "0.4" }, "50%": { opacity: "1" } },
        scanline: { "0%": { transform: "translateY(-100%)", opacity: "0" }, "10%": { opacity: "0.6" }, "90%": { opacity: "0.6" }, "100%": { transform: "translateY(100%)", opacity: "0" } },
        heartbeat: { "0%, 100%": { transform: "scale(1)", opacity: "1" }, "50%": { transform: "scale(1.4)", opacity: "0.65" } },
        "scan-hero": { "0%": { top: "-6rem", opacity: "0" }, "8%": { opacity: "1" }, "92%": { opacity: "1" }, "100%": { top: "100%", opacity: "0" } },
        "typing-caret": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.5s ease-out both",
        "dash-flow": "dash-flow 1.2s linear infinite",
        "node-pulse": "node-pulse 2s ease-in-out infinite",
        scan: "scanline 6s linear infinite",
        "scan-hero": "scan-hero 9s linear infinite",
        heartbeat: "heartbeat 2.4s ease-in-out infinite",
        "typing-caret": "typing-caret 0.8s step-end infinite",
      },
    },
  },
  plugins: [],
};

export default config;
