import { useEffect, useState } from 'react'
import { api } from '../services/api'

// Gerencia a lista de compras chamando a API Flask (que guarda tudo no
// Firestore). A interface exposta (items, addItem, removeItem, ...) é a
// mesma de antes, quando tudo vivia no localStorage — só troca "onde"
// os dados moram por baixo dos panos.
export function useShoppingList(user) {
  const [items, setItems] = useState([])

  // Busca os itens do usuário assim que ele faz login (ou esvazia a lista
  // no logout). As duas situações passam pelo mesmo ".then(setItems)".
  useEffect(() => {
    const load = user ? api.get('/api/items') : Promise.resolve([])
    load.then(setItems)
  }, [user])

  async function addItem({ name, category = 'outros', price = 0, quantity = 1 }) {
    const newItem = await api.post('/api/items', { name, category, price, quantity })
    setItems(prev => [...prev, newItem])
    return newItem
  }

  async function removeItem(id) {
    setItems(prev => prev.filter(item => item.id !== id))
    await api.del(`/api/items/${id}`)
  }

  async function toggleItem(id) {
    const current = items.find(item => item.id === id)
    if (!current) return
    const updated = await api.put(`/api/items/${id}`, { bought: !current.bought })
    setItems(prev => prev.map(item => (item.id === id ? updated : item)))
  }

  async function editItem(id, changes) {
    const updated = await api.put(`/api/items/${id}`, changes)
    setItems(prev => prev.map(item => (item.id === id ? updated : item)))
  }

  async function clearBought() {
    setItems(prev => prev.filter(item => !item.bought))
    await api.post('/api/items/clear-bought')
  }

  async function clearAll() {
    setItems([])
    await api.post('/api/items/clear-all')
  }

  return { items, addItem, removeItem, toggleItem, editItem, clearBought, clearAll }
}
