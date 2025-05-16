import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from "@heroui/react"
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <AuthProvider>
        <App />
      </AuthProvider>
    </HeroUIProvider>
  </React.StrictMode>,
)
