function detectIsDarkMode() {
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

const IS_DARK_MODE = detectIsDarkMode();

export function isDarkMode() {
    return IS_DARK_MODE;
}