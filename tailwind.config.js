/** @type {import('tailwindcss').Config} */
module.exports = {
    // 'class' strategy: dark mode se activa añadiendo la clase 'dark' al <html>
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                /** Ondas glass del mic (escenarios) */
                micGlassWave: {
                    '0%': { transform: 'scale(0.75)', opacity: '0.7' },
                    '60%': { opacity: '0.2' },
                    '100%': { transform: 'scale(2.0)', opacity: '0' },
                },
                micGlassWave2: {
                    '0%': { transform: 'scale(0.6)', opacity: '0.5' },
                    '60%': { opacity: '0.15' },
                    '100%': { transform: 'scale(1.8)', opacity: '0' },
                },
                micGlassWave3: {
                    '0%': { transform: 'scale(0.85)', opacity: '0.4' },
                    '100%': { transform: 'scale(1.6)', opacity: '0' },
                },
                seaWave1: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '50%': { transform: 'translateX(10%)' },
                },
                seaWave2: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '50%': { transform: 'translateX(-12%)' },
                },
                micPulseRing: {
                    '0%': { transform: 'scale(0.9)', opacity: '0.65' },
                    '70%': { transform: 'scale(1.25)', opacity: '0' },
                    '100%': { transform: 'scale(1.25)', opacity: '0' },
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'mic-glass-1': 'micGlassWave 2.5s ease-out infinite',
                'mic-glass-2': 'micGlassWave2 2.5s ease-out 0.4s infinite',
                'mic-glass-3': 'micGlassWave3 2.5s ease-out 0.8s infinite',
                'mic-pulse': 'micPulseRing 1.6s ease-out infinite',
                'mic-pulse-delay': 'micPulseRing 1.6s ease-out 0.45s infinite',
                'sea-wave-1': 'seaWave1 2.8s ease-in-out infinite',
                'sea-wave-2': 'seaWave2 3.5s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
