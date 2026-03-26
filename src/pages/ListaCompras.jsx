import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { sortCategoryKeys } from '../utils/categories'
import { Header } from '../components/Header'
import { AddItemForm } from '../components/AddItemForm'
import { CategoryGroup } from '../components/CategoryGroup'
import { BudgetSummary } from '../components/BudgetSummary'
import '../App.css'

export function ListaCompras({
  items,
  onAddItem,
  onRemoveItem,
  onToggleItem,
  onEditItem,
  onClearBought,
  onClearAll,
  getLastPrice,
  budget,
  onBudgetChange,
  userName,
}) {
  const navigate = useNavigate()

  // Agrupa os itens por categoria
  const groupedItems = useMemo(() => {
    const groups = {}
    for (const item of items) {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    }
    return groups
  }, [items])

  const sortedCategoryKeys = useMemo(
    () => sortCategoryKeys(Object.keys(groupedItems)),
    [groupedItems]
  )

  // Calcula os totais
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )
  const totalBought = useMemo(
    () => items.filter(i => i.bought).reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )
  const hasBoughtItems = items.some(i => i.bought)

  return (
    <div className="app">
      <Header
        budget={budget}
        onBudgetChange={onBudgetChange}
        userName={userName}
        onChangeName={() => navigate('/usuario')}
      />

      <div className="appContent">
        <AddItemForm
          onAddItem={onAddItem}
          getLastPrice={getLastPrice}
        />

        {sortedCategoryKeys.map(cat => (
          <CategoryGroup
            key={cat}
            category={cat}
            items={groupedItems[cat]}
            onToggle={onToggleItem}
            onDelete={onRemoveItem}
            onEdit={onEditItem}
          />
        ))}

        {items.length === 0 && (
          <div className="emptyState">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>Sua lista está vazia.<br/>Adicione o primeiro item acima!</p>
          </div>
        )}

        {items.length > 0 && (
          <BudgetSummary
            total={total}
            totalBought={totalBought}
            budget={budget}
            itemCount={items.length}
          />
        )}

        {hasBoughtItems && (
          <button className="clearBoughtBtn" onClick={onClearBought}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Limpar itens comprados
          </button>
        )}

        {items.length > 0 && (
          <button
            className="clearAllBtn"
            onClick={() => {
              if (window.confirm('Apagar toda a lista e zerar o orçamento? Essa ação não pode ser desfeita.')) {
                onClearAll()
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3l18 18M10.5 10.677A2 2 0 008 12.5V17h8v-4.5a2 2 0 00-.677-1.495M12 3a9 9 0 018.662 11.647M3.338 14.647A9.003 9.003 0 0112 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Nova lista
          </button>
        )}
      </div>
    </div>
  )
}
