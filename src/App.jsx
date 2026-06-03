import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useShoppingList } from './hooks/useShoppingList'
import { usePriceHistory } from './hooks/usePriceHistory'
import { useUser } from './hooks/useUser'
import { Login } from './pages/Login'
import { ListaCompras } from './pages/ListaCompras'
import { Usuario } from './pages/Usuario'
import { BottomNav } from './components/BottomNav'

// Lê o orçamento salvo no localStorage
function loadBudget() {
  const raw = localStorage.getItem('shopping-list-budget')
  return raw ? parseFloat(raw) : null
}

// Lê o tema salvo: true = escuro, false = claro, null = automático
function loadDarkMode() {
  const raw = localStorage.getItem('shopping-list-dark-mode')
  if (raw === 'true') return true
  if (raw === 'false') return false
  return null
}

function isNightTime() {
  const hour = new Date().getHours()
  return hour >= 18 || hour < 6
}

function getEffectiveDarkMode(darkMode) {
  if (darkMode === null || darkMode === undefined) {
    return isNightTime()
  }
  return darkMode
}

export default function App() {
  const navigate = useNavigate()

  // --- Dados do usuário ---
  const {
    userName, saveName,
    userPhoto, savePhoto, removePhoto,
    hasSeenProfile, markProfileSeen,
    clearUser,
  } = useUser()

  // --- Lista de compras e preços ---
  const { items, addItem, removeItem, toggleItem, editItem, clearBought, clearAll } = useShoppingList()
  const { recordPrice, getLastPrice, clearHistory } = usePriceHistory()

  // --- Configurações ---
  const [budget, setBudget] = useState(loadBudget)
  const [darkMode, setDarkMode] = useState(loadDarkMode)

  // Aplica o tema no HTML e salva no localStorage
  useEffect(() => {
    const effective = getEffectiveDarkMode(darkMode)
    document.documentElement.setAttribute('data-theme', effective ? 'dark' : 'light')
    localStorage.setItem('shopping-list-dark-mode', darkMode === null ? 'auto' : String(darkMode))
  }, [darkMode])

  // Atualiza o tema automaticamente conforme o horário quando está no modo automático
  useEffect(() => {
    if (darkMode !== null && darkMode !== undefined) return
    function applyTimeTheme() {
      document.documentElement.setAttribute('data-theme', isNightTime() ? 'dark' : 'light')
    }
    applyTimeTheme()
    // Verifica a cada minuto se o horário mudou
    const interval = setInterval(applyTimeTheme, 60 * 1000)
    return () => clearInterval(interval)
  }, [darkMode])

  // Salva o orçamento no localStorage
  useEffect(() => {
    if (budget !== null) {
      localStorage.setItem('shopping-list-budget', String(budget))
    } else {
      localStorage.removeItem('shopping-list-budget')
    }
  }, [budget])

  // --- Handlers ---

  function handleEnterApp(name) {
    saveName(name)
    // Primeira vez: vai para o perfil. Depois: vai direto para a lista.
    if (hasSeenProfile) {
      navigate('/lista')
    } else {
      navigate('/usuario')
    }
  }

  function handleSignOut() {
    clearUser()
    navigate('/login')
  }

  function handleAddItem(draft) {
    addItem(draft)
    if (draft.price > 0) recordPrice(draft.name, draft.price)
  }

  function handleEditItem(id, changes) {
    editItem(id, changes)
    if (changes.price !== undefined && changes.price > 0) {
      const item = items.find(i => i.id === id)
      if (item) recordPrice(changes.name ?? item.name, changes.price)
    }
  }

  function handleClearAll() {
    clearAll()
    setBudget(null)
  }

  function handleNavigateToLista() {
    markProfileSeen()
    navigate('/lista')
  }

  const effectiveDarkMode = getEffectiveDarkMode(darkMode)

  // --- Rotas ---
  return (
    <>
      <Routes>
        {/* Página de login — só aparece quando não tem usuário */}
        <Route
          path="/login"
          element={
            userName
              ? <Navigate to="/lista" replace />
              : <Login onEnter={handleEnterApp} />
          }
        />

        {/* Página principal da lista de compras */}
        <Route
          path="/lista"
          element={
            userName
              ? <ListaCompras
                  items={items}
                  onAddItem={handleAddItem}
                  onRemoveItem={removeItem}
                  onToggleItem={toggleItem}
                  onEditItem={handleEditItem}
                  onClearBought={clearBought}
                  onClearAll={handleClearAll}
                  getLastPrice={getLastPrice}
                  budget={budget}
                  onBudgetChange={setBudget}
                  userName={userName}
                />
              : <Navigate to="/login" replace />
          }
        />

        {/* Página do usuário / configurações */}
        <Route
          path="/usuario"
          element={
            userName
              ? <Usuario
                  userName={userName}
                  userPhoto={userPhoto}
                  onSavePhoto={savePhoto}
                  onRemovePhoto={removePhoto}
                  onSignOut={handleSignOut}
                  darkMode={darkMode}
                  onSetTheme={setDarkMode}
                  onClearPriceHistory={clearHistory}
                />
              : <Navigate to="/login" replace />
          }
        />

        {/* Qualquer URL desconhecida redireciona para o lugar certo */}
        <Route
          path="*"
          element={<Navigate to={userName ? '/lista' : '/login'} replace />}
        />
      </Routes>

      {/* Barra de navegação só aparece quando o usuário está logado */}
      {userName && <BottomNav onNavigateToLista={handleNavigateToLista} />}
    </>
  )
}
