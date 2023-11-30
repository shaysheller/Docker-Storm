import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme.jsx';

createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider theme={theme}>
    <CssBaseline>
      <App />
    </CssBaseline>
  </ThemeProvider>
);
