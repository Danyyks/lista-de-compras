# Componentes

> `PhotoCropper` foi removido: a foto de perfil agora vem pronta da conta
> Google usada no login (somente leitura em `Usuario.jsx`).

## Header
Props: `budget`, `onBudgetChange`, `userName`, `onChangeName`, `autoSort`, `onToggleAutoSort`, `shoppingMode`, `onToggleShoppingMode`, `boughtCount`, `totalCount`
- Título/logo, nome do usuário (leva pra `/usuario`), toggles de modo de compra e agrupamento por categoria, e input de orçamento (colapsável)
- Não recebe `darkMode` — o tema é aplicado direto no `<html>` por `App.jsx`, não por este componente

## AddItemForm
Props: `onAddItem(draft)`, `getLastPrice(name)`, `existingNames`
- Form controlado: nome, categoria (select ou custom)
- Sem campo de preço — preço é definido diretamente na linha do item na lista
- Mostra hint informativo "Última vez: R$ X" ao digitar nome já registrado, e aviso se o nome já está na lista (`existingNames`)
- `onAddItem` recebe `{ name, category, price: 0 }` e deve retornar uma Promise — o form espera ela resolver antes de limpar o campo, e mostra uma mensagem de erro (sem apagar o que foi digitado) se ela rejeitar

## CategoryGroup
Props: `category`, `items`, `onToggle`, `onDelete`, `onEdit`, `hideHeader`, `shoppingMode`, `nextItemId`, `getLastPrice`
- Renderiza seção com header colorido e lista de ShoppingItem (`hideHeader` omite o header, usado na visão "lista plana")
- Itens não comprados aparecem antes dos comprados
- `nextItemId` marca visualmente o próximo item a comprar quando `shoppingMode` está ativo

## ShoppingItem
Props: `item`, `onToggle`, `onDelete`, `onEdit`, `isNext`, `lastHistoryPrice`
- Checkbox, nome (editável inline no clique), quantidade (+/-), preço (editável inline), botão deletar
- Estado `bought` aplica `.bought` CSS: line-through vermelho + opacity
- `lastHistoryPrice` mostra "última vez: R$ X" quando o preço atual do item difere do último preço registrado

## BudgetSummary
Props: `total`, `totalBought`, `budget`, `itemCount`, `boughtCount`, `userName`, `topCategory`
- Mostra total da lista e (se `budget` definido) comparação com orçamento, categoria de maior gasto e mensagem de progresso personalizada
- Barra de progresso: verde <90%, âmbar 90-100%, vermelho ≥100%
- Botões de "Limpar comprados"/"Nova lista" vivem em `ListaCompras.jsx`, não aqui

## BottomNav
Props: `onNavigateToLista`
- Navegação fixa entre `/lista` e `/usuario`, só aparece com usuário logado (ver `App.jsx`)

## Logo
- `Cart`: mascote SVG animado (carrinho); `LogoHorizontal`: logo + texto "Listinha" usado no `Header`
