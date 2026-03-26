import { useState, useEffect } from 'react'

const STORAGE_KEY = 'shopping-list-price-history'

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Normaliza o nome para usar como chave (minúsculas, sem espaços extras)
function normalizeKey(name) {
  return name.trim().toLowerCase()
}

export function usePriceHistory() {
  const [history, setHistory] = useState(loadHistory)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  function recordPrice(name, price) {
    if (!name || price <= 0) return
    const key = normalizeKey(name)
    setHistory(prev => ({ ...prev, [key]: price }))
  }

  function getLastPrice(name) {
    if (!name) return null
    const key = normalizeKey(name)
    return history[key] ?? null
  }

  return { recordPrice, getLastPrice }
}
