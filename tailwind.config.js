/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0B1C2D',
                    light: '#1a2f45',
                    dark: '#050e17',
                },
                secondary: {
                    DEFAULT: '#2563EB',
                    light: '#3b82f6',
                    dark: '#1d4ed8',
                },
                accent: {
                    DEFAULT: '#10B981',
                    light: '#34d399',
                    dark: '#059669',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    light: '#fbbf24',
                    dark: '#d97706',
                },
                error: {
                    DEFAULT: '#EF4444',
                    light: '#f87171',
                    dark: '#dc2626',
                },
                background: {
                    DEFAULT: '#F8FAFC',
                    white: '#FFFFFF',
                    gray: '#F3F4F6',
                },
                text: {
                    primary: '#111827',
                    secondary: '#6B7280',
                    muted: '#9CA3AF',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
