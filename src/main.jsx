import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './components/Context/SocketContext';
import { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')).render(
  <StrictMode>

    <SocketProvider>
    <App />
    </SocketProvider>
  </StrictMode>,
)
