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
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            top: 80,
            right: 20,
          }}
          toastOptions={{
            duration: 6000,
            style: {
              background: '#fff',
              color: '#363636',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              maxWidth: '400px',
              wordWrap: 'break-word',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
              style: {
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#fff',
                border: 'none',
              },
              duration: 8000,
            },
          }}
        />
      </React.Suspense>
    </Provider>
  </React.StrictMode>
);
