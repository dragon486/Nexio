/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#1d1d1f',
                'secondary': '#6e6e73',
                'nexio-blue': '#3b82f6',
                'nexio-gray': '#6e6e73',
                'nexio-light-gray': '#86868b',
                'background': '#f5f5f7',
                'surface': '#ffffff',
                'border': '#e2e8f0',
                'accent': '#3b82f6',
                'foreground': 'var(--text-primary)',
                'muted-foreground': 'var(--text-secondary)',
            },
            fontFamily: {
                sans: ['Work Sans', 'Inter', 'sans-serif'],
                mono: ['IBM Plex Mono', 'monospace'],
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
