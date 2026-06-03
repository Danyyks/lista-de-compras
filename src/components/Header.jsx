import { useState, useEffect } from "react";
import { parsePrice } from "../utils/formatCurrency";
import styles from "./Header.module.css";

export function Header({
  budget,
  onBudgetChange,
  userName,
  onChangeName,
  autoSort,
  onToggleAutoSort,
  shoppingMode,
  onToggleShoppingMode,
  boughtCount,
  totalCount,
}) {
  const [showBudget, setShowBudget] = useState(budget !== null);
  const [budgetInput, setBudgetInput] = useState(
    budget ? String(budget).replace(".", ",") : "",
  );

  useEffect(() => {
    if (budget === null) {
      setShowBudget(false)
      setBudgetInput("")
    }
  }, [budget])

  function handleBudgetChange(e) {
    const raw = e.target.value
    setBudgetInput(raw)
    if (raw === '') {
      onBudgetChange(null)
    } else {
      const value = Math.min(99999.99, parsePrice(raw))
      onBudgetChange(value > 0 ? value : null)
    }
  }

  function toggleBudget() {
    if (showBudget) {
      onBudgetChange(null);
      setBudgetInput("");
    }
    setShowBudget((prev) => !prev);
  }

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.titleGroup}>
          <div className={styles.titleStack}>
            <h1 className={styles.title}>
              Listinha<span className={styles.titleDot}>.</span>
            </h1>
            {userName && (
              <button
                className={styles.userName}
                onClick={onChangeName}
                title="Trocar nome"
              >
                Olá, {userName}!
              </button>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {/* Botão modo de compra */}
          <button
            className={`${styles.iconBtn} ${shoppingMode ? styles.iconBtnActive : ''}`}
            onClick={onToggleShoppingMode}
            title={shoppingMode ? "Sair do modo compra" : "Modo de compra"}
            aria-pressed={shoppingMode}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
            </svg>
          </button>

          {/* Toggle autoSort */}
          <button
            className={`${styles.iconBtn} ${autoSort ? styles.iconBtnActive : ''}`}
            onClick={onToggleAutoSort}
            title={autoSort ? "Desativar agrupamento" : "Agrupar por categoria"}
            aria-pressed={autoSort}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>

          <button
            className={styles.budgetToggle}
            onClick={toggleBudget}
            title={showBudget ? "Remover orçamento" : "Definir orçamento"}
          >
            {showBudget ? "✕ Orçamento" : "+ Orçamento"}
          </button>
        </div>
      </div>

      {/* Progresso rápido no header quando há itens */}
      {totalCount > 0 && (
        <p className={styles.progressHint}>
          {boughtCount} de {totalCount} {totalCount === 1 ? 'item marcado' : 'itens marcados'}
        </p>
      )}

      {showBudget && (
        <div className={styles.budgetRow}>
          <label className={styles.budgetLabel} htmlFor="budget-input">
            Quanto pretendo gastar:
          </label>
          <div className={styles.budgetInputWrapper}>
            <span className={styles.currencyPrefix}>R$</span>
            <input
              id="budget-input"
              type="number"
              min="0"
              max="99999.99"
              step="0.01"
              placeholder="0,00"
              value={budgetInput}
              onChange={handleBudgetChange}
              className={styles.budgetInput}
            />
          </div>
          {budgetInput && !budget && (
            <span className={styles.budgetError}>Valor deve ser maior que zero</span>
          )}
        </div>
      )}
    </header>
  );
}
