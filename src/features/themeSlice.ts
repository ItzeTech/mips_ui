import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadState, saveState } from '../utils/localStorage';

type Theme = 'light' | 'dark';

interface ThemeState {
  currentTheme: Theme;
}

const THEME_KEY = 'themePreference';
const persistedTheme = loadState<Theme>(THEME_KEY);

const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;

const initialTheme: Theme = persistedTheme || (prefersDark ? 'dark' : 'light');

const initialState: ThemeState = {
  currentTheme: initialTheme,
};

// ✅ Ensure HTML gets correct theme class on load
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.currentTheme = action.payload;
      saveState(THEME_KEY, action.payload);

      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleTheme(state) {
      const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      state.currentTheme = newTheme;
      saveState(THEME_KEY, newTheme);

      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
