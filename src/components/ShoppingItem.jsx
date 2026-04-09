import { useState, useRef, useEffect } from 'react'
import { formatCurrency, parsePrice } from '../utils/formatCurrency'
import styles from './ShoppingItem.module.css'

export function ShoppingItem({ item, onToggle, onDelete, onEdit, isNext }) {
  const [editingName, setEditingName] = useState(false)
  const [editingPrice, setEditingPrice] = useState(false)
  const [nameValue, setNameValue] = useState(item.name)
  const [priceValue, setPriceValue] = useState(item.price > 0 ? String(item.price).replace('.', ',') : '')
  const nameRef = useRef(null)
  const priceRef = useRef(null)

  function changeQuantity(delta) {
    const next = Math.max(1, (item.quantity ?? 1) + delta)
    onEdit(item.id, { quantity: next })
  }

  useEffect(() => {
    if (editingName) nameRef.current?.select()
  }, [editingName])

  useEffect(() => {
    if (editingPrice) priceRef.current?.select()
  }, [editingPrice])

  function commitName() {
    const trimmed = nameValue.trim()
    if (trimmed && trimmed !== item.name) {
      onEdit(item.id, { name: trimmed })
    } else {
      setNameValue(item.name)
    }
    setEditingName(false)
  }

  function commitPrice() {
    const price = parsePrice(priceValue)
    onEdit(item.id, { price })
    setEditingPrice(false)
  }

  function handleNameKey(e) {
    if (e.key === 'Enter') commitName()
    if (e.key === 'Escape') { setNameValue(item.name); setEditingName(false) }
  }

  function handlePriceKey(e) {
    if (e.key === 'Enter') commitPrice()
    if (e.key === 'Escape') { setPriceValue(item.price > 0 ? String(item.price).replace('.', ',') : ''); setEditingPrice(false) }
  }

  return (
    <div className={`${styles.item} ${item.bought ? styles.bought : ''} ${isNext ? styles.nextItem : ''}`}>
      {/* Indicador "próximo" no modo de compra */}
      {isNext && (
        <div className={styles.nextBadge} aria-label="Próximo item">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <polygon points="0,0 10,5 0,10"/>
          </svg>
        </div>
      )}

      <button
        className={styles.checkbox}
        onClick={() => onToggle(item.id)}
        aria-label={item.bought ? 'Marcar como não comprado' : 'Marcar como comprado'}
      >
        <span className={styles.checkboxInner}>
          {item.bought && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      </button>

      <div className={styles.content}>
        {editingName ? (
          <input
            ref={nameRef}
            type="text"
            value={nameValue}
            onChange={e => setNameValue(e.target.value)}
            onBlur={commitName}
            onKeyDown={handleNameKey}
            className={styles.editInput}
          />
        ) : (
          <span
            className={styles.name}
            onClick={() => !item.bought && setEditingName(true)}
            title={item.bought ? '' : 'Clique para editar'}
          >
            {item.name}
          </span>
        )}
        <span className={styles.qtyLabel}>
          {item.quantity ?? 1} {(item.quantity ?? 1) === 1 ? 'unidade' : 'unidades'}
        </span>
      </div>

      <div className={styles.quantityControl}>
        <button
          className={styles.qtyBtn}
          onClick={() => changeQuantity(-1)}
          disabled={item.quantity <= 1}
          aria-label="Diminuir quantidade"
        >−</button>
        <span className={styles.qtyValue}>{item.quantity ?? 1}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => changeQuantity(1)}
          aria-label="Aumentar quantidade"
        >+</button>
      </div>

      <div className={styles.priceWrapper}>
        {editingPrice ? (
          <div className={styles.priceEditGroup}>
            <span className={styles.pricePrefix}>R$</span>
            <input
              ref={priceRef}
              type="number"
              min="0"
              step="0.01"
              value={priceValue}
              onChange={e => setPriceValue(e.target.value)}
              onBlur={commitPrice}
              onKeyDown={handlePriceKey}
              className={styles.priceEditInput}
            />
          </div>
        ) : (
          <button
            className={styles.priceBtn}
            onClick={() => setEditingPrice(true)}
            title="Clique para editar o preço unitário"
          >
            {item.price > 0 ? (
              <span className={styles.priceDisplay}>
                {item.quantity > 1 && (
                  <span className={styles.priceUnit}>{formatCurrency(item.price)} ×{item.quantity}</span>
                )}
                <span>{formatCurrency(item.price * (item.quantity ?? 1))}</span>
              </span>
            ) : (
              <span className={styles.addPrice}>+ preço</span>
            )}
          </button>
        )}
      </div>

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(item.id)}
        aria-label="Remover item"
        title="Remover item"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
