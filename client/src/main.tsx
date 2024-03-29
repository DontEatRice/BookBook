import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './components/auth/AuthProvider';
import AlertProvider from './components/alert/AlertProvider';
import AlertBar from './components/alert/AlertBar';
import ScrollToTop from './components/utils/ScrollToTop.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
//https://tanstack.com/query/v3/docs/react/quick-start
// TODO paleta kolorów https://mui.com/material-ui/customization/palette/

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AlertProvider>
            <AlertBar />
            <ScrollToTop />
            <AuthProvider>
              <App />
            </AuthProvider>
          </AlertProvider>
        </LocalizationProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
