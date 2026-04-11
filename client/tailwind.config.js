/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': 'var(--color-primary)',
                'secondary': 'var(--color-secondary)',
                'accent': 'var(--accent)',
                'accent-primary': 'var(--accent-primary)',
                'nexio-blue': 'var(--accent-blue)',
                'nexio-gray': 'var(--text-secondary)',
                'nexio-light-gray': 'var(--text-tertiary)',
                'background': 'var(--bg-primary)',
                'surface': 'var(--bg-secondary)',
                'surface-soft': 'var(--bg-primary)',
                'surface-border': 'var(--border)',
                'border': 'var(--border)',
                'foreground': 'var(--text-primary)',
                'muted-foreground': 'var(--text-secondary)',
                'glass-border': 'var(--glass-border)',
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
