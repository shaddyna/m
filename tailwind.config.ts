import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        'material': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'gradient': 'background-image'
      },
      colors: { 
        background: "var(--background)",
        foreground: "var(--foreground)",
        "raisin-black": "#24252A",
        "cinnamon-satin": "#C9615F",
        'raisin-black-a6': 'hsla(216, 14%, 14%, 0.06)',
        'snow': '#f7eef0',
        'charcoal': '#2A3447',   
        'prussian-blue': '#1A365D',
        'carolina-blue': '#0EA5E9',
        'gradient-1': 'linear-gradient(90deg, #d20ac3, #efa110)',
        'oxford-blue-2': '#0F172A',
        'oxford-blue': '#0F172A',
        'jet': '#2E2E2E',
        'onyx': '#2D2D34',
        'eerie-black-2': '#1A1A1A',
        'white-2': '#F8F8F8',
        'light-gray': '#D1D1D1',
        'light-gray-70': 'rgba(209, 209, 209, 0.7)',
        'gradient-onyx': 'linear-gradient(180deg, #2D2D34 0%, #1A1A1A 100%)',
        'marigold': '#FF9900', // Replace with actual color code
        'eerie-black': '#1A1A1A', // Replace with actual color code
        'cultured-2': '#f7f5f9', // Replace with exact color value
        'pumpkin': '#ff6d00', 
        primary: '#1e3a8a', // blue-900
        accent: '#d20ac3',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem'
      },
      boxShadow: {
        '3xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'soft': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      },
      backgroundImage: {
        'gradient-tags': 'linear-gradient(to bottom right, #0EA5E9, #00C6C3)',
        'gradient-1': 'linear-gradient(90deg, #0ea5ea, #0bd1d1)',
        'gradient-onyx': 'linear-gradient(180deg, #2D2D34 0%, #1A1A1A 100%)',
        'brand-gradient': 'linear-gradient(to right, #1a365d, #d20ac3)',
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
