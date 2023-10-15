import { createContext, useContext } from "react";

export const ThemeContext = createContext({
    theme: 'dark',
    toggleTheme: () => {},
})

export const useTheme = () => {
    return useContext(ThemeContext);
}

export const ThemeProvider = ThemeContext.Provider;