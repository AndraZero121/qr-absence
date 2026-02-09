import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import SmoothScroll from './components/ui/SmoothScroll'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Konfigurasi "Sat Set"
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // Data dianggap fresh selama 1 menit (tidak refetch)
      cacheTime: 1000 * 60 * 5, // Data disimpan di memori selama 5 menit
      refetchOnWindowFocus: false, // Jangan refetch saat pindah tab (hemat bandwidth)
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SmoothScroll>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SmoothScroll>
    </QueryClientProvider>
  </React.StrictMode>,
)