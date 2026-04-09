import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Aplica o tema salvo antes de renderizar para evitar flash
const savedTheme = localStorage.getItem('shopping-list-dark-mode')
if (savedTheme === 'false') {
  document.documentElement.setAttribute('data-theme', 'light')
} else if (savedTheme === 'true') {
  document.documentElement.setAttribute('data-theme', 'dark')
} else {
  // modo automático: dark das 18h às 6h
  const hour = new Date().getHours()
  const isNight = hour >= 18 || hour < 6
  document.documentElement.setAttribute('data-theme', isNight ? 'dark' : 'light')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
