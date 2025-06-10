import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useThemeEffect } from './hooks/useTheme'; // Import the hook

function App() {
  useThemeEffect(); // Apply theme on mount and when it changes in store

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
