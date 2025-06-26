// src/ThemeContext.jsx
import { createContext, createSignal, useContext, onMount, createEffect } from 'solid-js';

const ThemeContext = createContext();

export function ThemeProvider(props) {
  const [theme, setTheme] = createSignal('dark');

  const applyTheme = (t) => {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  };

  const toggleTheme = () => {
    const next = theme() === 'light' ? 'dark' : 'light';
    applyTheme(next);
  };

  onMount(() => {
    const saved = localStorage.getItem('theme');
    const systemPrefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(saved || systemPrefers);
  });

  // in case you ever change `theme` programmatically
  createEffect(() => {
    document.documentElement.setAttribute('data-theme', theme());
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
