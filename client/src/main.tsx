import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';

const queryClient = new QueryClient();
//https://tanstack.com/query/v3/docs/react/quick-start
// TODO paleta kolorów https://mui.com/material-ui/customization/palette/

const theme = createTheme({
  palette: {
    background: {
      default: orange[100],
    },
    primary: {
      main: orange[800],
    },
    secondary: {
      main: orange[200],
      dark: orange[300],
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
