/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",

        // Or if using `src` directory:
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
        colors: {
            g: "#929292",
            g2: "#5B5B5B",

            "gl-1": "#27FFC0",


            'rl-1': "#FF0000"
        },
        backgroundColor: {
            g5: "#303030",

            b1: "#0F0F0F"
        },
        borderColor: {
            w1: "rgba(255, 255, 255, 0.1)"
        }
    },
    plugins: [],
}
