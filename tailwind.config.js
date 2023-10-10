/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            // => @media (min-width: 320px) { ... }
            'sm': '320px',
            'md': '768px',
            'lg': '1024px',
            'lg1': '1152px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                g: "#929292",
                g2: "#5B5B5B",

                "gl-1": "#27FFC0",


                'rl-1': "#FF0000"
            },
            backgroundColor: {
                g5: "#303030",

                b1: "#0F0F0F",
                b2: "#1B1B1B"
            },
            borderColor: {
                w1: "rgba(255, 255, 255, 0.1)",
                w5: "rgba(255, 255, 255, 0.5)"
            },
            minWidth: {
                500: "500px"
            },
            fontSize: {
                mm: "0.6rem"
            }
        }
    },
    plugins: [],
}
