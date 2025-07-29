/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.html",
    "./views/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx,html,vue,svelte}",
  ],
  safelist: [
    "grid-cols-2",
    "w-[40rem]",
    "shadow-2xl",
    "w-full",
    "h-48",
    "w-48",
    "hover:scale-110",
    "text-lg",
    "!h-40",
    "w-40",
    "sm:h-44",
    "sm:w-44",
    "pl-3",
    "pt-1",
    "mb-3",
    "border-black",
    "border-[1px]",
    "rounded-full",
    "grid-cols-5",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: {
            600: "var(--morado)",
            500: "var(--morado-claro)",
          },
          orange: {
            600: "var(--naranja)",
          },
          green: {
            600: "var(--verde)",
          },
          gray: {
            500: "var(--gris)",
          },
        },
        secondary: {
          gray: "var(--gris-claro)",
        },
      },
    },
  },
  plugins: [],
};
