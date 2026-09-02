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

  // Atualiza o orçamento na tela e no servidor. Se a API falhar, desfaz a
  // mudança local — senão o orçamento mostrado ficaria errado (fora de
  // sincronia com o que está de fato salvo no Firestore).
  async function setBudget(value) {
    const previous = budget
    setBudgetState(value)
    try {
      await api.put('/api/profile', { budget: value })
    } catch (err) {
      setBudgetState(previous)
      console.error('Falha ao salvar orçamento:', err)
      throw err
    }
  }

  // Atualiza o tema na tela, no cache local (pro próximo carregamento já
  // abrir com a cor certa) e no servidor. Mesma lógica de rollback do
  // orçamento caso a API falhe.
  async function setTheme(value) {
    const previous = theme
    setThemeState(value)
    localStorage.setItem(THEME_CACHE_KEY, value)
    try {
      await api.put('/api/profile', { theme: value })
    } catch (err) {
      setThemeState(previous)
      localStorage.setItem(THEME_CACHE_KEY, previous)
      console.error('Falha ao salvar tema:', err)
      throw err
    }
  }

  return { budget, setBudget, theme, setTheme }
}
