# Hooks

Todos os hooks abaixo (exceto `useAuth`) só buscam dados da API quando
existe um usuário logado — recebem o `user` do Firebase Auth como parâmetro.

Toda ação que muda dados (`addItem`, `removeItem`, `toggleItem`, `editItem`,
`clearBought`, `clearAll`, `setBudget`, `setTheme`, `recordPrice`,
`clearHistory`) atualiza a tela imediatamente, sem esperar a API responder
(otimista). Se a chamada falhar, o próprio hook desfaz a mudança local
(volta ao estado anterior) e relança o erro — quem chamou pode capturar com
try/catch pra mostrar algo ao usuário, como já faz o `AddItemForm`.

## useAuth
Login com Google via Firebase Auth. Substitui o antigo `useUser`.

Retorna:
- `user` → objeto do Firebase (`uid`, `displayName`, `photoURL`, `email`) ou `null`
- `isLoading` → true enquanto o Firebase ainda não respondeu se há sessão salva
- `signInWithGoogle()` → abre o popup de login
- `signOut()` → encerra a sessão

## useProfile(user)
Orçamento e tema do usuário, via `GET/PUT /api/profile`. Cria o perfil
automaticamente no backend no primeiro login (get-or-create).

Retorna:
- `budget: number | null`, `setBudget(valor)`
- `theme: "light" | "dark" | "auto"`, `setTheme(valor)`

## useShoppingList(user)
Gerencia a lista de itens chamando a API (`/api/items`).

Retorna:
- `items: Item[]`
- `addItem({ name, category, price, quantity? })` → `POST /api/items`
- `removeItem(id)` → `DELETE /api/items/:id`
- `toggleItem(id)` → inverte `bought` via `PUT /api/items/:id`
- `editItem(id, changes)` → merge parcial via `PUT /api/items/:id`
- `clearBought()` → `POST /api/items/clear-bought`
- `clearAll()` → `POST /api/items/clear-all`

O backend já atualiza o histórico de preços automaticamente quando um item
é salvo com preço maior que zero — não é preciso chamar nada manualmente.

## usePriceHistory(user)
Último preço pago por nome de item, via `/api/price-history`.

Retorna:
- `recordPrice(name, price)` → registro manual (o automático já acontece no backend)
- `getLastPrice(name)` → lookup **síncrono** num cache local em memória (buscado uma vez ao logar, para não gerar uma chamada de rede a cada tecla digitada)
- `clearHistory()` → apaga todo o histórico
