/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./components/**/**/*.{js,ts,jsx,tsx}", 
    "./data/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css"    // ✅ FIXED
  ],

  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fff8f0",
          100: "#f7efe0",
          500: "#d4af37",
          700: "#b8861d",
        }
      },

      backgroundImage: {
        "gold-shimmer":
          "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.15) 45%, rgba(212,175,55,0) 100%)",
      },

      animation: {
        fadeSmooth: "fadeSmooth .6s ease-out",
        goldFloat: "goldFloat 18s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        scaleIn: "scaleIn .22s ease-out",
        fadeIn: "fadeIn .22s ease-out",
        logoShimmer: "logoShimmer 1.1s ease forwards",
      },

      keyframes: {
        fadeSmooth: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        goldFloat: {
          "0%": { transform: "translateY(0) scale(.998)", opacity: ".98" },
          "50%": { transform: "translateY(-6px) scale(1.01)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(.998)", opacity: ".98" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        logoShimmer: {
          "0%": { left: "-120%", opacity: "0" },
          "10%": { opacity: ".95" },
          "50%": { left: "20%", opacity: "1" },
          "100%": { left: "120%", opacity: "0" },
        },
      },

      boxShadow: {
        gold: "0 10px 28px rgba(212,175,55,0.18)",
        luxurious: "0 30px 80px rgba(10,8,6,0.12)",
      },
    },
  },

  plugins: [],
};
