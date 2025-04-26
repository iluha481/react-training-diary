import React, { useEffect, createContext, useState } from "react";


export const lightTheme = {
    token: { colorPrimary: '#1890ff', colorBgBase: '#ffffff', colorTextBase: '#000000'},
    components: {
        Calendar: { itemActiveBg: '#e6f7ff' }

        
    },

};

export const darkTheme = {
    token: { colorPrimary: '#177ddc', colorBgBase: '#1f1f1f', colorTextBase: '#ffffff', },
    components: {
        Calendar: { itemActiveBg: '#2b2b2b' }

        
    },
}



// Создаем контекст
export const ThemeContext = createContext();

// Провайдер для темы
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}

        </ThemeContext.Provider>
    );
};