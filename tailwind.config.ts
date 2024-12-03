import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                background: '#f8fafc', // Blanco azulado muy suave
                foreground: '#334155', // Gris oscuro para el texto
                card: {
                    DEFAULT: '#ffffff', // Blanco para tarjetas
                    foreground: '#1e293b' // Gris muy oscuro para texto en tarjetas
                },
                popover: {
                    DEFAULT: '#f1f5f9', // Gris muy claro
                    foreground: '#0f172a' // Azul oscuro
                },
                primary: {
                    DEFAULT: '#4f46e5', // Azul intenso
                    foreground: '#ffffff' // Blanco
                },
                secondary: {
                    DEFAULT: '#22d3ee', // Cian suave
                    foreground: '#0f172a' // Azul oscuro
                },
                muted: {
                    DEFAULT: '#e2e8f0', // Gris claro
                    foreground: '#475569' // Gris mediano
                },
                accent: {
                    DEFAULT: '#34d399', // Verde menta suave
                    foreground: '#0f172a' // Azul oscuro
                },
                destructive: {
                    DEFAULT: '#ef4444', // Rojo pastel
                    foreground: '#ffffff' // Blanco
                },
                border: '#cbd5e1', // Gris claro para bordes
                input: '#e2e8f0', // Fondo claro para inputs
                ring: '#60a5fa', // Azul suave para focus rings
                chart: {
                    '1': '#34d399', // Verde pastel
                    '2': '#f87171', // Rojo pastel
                    '3': '#60a5fa', // Azul pastel
                    '4': '#a78bfa', // Morado pastel
                    '5': '#93c5fd' // Azul claro pastel
                },
                sidebar: {
                    DEFAULT: '#f3f4f6', // Gris claro para el fondo de la barra lateral
                    foreground: '#1e293b', // Texto oscuro en la barra lateral
                    primary: '#3b82f6', // Azul vibrante para resaltar
                    'primary-foreground': '#ffffff', // Blanco para el texto resaltado
                    accent: '#34d399', // Verde menta
                    'accent-foreground': '#ffffff', // Blanco para el texto de acentos
                    border: '#cbd5e1', // Gris claro para bordes
                    ring: '#a5b4fc', // Azul suave para focus
                    blue: {
                        100: '#dbeafe', // Azul más claro
                        200: '#bfdbfe', // Azul claro
                        300: '#93c5fd', // Azul moderado
                        400: '#60a5fa', // Azul intenso
                        500: '#3b82f6', // Azul principal
                        600: '#2563eb', // Azul más oscuro
                        700: '#1d4ed8', // Azul más profundo
                        800: '#1e40af', // Azul muy oscuro
                        900: '#1e3a8a', // Azul profundo
                    }
                }
                
            },
            borderRadius: {
                lg: '12px',
                md: '8px',
                sm: '4px'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
