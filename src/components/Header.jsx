import { useState, useEffect } from "react";
import { parsePrice } from "../utils/formatCurrency";
import styles from "./Header.module.css";

export function Header({
  budget,
  onBudgetChange,
  userName,
  onChangeName,
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
    const raw = e.target.value;
    setBudgetInput(raw);
    const value = parsePrice(raw);
    onBudgetChange(value > 0 ? value : null);
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
            <h1 className={styles.title}>Listinha</h1>
            {userName && (
              <button
                className={styles.userName}
                onClick={onChangeName}
                title="Trocar nome"
              >
                Olá, {userName}
              </button>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.budgetToggle}
            onClick={toggleBudget}
            title={showBudget ? "Remover orçamento" : "Definir orçamento"}
          >
            {showBudget ? "✕ Orçamento" : "+ Orçamento"}
          </button>

        </div>
      </div>

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
              step="0.01"
              placeholder="0,00"
              value={budgetInput}
              onChange={handleBudgetChange}
              className={styles.budgetInput}
            />
          </div>
        </div>
      )}
    </header>
  );
}
