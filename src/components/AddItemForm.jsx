import { useState, useEffect } from "react";
import { CATEGORIES } from "../utils/categories";
import { formatCurrency, parsePrice } from "../utils/formatCurrency";
import styles from "./AddItemForm.module.css";

export function AddItemForm({ onAddItem, getLastPrice }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("outros");
  const [customCategory, setCustomCategory] = useState("");
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const [lastPrice, setLastPrice] = useState(null);

  useEffect(() => {
    const trimmed = name.trim();
    if (trimmed.length >= 2) {
      const found = getLastPrice(trimmed);
      setLastPrice(found);
    } else {
      setLastPrice(null);
    }
  }, [name, getLastPrice]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const resolvedCategory = useCustomCategory
      ? customCategory.trim().toLowerCase() || "outros"
      : category;

    onAddItem({
      name: trimmedName,
      category: resolvedCategory,
      price: parsePrice(priceInput),
    });

    setName("");
    setPriceInput("");
    setLastPrice(null);
  }

  function applyLastPrice() {
    setPriceInput(String(lastPrice).replace(".", ","));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.sectionTitle}>Novo Item</p>

      {/* Campo nome */}
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="item-name">
          Nome do Produto
        </label>
        <div className={styles.nameGroup}>
          <input
            id="item-name"
            type="text"
            placeholder="Ex: Chocolate"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            autoComplete="off"
          />
          {lastPrice !== null && (
            <button
              type="button"
              className={styles.lastPriceHint}
              onClick={applyLastPrice}
              title="Clique para usar este preço"
            >
              Último preço: {formatCurrency(lastPrice)}
            </button>
          )}
        </div>
      </div>

      {/* Categoria + Preço na mesma linha */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Categoria</label>
          <div className={styles.categoryGroup}>
            {useCustomCategory ? (
              <input
                type="text"
                placeholder="Personalizada..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className={styles.input}
              />
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.select}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              className={styles.toggleCustom}
              onClick={() => setUseCustomCategory((prev) => !prev)}
              title={
                useCustomCategory
                  ? "Usar lista de categorias"
                  : "Digitar categoria personalizada"
              }
            >
              {useCustomCategory ? "↩" : "+"}
            </button>
          </div>
        </div>

        <div className={styles.priceField}>
          <label className={styles.fieldLabel}>Preço</label>
          <div className={styles.priceGroup}>
            <span className={styles.prefix}>R$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className={styles.priceInput}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={!name.trim()}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="8"
            y1="12"
            x2="16"
            y2="12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Adicionar
      </button>
    </form>
  );
}
