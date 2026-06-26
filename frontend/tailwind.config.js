export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: {
                    50: "#ffffff",
                    100: "#fafafa",
                    200: "#f5f5f5",
                    300: "#e5e7eb",
                    400: "#cbd5e1",
                    500: "#94a3b8",
                    600: "#64748b",
                    700: "#475569",
                    800: "#334155",
                    900: "#111111"
                },
                brand: {
                    500: "#2563eb",
                    600: "#1d4ed8",
                    700: "#1e40af"
                }
            },
            fontFamily: {
                heading: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
                body: ["Manrope", "system-ui", "sans-serif"]
            },
            boxShadow: {
                soft: "0 1px 2px rgba(15,23,42,0.05), 0 6px 14px rgba(15,23,42,0.06)"
            }
        }
    },
    plugins: [],
};
