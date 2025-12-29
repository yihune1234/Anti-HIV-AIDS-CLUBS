import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('app-theme-preference');
        return savedTheme ? JSON.parse(savedTheme) : {
            primaryColor: '#D32F2F',
            sidebarTheme: 'dark', // 'light' or 'dark'
            headerStyle: 'gradient', // 'solid' or 'gradient'
            accentColor: '#D32F2F'
        };
    });

    useEffect(() => {
        localStorage.setItem('app-theme-preference', JSON.stringify(theme));
        
        // Update CSS Variables
        document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
        document.documentElement.style.setProperty('--accent-color', theme.accentColor);
    }, [theme]);

    const updateTheme = (newSettings) => {
        setTheme(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
