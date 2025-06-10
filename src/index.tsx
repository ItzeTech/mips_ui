import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Ensure Tailwind is imported
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './config/i18n'; // Initialize i18n
import { loadState } from './utils/localStorage'; // For initial theme
import { injectStore } from './config/axiosInstance'; 
import { Toaster } from 'react-hot-toast';

// Set initial theme from localStorage or system preference
const initialTheme = loadState<string>('themePreference') ||
                     (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

injectStore(store);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading translations...</div>}>
        <App />
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 3000,
              icon: '✅',
            },
            error: {
              duration: 5000,
              icon: '❌',
            },
          }}
        />
      </React.Suspense>
    </Provider>
  </React.StrictMode>
);
