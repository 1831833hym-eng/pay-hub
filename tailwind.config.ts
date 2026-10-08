import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef3ff",
          100: "#dce6ff",
          200: "#c0d0ff",
          300: "#94b0ff",
          400: "#6688ff",
          500: "#4b6bfb",
          600: "#3b52f0",
          700: "#2f40d6",
          800: "#2a37ad",
          900: "#283488",
        },
        violet: {
          soft: "#7b6cf5",
          mid: "#6a5ae8",
        },
        ink: {
          1: "#1f2937",
          2: "#4b5563",
          3: "#6b7280",
          4: "#9ca3af",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f5f6f8",
          soft: "#f8f9fb",
        },
      },
      boxShadow: {
        card: "0 8px 30px rgba(47, 64, 150, 0.12)",
        nav: "0 1px 0 rgba(15, 23, 42, 0.04)",
        soft: "0 4px 16px rgba(47, 64, 150, 0.08)",
      },
      borderRadius: {
        xl2: "1rem",
        xl3: "1.25rem",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #4b6bfb 0%, #5f6ef5 35%, #7b6cf5 70%, #8a74f7 100%)",
        "page-gradient":
          "linear-gradient(160deg, #4b6bfb 0%, #5a68f4 28%, #6f66f2 55%, #8570f6 100%)",
      },
      fontFamily: {
        sans: [
          '"Noto Sans SC"',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          "system-ui",
          "sans-serif",
        ],
        display: [
          '"Plus Jakarta Sans"',
          '"Noto Sans SC"',
          '"PingFang SC"',
          "system-ui",
          "sans-serif",
        ],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out both",
        "fade-in": "fade-in 0.35s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
