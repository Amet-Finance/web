/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            'xs': '475px',       // Extra small devices, like small phones
            'sm': '640px',       // Small devices, like phones - Tailwind's default
            'md': '768px',       // Medium devices, like tablets - Tailwind's default
            'md-lg': '960px',    // Between md and lg - for devices like smaller laptops or tablets in landscape
            'lg': '1024px',      // Large devices, like laptops - Tailwind's default
            'lg-xl': '1152px',   // Between lg and xl - for medium-sized laptop screens
            'xl': '1280px',      // Extra large devices, like large laptops - Tailwind's default
            'xl-2xl': '1440px',  // Between xl and 2xl - for larger laptop screens or smaller desktops
            '2xl': '1536px',     // 2x large devices, like larger laptops and desktops - Tailwind's default
            '3xl': '1920px',     // 3x large devices, like large desktops
        },
        extend: {
            backgroundColor: {
                b2: "#1B1B1B",
                b3: "#090909",
                b4: "#111111",
                b5: "#0E0E0E",
                b6: "#202020",
                bt1: "rgba(0, 0, 0, 0.1)",
                bt5: "rgba(0, 0, 0, 0.5)",
                bt8: "rgba(0, 0, 0, 0.8)",
                "bt9-5": "rgba(0, 0, 0, 0.95)"
            },
            borderColor: {
                w1: "rgba(255, 255, 255, 0.1)",
                w2: "rgba(255, 255, 255, 0.2)",
                w3: "rgba(255, 255, 255, 0.3)",
                w4: "rgba(255, 255, 255, 0.4)",
                w5: "rgba(255, 255, 255, 0.5)",
                w6: "#282828"
            },
            fontSize: {
                mm: "0.6rem"
            },
        }
    },
    plugins: [],
}
