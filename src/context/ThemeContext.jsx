import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const DEFAULT_THEME = 'orange';

export function ThemeProvider({ children }) {
  // Padrão oficial definido pelo cliente: Modo Laranja (Identidade Solar)
  const [theme, setTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
    localStorage.setItem('usesol_theme', DEFAULT_THEME);
  }, []);

  const toggleTheme = () => {
    // Mantém esquema laranja como fixo por definição do cliente
    setTheme(DEFAULT_THEME);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isOrange: true }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
