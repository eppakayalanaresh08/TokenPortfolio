module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "darkbackgroundsbg-base": "var(--darkbackgroundsbg-base)",
        "darkbackgroundsbg-base-hover": "var(--darkbackgroundsbg-base-hover)",
        "darkbackgroundsbg-component": "var(--darkbackgroundsbg-component)",
        "darkbordersborder-base": "var(--darkbordersborder-base)",
        "darkforegroundsfg-base": "var(--darkforegroundsfg-base)",
        "darkforegroundsfg-on-inverted": "var(--darkforegroundsfg-on-inverted)",
        "darkforegroundsfg-subtle": "var(--darkforegroundsfg-subtle)",
        "darktagstag-blue-icon": "var(--darktagstag-blue-icon)",
        "darktagstag-green-icon": "var(--darktagstag-green-icon)",
        "darktagstag-green-text": "var(--darktagstag-green-text)",
        "darktagstag-purple-icon": "var(--darktagstag-purple-icon)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        "headers-webs-h2": "var(--headers-webs-h2-font-family)",
        "headers-webs-h4": "var(--headers-webs-h4-font-family)",
        "text-compact-txt-compact-large-plus":
          "var(--text-compact-txt-compact-large-plus-font-family)",
        "text-compact-txt-compact-medium-plus":
          "var(--text-compact-txt-compact-medium-plus-font-family)",
        "text-compact-txt-compact-small":
          "var(--text-compact-txt-compact-small-font-family)",
        "text-compact-txt-compact-small-plus":
          "var(--text-compact-txt-compact-small-plus-font-family)",
        "text-compact-txt-compact-xsmall":
          "var(--text-compact-txt-compact-xsmall-font-family)",
        "text-compact-txt-compact-xsmall-plus":
          "var(--text-compact-txt-compact-xsmall-plus-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: {
        "light-borders-base": "var(--light-borders-base)",
        "light-buttons-neutral": "var(--light-buttons-neutral)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
