import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setTheme as setThemeAction } from '../features/themeSlice'; // Ensure this matches your action name

export const useTheme = () => {
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    dispatch(setThemeAction(newTheme)); // Use the imported action
  };

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch(setThemeAction(theme)); // Use the imported action
  };

  return { currentTheme, toggleTheme, setTheme };
};

// A hook to apply theme class to <html> on mount and theme change
export const useThemeEffect = () => {
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('themePreference', currentTheme); // Also persist here for safety
  }, [currentTheme]);
};
