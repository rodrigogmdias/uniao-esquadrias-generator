export default {
    content: [
        "./index.html",
        "./index.tsx",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gray: {
                    50: '#f9fafb',
                },
            },
        },
    },
    plugins: [],
};
