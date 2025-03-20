/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const darkMode = "class";
export const theme = {
  extend: {
    typography: {
      DEFAULT: {
        css: {
          maxWidth: "none",
          code: {
            backgroundColor: "#1e293b",
            color: "#f8fafc",
            padding: "4px 6px",
            borderRadius: "6px",
            fontSize: "0.875em",
          },

          "code::before": {
            content: '""',
          },
          "code::after": {
            content: '""',
          },
        },
      },
    },
  },
};
export const plugins = [typography];
