export const COLORS = {
    deepOlive: "#2D6A4F",
    forest: "#40916C",
    green: "#52B788",
    lime: "#74C69D",
    lightLime: "#95D5B2",
    paleGreen: "#B7E4C7",
    cream: "#F8F9FA",
    warmWhite: "#FFFFFF",
    earth: "#6B705C",
    darkEarth: "#403D39",
    warmGray: "#979DAC",
    lightGray: "#E9ECEF",
    red: "#C94C4C",
    amber: "#F4A261",
    blue: "#457B9D",
    white: "#FFFFFF",
    black: "#000000",
    darkBg: "#121212",
    darkSurface: "#1E1E1E",
    darkText: "#E0E0E0",
};

export const GET_THEME = (isDark) => ({
    background: isDark ? COLORS.darkBg : COLORS.warmWhite,
    surface: isDark ? COLORS.darkSurface : COLORS.white,
    text: isDark ? COLORS.darkText : COLORS.darkEarth,
    subText: isDark ? COLORS.warmGray : COLORS.earth,
    border: isDark ? "#333333" : COLORS.lightGray,
    card: isDark ? "#252525" : COLORS.cream,
    primary: COLORS.forest,
    secondary: COLORS.green,
    error: COLORS.red,
    nav: isDark ? "#1A1A1A" : COLORS.white,
});

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
};

export const TYPOGRAPHY = {
    weights: {
        regular: "400",
        semiBold: "600",
        bold: "700",
        extraBold: "800",
        black: "900",
    },
};
