import { useState, useEffect } from "react";
import { CATEGORIES } from "../utils/categories";
import { formatCurrency } from "../utils/formatCurrency";
import styles from "./AddItemForm.module.css";

export function AddItemForm({ onAddItem, getLastPrice, existingNames }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("outros");
  const [customCategory, setCustomCategory] = useState("");
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [lastPrice, setLastPrice] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const trimmed = name.trim();
    if (trimmed.length >= 2) {
      const found = getLastPrice(trimmed);
      setLastPrice(found);
    } else {
      setLastPrice(null);
    }
  }, [name, getLastPrice]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (existingNames?.includes(trimmedName.toLowerCase())) {
      setDuplicateWarning(true)
      return
    }
    setDuplicateWarning(false)

    const resolvedCategory = useCustomCategory
      ? customCategory.trim().toLowerCase() || "outros"
      : category;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onAddItem({
        name: trimmedName,
        category: resolvedCategory,
        price: 0,
      });
      // Só limpa o campo depois de confirmar que o item foi salvo —
      // se limpasse antes, uma falha na API passaria despercebida
      // (o campo já vazio dá a impressão de que deu tudo certo).
      setName("");
      setLastPrice(null);
    } catch (err) {
      setErrorMsg(err.message || "Não foi possível adicionar o item. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
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
            placeholder="Ex: Chocolate, Leite..."
            value={name}
            onChange={(e) => { setName(e.target.value); setDuplicateWarning(false) }}
            className={styles.input}
            autoComplete="off"
          />

          {duplicateWarning && (
            <span className={styles.duplicateWarning}>Item já está na lista</span>
          )}

          {/* Histórico de preço — destaque */}
          {lastPrice !== null && (
            <div className={styles.priceHistoryCard}>
              <div className={styles.priceHistoryLeft}>
                <span className={styles.priceHistoryIcon}>🏷️</span>
                <div>
                  <p className={styles.priceHistoryLabel}>Da última vez</p>
                  <p className={styles.priceHistoryValue}>{formatCurrency(lastPrice)}</p>
                </div>
              </div>
              <span className={styles.priceHistoryHint}>
                será preenchido ao editar o preço
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Categoria */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Categoria</label>
        <div className={styles.categoryGroup}>
          {useCustomCategory ? (
            <input
              type="text"
              placeholder="Categoria personalizada..."
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

      {errorMsg && <p className={styles.errorMessage}>⚠️ {errorMsg}</p>}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={!name.trim() || isSubmitting}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {isSubmitting ? "Adicionando..." : "Adicionar à Lista"}
      </button>
    </form>
  );
}
