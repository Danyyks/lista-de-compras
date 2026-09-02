import { useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { sortCategoryKeys, CATEGORY_MAP } from '../utils/categories'
import { Header } from '../components/Header'
import { AddItemForm } from '../components/AddItemForm'
import { CategoryGroup } from '../components/CategoryGroup'
import { BudgetSummary } from '../components/BudgetSummary'
import { formatCurrency } from '../utils/formatCurrency'
import '../App.css'

function loadAutoSort() {
  return localStorage.getItem('shopping-list-auto-sort') !== 'false'
}

function loadShoppingMode() {
  return localStorage.getItem('shopping-list-shopping-mode') === 'true'
}

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
  userPhoto,
}) {
  const navigate = useNavigate()
  const [autoSort, setAutoSort] = useState(loadAutoSort)
  const [shoppingMode, setShoppingMode] = useState(loadShoppingMode)
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    localStorage.setItem('shopping-list-auto-sort', String(autoSort))
  }, [autoSort])

  useEffect(() => {
    localStorage.setItem('shopping-list-shopping-mode', String(shoppingMode))
  }, [shoppingMode])

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

  // Lista plana (sem agrupamento), ordenada por createdAt
  const flatItems = useMemo(() => {
    const pending = items.filter(i => !i.bought).sort((a, b) => a.createdAt - b.createdAt)
    const bought = items.filter(i => i.bought).sort((a, b) => a.createdAt - b.createdAt)
    return [...pending, ...bought]
  }, [items])

  // Próximo item a comprar (para o modo de compra)
  const nextItem = useMemo(
    () => items.find(i => !i.bought),
    [items]
  )

  // Totais
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )
  const totalBought = useMemo(
    () => items.filter(i => i.bought).reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )

  const prevTotalBoughtRef = useRef(totalBought)
  useEffect(() => {
    // Dispara uma notificação transitória (com timer de auto-fechamento)
    // no exato momento em que o total comprado cruza o orçamento — é um
    // efeito colateral real (não apenas estado derivado de props), por
    // isso o setState direto aqui é intencional.
    if (budget > 0 && prevTotalBoughtRef.current <= budget && totalBought > budget) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToastMsg(`⚠️ Passou do orçamento em ${formatCurrency(totalBought - budget)}`)
      const t = setTimeout(() => setToastMsg(null), 4000)
      return () => clearTimeout(t)
    }
    prevTotalBoughtRef.current = totalBought
  }, [totalBought, budget])

  const topCategory = useMemo(() => {
    const totals = {}
    for (const item of items.filter(i => i.bought)) {
      totals[item.category] = (totals[item.category] || 0) + item.price * item.quantity
    }
    const sorted = Object.entries(totals).filter(([, v]) => v > 0).sort(([, a], [, b]) => b - a)
    if (!sorted.length) return null
    const [cat, val] = sorted[0]
    const pct = totalBought > 0 ? Math.round((val / totalBought) * 100) : 0
    return pct >= 20 ? { cat, val, pct } : null
  }, [items, totalBought])

  const boughtCount = items.filter(i => i.bought).length
  const hasBoughtItems = boughtCount > 0
  const allDone = items.length > 0 && boughtCount === items.length

  return (
    <div className="app">
      {toastMsg && <div className="budgetToast">{toastMsg}</div>}
      <Header
        budget={budget}
        onBudgetChange={onBudgetChange}
        userName={userName}
        userPhoto={userPhoto}
        onChangeName={() => navigate('/usuario')}
        autoSort={autoSort}
        onToggleAutoSort={() => setAutoSort(prev => !prev)}
        shoppingMode={shoppingMode}
        onToggleShoppingMode={() => setShoppingMode(prev => !prev)}
        boughtCount={boughtCount}
        totalCount={items.length}
      />

      <div className="appContent">

        {/* Modo de Compra: banner de progresso */}
        {shoppingMode && items.length > 0 && (
          <div className={`shoppingModeBanner ${allDone ? 'shoppingModeDone' : ''}`}>
            {allDone ? (
              <p className="shoppingModeLabel">
                🎉 Lista completa, {userName}! Arrasou nas compras!
              </p>
            ) : (
              <>
                <p className="shoppingModeLabel">
                  {boughtCount === 0
                    ? `Vamos lá, ${userName}! Próximo item:`
                    : `${userName}, faltam só ${items.length - boughtCount} ${items.length - boughtCount === 1 ? 'item' : 'itens'}!`
                  }
                </p>
                {nextItem && (
                  <p className="shoppingModeNext">➜ {nextItem.name}</p>
                )}
                <div className="shoppingModeProgressBar">
                  <div
                    className="shoppingModeProgressFill"
                    style={{ width: `${(boughtCount / items.length) * 100}%` }}
                  />
                </div>
                <p className="shoppingModeCount">{boughtCount} de {items.length} comprados</p>
              </>
            )}
          </div>
        )}

        {!shoppingMode && (
          <AddItemForm
            onAddItem={onAddItem}
            getLastPrice={getLastPrice}
            existingNames={items.map(i => i.name.trim().toLowerCase())}
          />
        )}

        {/* Lista agrupada ou plana */}
        {autoSort ? (
          sortedCategoryKeys.map(cat => (
            <CategoryGroup
              key={cat}
              category={cat}
              items={groupedItems[cat]}
              onToggle={onToggleItem}
              onDelete={onRemoveItem}
              onEdit={onEditItem}
              shoppingMode={shoppingMode}
              nextItemId={nextItem?.id}
              getLastPrice={getLastPrice}
            />
          ))
        ) : (
          flatItems.length > 0 && (
            <CategoryGroup
              category="__flat__"
              items={flatItems}
              onToggle={onToggleItem}
              onDelete={onRemoveItem}
              onEdit={onEditItem}
              hideHeader
              shoppingMode={shoppingMode}
              nextItemId={nextItem?.id}
              getLastPrice={getLastPrice}
            />
          )
        )}

        {items.length === 0 && (
          <div className="emptyState">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>
              {userName
                ? `${userName}, sua lista está vazia.\nAdicione o primeiro item acima!`
                : 'Sua lista está vazia.\nAdicione o primeiro item acima!'}
            </p>
          </div>
        )}

        {items.length > 0 && (
          <BudgetSummary
            total={total}
            totalBought={totalBought}
            budget={budget}
            itemCount={items.length}
            boughtCount={boughtCount}
            userName={userName}
            topCategory={topCategory}
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
