/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./themes/hmzc/layouts/**/*.html", "./content/**/*.md"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
