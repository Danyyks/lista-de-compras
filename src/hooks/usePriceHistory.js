import { useEffect, useState } from 'react'
import { api } from '../services/api'

// Normaliza o nome para usar como chave (minúsculas, sem espaços extras)
function normalizeKey(name) {
  return name.trim().toLowerCase()
}

// Guarda o último preço pago por nome de item, consultando a API Flask.
//
// getLastPrice precisa continuar SÍNCRONO (é chamado a cada tecla digitada
// no formulário de novo item) — por isso buscamos o histórico inteiro uma
// única vez, ao logar, e guardamos num cache local em memória.
export function usePriceHistory(user) {
  const [history, setHistory] = useState({})

  useEffect(() => {
    const load = user ? api.get('/api/price-history') : Promise.resolve({})
    load.then(setHistory)
  }, [user])

  async function recordPrice(name, price) {
    if (!name || price <= 0) return
    const key = normalizeKey(name)
    const previous = history[key]
    setHistory(prev => ({ ...prev, [key]: price }))
    try {
      await api.post('/api/price-history', { name, price })
    } catch (err) {
      setHistory(prev => ({ ...prev, [key]: previous }))
      console.error('Falha ao registrar histórico de preço:', err)
      throw err
    }
  }

  function getLastPrice(name) {
    if (!name) return null
    const key = normalizeKey(name)
    return history[key] ?? null
  }

  async function clearHistory() {
    const previous = history
    setHistory({})
    try {
      await api.del('/api/price-history')
    } catch (err) {
      setHistory(previous)
      console.error('Falha ao limpar histórico de preços:', err)
      throw err
    }
  }

  return { recordPrice, getLastPrice, clearHistory }
}
