import { ShoppingItem } from './ShoppingItem'
import { getCategoryLabel, getCategoryColor } from '../utils/categories'
import styles from './CategoryGroup.module.css'

export function CategoryGroup({ category, items, onToggle, onDelete, onEdit, hideHeader, shoppingMode, nextItemId, getLastPrice }) {
  const label = getCategoryLabel(category)
  const color = getCategoryColor(category)

  const pending = items.filter(i => !i.bought)
  const bought = items.filter(i => i.bought)

  return (
    <section className={styles.group}>
      {!hideHeader && (
        <div className={styles.header}>
          <h2 className={styles.title} style={{ color }}>{label}</h2>
        </div>
      )}

      <div className={styles.items}>
        {pending.map(item => (
          <ShoppingItem
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            isNext={shoppingMode && item.id === nextItemId}
            lastHistoryPrice={getLastPrice ? getLastPrice(item.name) : 0}
          />
        ))}
        {bought.map(item => (
          <ShoppingItem
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            isNext={false}
            lastHistoryPrice={getLastPrice ? getLastPrice(item.name) : 0}
          />
        ))}
      </div>
    </section>
  )
}
