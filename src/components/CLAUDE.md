# Componentes

## Header
Props: `budget`, `onBudgetChange`, `darkMode`, `onToggleDarkMode`
- Exibe título, botão de tema e input de orçamento (colapsável)

## AddItemForm
Props: `onAddItem(draft)`, `getLastPrice(name)`
- Form controlado: nome, categoria (select ou custom)
- Sem campo de preço — preço é definido diretamente na linha do item na lista
- Mostra hint informativo "Último preço: R$ X" ao digitar nome já registrado
- `onAddItem` recebe `{ name, category, price: 0 }`

## CategoryGroup
Props: `category`, `items`, `onToggle`, `onDelete`, `onEdit`
- Renderiza seção com header colorido e lista de ShoppingItem
- Itens não comprados aparecem antes dos comprados

## ShoppingItem
Props: `item`, `onToggle`, `onDelete`, `onEdit`
- Checkbox, nome (editável inline no clique), preço (editável inline), botão deletar
- Estado `bought` aplica `.bought` CSS: line-through vermelho + opacity

## BudgetSummary
Props: `total`, `totalBought`, `budget`, `onClearBought`, `hasBoughtItems`
- Mostra total da lista e (se budget definido) comparação com orçamento
- Barra de progresso: verde <90%, âmbar 90-100%, vermelho ≥100%
- Pulse animation quando acima do orçamento
