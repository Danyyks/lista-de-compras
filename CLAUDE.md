# Lista de Compras — Contexto do Projeto

## Stack
- **React 19** + **Vite 6**
- **CSS Modules** para estilos de componente
- **localStorage** para persistência (sem backend)
- Sem bibliotecas de UI externas

## Estrutura de Pastas

```
src/
  App.jsx               # Orquestra todo o estado e handlers
  App.css               # Estilos do layout da app
  index.css             # CSS variables, resets globais, dark/light mode
  components/           # Componentes de UI
  hooks/                # Custom hooks com lógica de estado
  utils/                # Funções puras (categorias, formatação)
```

## Convenções
- Componentes em PascalCase, com arquivo `.module.css` próprio
- Hooks prefixados com `use`
- CSS variables definidas em `index.css`, usadas em todos os módulos
- Nenhum estado global além dos hooks — tudo flui de `App.jsx`

## localStorage Keys
| Chave | Conteúdo |
|---|---|
| `shopping-list-items` | `Item[]` — lista completa de itens |
| `shopping-list-price-history` | `Record<string, number>` — último preço por nome |
| `shopping-list-budget` | `string` — orçamento total (opcional) |
| `shopping-list-dark-mode` | `"true"/"false"` — preferência de tema |

## Shape do Item
```js
{
  id: string,          // crypto.randomUUID()
  name: string,
  category: string,    // chave da categoria (ex: "frutas", "limpeza")
  price: number,       // 0 se não definido
  quantity: number,    // padrão 1
  bought: boolean,
  createdAt: number,   // Date.now()
}
```

## Tema
- Dark mode é padrão
- Controlado por `data-theme="dark"|"light"` no `<html>`
- CSS variables em `index.css` — `:root` (light) e `[data-theme="dark"]`
