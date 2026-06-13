import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/theme";
import { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#070709",
        foreground: "var(--foreground)",
        gray: "#2B2B2B",
        gray1: "#7D7D7D",
        red500: "#EF4444",
        gray900: "#111827"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      height: {
        navbar: "var(--navbar-height)"
      },
      padding: {
        main: "var(--main-padding)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        spaceGrotesk: ["var(--font-space-grotesk)"]
      },
      backgroundImage: {
        "gradient-73": "linear-gradient(-73deg, var(--tw-gradient-stops))",
        "button-dark-gradient": "linear-gradient(-12deg, #131414, #070709)"
      },
      boxShadow: {
        "inner-swap": "inset 0 -2px 8px 0 rgba(255, 255, 255, 0.8)" // example
      }
    }
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#fff"
            }
          }
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#fff"
            }
          }
        }
      }
    }),
    function({ addUtilities }: PluginAPI) {
      const newUtilities = {
        ".text-regular12": {
          fontSize: "0.75rem",
          fontWeight: "400"
        },
        ".text-regular14": {
          fontSize: "0.875rem",
          fontWeight: "400"
        },
        ".text-semibold14": {
          fontSize: "0.875rem",
          fontWeight: "600"
        },
      };
      addUtilities(newUtilities, { respectPrefix: true, respectImportant: true });
    }
  ]
};
export default config;
