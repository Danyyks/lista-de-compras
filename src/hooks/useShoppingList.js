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

  // Remove otimisticamente (some da tela na hora), mas se a API falhar
  // (rede caiu, token expirou etc.) o item volta à lista — sem isso, uma
  // falha silenciosa faria o item "sumir" no navegador mesmo continuando
  // salvo no Firestore.
  async function removeItem(id) {
    const removed = items.find(item => item.id === id)
    setItems(prev => prev.filter(item => item.id !== id))
    try {
      await api.del(`/api/items/${id}`)
    } catch (err) {
      if (removed) setItems(prev => [...prev, removed])
      console.error('Falha ao remover item:', err)
      throw err
    }
  }

  async function toggleItem(id) {
    const current = items.find(item => item.id === id)
    if (!current) return
    try {
      const updated = await api.put(`/api/items/${id}`, { bought: !current.bought })
      setItems(prev => prev.map(item => (item.id === id ? updated : item)))
    } catch (err) {
      console.error('Falha ao marcar/desmarcar item:', err)
      throw err
    }
  }

  async function editItem(id, changes) {
    try {
      const updated = await api.put(`/api/items/${id}`, changes)
      setItems(prev => prev.map(item => (item.id === id ? updated : item)))
    } catch (err) {
      console.error('Falha ao editar item:', err)
      throw err
    }
  }

  // Mesma lógica de "otimista com rollback" das outras ações: guarda a
  // lista anterior para poder restaurar se a chamada ao backend falhar.
  async function clearBought() {
    const previous = items
    setItems(prev => prev.filter(item => !item.bought))
    try {
      await api.post('/api/items/clear-bought')
    } catch (err) {
      setItems(previous)
      console.error('Falha ao limpar itens comprados:', err)
      throw err
    }
  }

  async function clearAll() {
    const previous = items
    setItems([])
    try {
      await api.post('/api/items/clear-all')
    } catch (err) {
      setItems(previous)
      console.error('Falha ao apagar a lista:', err)
      throw err
    }
  }

  return { items, addItem, removeItem, toggleItem, editItem, clearBought, clearAll }
}
