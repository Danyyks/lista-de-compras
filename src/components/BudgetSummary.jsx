import { formatCurrency } from '../utils/formatCurrency'
import styles from './BudgetSummary.module.css'

export function BudgetSummary({ total, totalBought, budget, itemCount, boughtCount, userName }) {
  const ratio = budget > 0 ? totalBought / budget : 0
  const overBudget = budget > 0 && ratio >= 1
  const nearBudget = budget > 0 && ratio >= 0.9 && ratio < 1

  const progressWidth = budget > 0 ? Math.min(ratio * 100, 100) : 0

  const savings = budget > 0 ? budget - totalBought : 0
  const hasSavings = savings > 0 && boughtCount > 0 && !overBudget
  const allDone = itemCount > 0 && boughtCount === itemCount

  // Mensagem personalizada conforme progresso
  function getProgressMessage() {
    if (allDone && hasSavings) {
      return userName
        ? `${userName}, você economizou ${formatCurrency(savings)}! 🎉`
        : `Você economizou ${formatCurrency(savings)}! 🎉`
    }
    if (allDone) {
      return userName ? `Lista completa, ${userName}! Arrasou!` : 'Lista completa!'
    }
    if (overBudget) {
      return `Acima do orçamento em ${formatCurrency(totalBought - budget)}`
    }
    if (budget > 0) {
      return `Restam ${formatCurrency(savings)}`
    }
    return 'Pronto para o caixa'
  }

  return (
    <div className={`${styles.summary} ${overBudget ? styles.over : ''} ${allDone && hasSavings ? styles.savings : ''}`}>

      {/* Ícone decorativo */}
      <div className={styles.decorIcon} aria-hidden="true">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="9"  y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="9"  y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      <div className={styles.mainRow}>
        <div>
          <p className={styles.labelWhite}>Total da lista</p>
          <p className={styles.valueWhite}>{formatCurrency(total)}</p>
        </div>
      </div>

      {budget > 0 && (
        <>
          <div className={styles.extrasRow}>
            <div className={styles.extraBlock}>
              <span className={styles.extraLabel}>Já comprado</span>
              <span className={`${styles.extraValue} ${overBudget ? styles.danger : nearBudget ? styles.warning : styles.success}`}>
                {formatCurrency(totalBought)}
              </span>
            </div>
            <div className={styles.extraDivider} />
            <div className={styles.extraBlock}>
              <span className={styles.extraLabel}>Orçamento</span>
              <span className={styles.extraValue}>{formatCurrency(budget)}</span>
            </div>
          </div>

          <div className={styles.progressWrapper}>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${overBudget ? styles.fillDanger : nearBudget ? styles.fillWarning : styles.fillSuccess}`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        </>
      )}

      {/* Banner de economia / mensagem personalizada */}
      {(allDone || hasSavings || budget > 0) && (
        <div className={`${styles.messageRow} ${allDone && hasSavings ? styles.messageRowSavings : ''}`}>
          <span className={styles.messageText}>{getProgressMessage()}</span>
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.itemsBadge}>
          {boughtCount}/{itemCount} {itemCount === 1 ? 'item' : 'itens'}
        </span>
        {!(allDone && hasSavings) && (
          <span className={styles.readyLabel}>Pronto para o caixa</span>
        )}
      </div>
    </div>
  )
}
