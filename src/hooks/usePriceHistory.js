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
    setHistory(prev => ({ ...prev, [key]: price }))
    await api.post('/api/price-history', { name, price })
  }

  function getLastPrice(name) {
    if (!name) return null
    const key = normalizeKey(name)
    return history[key] ?? null
  }

  async function clearHistory() {
    setHistory({})
    await api.del('/api/price-history')
  }

  return { recordPrice, getLastPrice, clearHistory }
}
