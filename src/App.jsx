import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useProfile } from './hooks/useProfile'
import { useShoppingList } from './hooks/useShoppingList'
import { usePriceHistory } from './hooks/usePriceHistory'
import { Login } from './pages/Login'
import { ListaCompras } from './pages/ListaCompras'
import { Usuario } from './pages/Usuario'
import { BottomNav } from './components/BottomNav'

function isNightTime() {
  const hour = new Date().getHours()
  return hour >= 18 || hour < 6
}

// O tema é guardado no backend como texto ("light"/"dark"/"auto"), mas os
// componentes de UI (Usuario.jsx) já usavam booleano/null (true=escuro,
// false=claro, null=automático) — essas duas funções fazem a conversão
// nos dois sentidos, para não precisar mexer nesses componentes.
function themeToDarkMode(theme) {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return null
}

function darkModeToTheme(darkMode) {
  if (darkMode === true) return 'dark'
  if (darkMode === false) return 'light'
  return 'auto'
}

function getEffectiveDarkMode(darkMode) {
  if (darkMode === null || darkMode === undefined) return isNightTime()
  return darkMode
}

export default function App() {
  const navigate = useNavigate()

  // --- Login (Firebase Auth, com Google) ---
  const { user, isLoading: authLoading, signInWithGoogle, signOut } = useAuth()

  // --- Perfil: orçamento e tema, guardados no backend ---
  const { budget, setBudget, theme, setTheme } = useProfile(user)
  const darkMode = themeToDarkMode(theme)

  // --- Lista de compras e histórico de preços, guardados no backend ---
  const { items, addItem, removeItem, toggleItem, editItem, clearBought, clearAll } = useShoppingList(user)
  const { getLastPrice, clearHistory } = usePriceHistory(user)

  // Nome e foto agora vêm prontos da conta Google usada no login.
  const userName = user?.displayName ?? null
  const userPhoto = user?.photoURL ?? null

  // Aplica o tema efetivo no <html> sempre que ele mudar
  useEffect(() => {
    const effective = getEffectiveDarkMode(darkMode)
    document.documentElement.setAttribute('data-theme', effective ? 'dark' : 'light')
  }, [darkMode])

  // No modo automático, reavalia o horário a cada minuto
  useEffect(() => {
    if (darkMode !== null && darkMode !== undefined) return
    function applyTimeTheme() {
      document.documentElement.setAttribute('data-theme', isNightTime() ? 'dark' : 'light')
    }
    applyTimeTheme()
    const interval = setInterval(applyTimeTheme, 60 * 1000)
    return () => clearInterval(interval)
  }, [darkMode])

  // --- Handlers ---

  // Abre o popup de login do Google e, assim que resolver, vai para a lista.
  // Não existe mais fluxo de "primeira vez" — nome e foto já vêm do Google.
  async function handleSignIn() {
    await signInWithGoogle()
    navigate('/lista')
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  // Regra de negócio: apagar a lista inteira também zera o orçamento.
  function handleClearAll() {
    clearAll()
    setBudget(null)
  }

  function handleNavigateToLista() {
    navigate('/lista')
  }

  // Converte o booleano/null que vem de Usuario.jsx de volta pro texto
  // que o backend espera antes de salvar.
  function handleSetTheme(darkModeValue) {
    setTheme(darkModeToTheme(darkModeValue))
  }

  // Enquanto o Firebase ainda não respondeu se já existe uma sessão salva,
  // evita mostrar a tela de login por um instante antes de redirecionar.
  if (authLoading) return null

  // --- Rotas ---
  return (
    <>
      <Routes>
        {/* Página de login — só aparece quando não tem usuário */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/lista" replace />
              : <Login onEnter={handleSignIn} />
          }
        />

        {/* Página principal da lista de compras */}
        <Route
          path="/lista"
          element={
            user
              ? <ListaCompras
                  items={items}
                  onAddItem={addItem}
                  onRemoveItem={removeItem}
                  onToggleItem={toggleItem}
                  onEditItem={editItem}
                  onClearBought={clearBought}
                  onClearAll={handleClearAll}
                  getLastPrice={getLastPrice}
                  budget={budget}
                  onBudgetChange={setBudget}
                  userName={userName}
                  userPhoto={userPhoto}
                />
              : <Navigate to="/login" replace />
          }
        />

        {/* Página do usuário / configurações */}
        <Route
          path="/usuario"
          element={
            user
              ? <Usuario
                  userName={userName}
                  userPhoto={userPhoto}
                  onSignOut={handleSignOut}
                  darkMode={darkMode}
                  onSetTheme={handleSetTheme}
                  onClearPriceHistory={clearHistory}
                />
              : <Navigate to="/login" replace />
          }
        />

        {/* Qualquer URL desconhecida redireciona para o lugar certo */}
        <Route
          path="*"
          element={<Navigate to={user ? '/lista' : '/login'} replace />}
        />
      </Routes>

      {/* Barra de navegação só aparece quando o usuário está logado */}
      {user && <BottomNav onNavigateToLista={handleNavigateToLista} />}
    </>
  )
}
