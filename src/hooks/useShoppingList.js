import { useState, useEffect } from 'react'

const STORAGE_KEY = 'shopping-list-items'

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useShoppingList() {
  const [items, setItems] = useState(loadItems)

  // Persiste no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem({ name, category = 'outros', price = 0, quantity = 1 }) {
    const newItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      price,
      quantity,
      bought: false,
      createdAt: Date.now(),
    }
    setItems(prev => [...prev, newItem])
    return newItem
  }

  function removeItem(id) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  function toggleItem(id) {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    )
  }

  function editItem(id, changes) {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...changes } : item
      )
    )
  }

  function clearBought() {
    setItems(prev => prev.filter(item => !item.bought))
  }

  function clearAll() {
    setItems([])
  }

  return { items, addItem, removeItem, toggleItem, editItem, clearBought, clearAll }
}
