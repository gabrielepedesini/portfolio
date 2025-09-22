"use client";

import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

export function ToggleTheme() {
    const { theme, setTheme } = useTheme();
    
    const toggleColorMode = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <button className="toggle-theme-button" onClick={toggleColorMode}>
            {theme === "light" ? <LuMoon /> : <LuSun />}
        </button>
    );
}