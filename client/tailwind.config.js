/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f0f12",
                surface: "#18181b",
                primary: "#6366f1", // Indigo
                secondary: "#ec4899", // Pink
                accent: "#8b5cf6", // Violet
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    darkMode: 'class',
    plugins: [],
}
