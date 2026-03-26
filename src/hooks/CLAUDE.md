# Hooks

## useShoppingList
Gerencia a lista de itens com persistência em localStorage.

Retorna:
- `items: Item[]`
- `addItem({ name, category, price, quantity? })` → cria item com UUID e `bought: false`
- `removeItem(id)`
- `toggleItem(id)` → inverte `bought`
- `editItem(id, changes)` → merge parcial
- `clearBought()` → remove todos os itens com `bought: true`

Chave localStorage: `shopping-list-items`

## usePriceHistory
Armazena o último preço pago por nome de item.

Retorna:
- `recordPrice(name, price)` → salva no histórico (chave: nome normalizado)
- `getLastPrice(name)` → retorna o último preço ou `null`

Chave localStorage: `shopping-list-price-history`
Normalização: `name.trim().toLowerCase()`
