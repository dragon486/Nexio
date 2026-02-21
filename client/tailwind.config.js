/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#FFFFFF',
                'primary-bright': '#F8F8F8',
                'background': '#050505', // Deep black
                'surface': '#0A0A0A',
                'surface-soft': '#121212',
                'surface-border': '#1F1F1F',
                'surface-highlight': '#2A2A2A',
                'muted': '#666666',
                'accent': '#FFFFFF',
                'brand-purple': '#8B5CF6',
                'brand-blue': '#3B82F6',
                'brand-pink': '#EC4899',
            },
            fontFamily: {
                sans: ['Inter', 'Outfit', 'sans-serif'],
            },
            boxShadow: {
                'glow': '0 0 50px -10px rgba(255, 255, 255, 0.1)',
                'glow-purple': '0 0 50px -10px rgba(139, 92, 246, 0.3)',
                'glow-blue': '0 0 50px -10px rgba(59, 130, 246, 0.3)',
                'backlight': '0 -20px 100px -20px rgba(255, 255, 255, 0.08)',
                'card': '0 25px 80px -20px rgba(0, 0, 0, 0.9)',
                'inner-white': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
                'inner-border': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
            },
            backgroundImage: {
                'grid-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.015)' stroke-dasharray='4 4'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E\")",
            }
        },
    },
    darkMode: 'class',
    plugins: [],
}
