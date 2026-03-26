import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Aplica o tema salvo antes de renderizar para evitar flash
const savedTheme = localStorage.getItem('shopping-list-dark-mode')
if (savedTheme === 'false') {
  document.documentElement.setAttribute('data-theme', 'light')
} else {
  document.documentElement.setAttribute('data-theme', 'dark')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
