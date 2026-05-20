import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:          1000 * 60,      // data is fresh for 1 minute
      gcTime:             1000 * 60 * 5,  // keep in cache for 5 minutes
      retry:              1,              // retry failed requests once
      refetchOnWindowFocus: true,         // refetch when user switches back to tab
    },
  },
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>           {/* ← WRAP App with AuthProvider */}
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0C1428',
              color: '#E8EDF8',
              border: '1px solid rgba(126,255,245,0.12)',
              fontFamily: "'Satoshi', sans-serif",
              fontSize: '14px',
              borderRadius: '10px',
            },
            success: { iconTheme: { primary: '#C8FF57', secondary: '#0C1428' } },
            error:   { iconTheme: { primary: '#FF3CAC', secondary: '#0C1428' } },
          }}
        />
      </AuthProvider>          {/* ← CLOSE AuthProvider */}
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);