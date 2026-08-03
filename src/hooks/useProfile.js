import { useEffect, useState } from 'react'
import { api } from '../services/api'

// Chave usada só como CACHE local do tema, para aplicar a cor certa
// instantaneamente ao abrir o app (antes mesmo da API responder).
// A fonte da verdade agora é o Firestore, não mais o localStorage.
const THEME_CACHE_KEY = 'shopping-list-dark-mode'

// Hook de perfil: orçamento e tema do usuário logado, vindos de /api/profile.
// "user" é o usuário do Firebase Auth (só busca o perfil quando ele existir).
export function useProfile(user) {
  const [budget, setBudgetState] = useState(null)
  const [theme, setThemeState] = useState('auto')

  // Busca (ou cria, no backend) o perfil assim que o usuário faz login.
  // Sem usuário, "load" já resolve com valores padrão — os dois casos
  // atualizam o estado a partir do mesmo callback .then().
  useEffect(() => {
    const load = user ? api.get('/api/profile') : Promise.resolve({ budget: null, theme: 'auto' })
    load.then((profile) => {
      setBudgetState(profile.budget)
      setThemeState(profile.theme)
      if (user) localStorage.setItem(THEME_CACHE_KEY, profile.theme)
    })
  }, [user])

  // Atualiza o orçamento no servidor e, se der certo, na tela.
  async function setBudget(value) {
    setBudgetState(value)
    await api.put('/api/profile', { budget: value })
  }

  // Atualiza o tema no servidor, na tela e no cache local (para o próximo
  // carregamento da página já abrir com a cor certa, sem esperar a API).
  async function setTheme(value) {
    setThemeState(value)
    localStorage.setItem(THEME_CACHE_KEY, value)
    await api.put('/api/profile', { theme: value })
  }

  return { budget, setBudget, theme, setTheme }
}
