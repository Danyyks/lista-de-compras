# Lista de Compras — Contexto do Projeto

## Stack
- **React 19** + **Vite 6**
- **React Router DOM** com `HashRouter` (compatível com GitHub Pages / Vercel)
- **CSS Modules** para estilos de componente
- **localStorage** para persistência (sem backend)
- Sem bibliotecas de UI externas

## Estrutura de Pastas

```
src/
  App.jsx               # Orquestra estado global, handlers e rotas
  App.css               # Estilos do layout da app
  index.css             # CSS variables, resets globais, dark/light/auto mode
  components/           # Componentes de UI reutilizáveis
    CLAUDE.md           # Documentação dos componentes
  hooks/                # Custom hooks com lógica de estado
    CLAUDE.md           # Documentação dos hooks
  pages/                # Páginas roteadas
    Login.jsx           # Entrada de nome do usuário
    ListaCompras.jsx    # Página principal da lista
    Usuario.jsx         # Perfil, foto, tema, sign out
  utils/
    categories.js       # Mapa de categorias (chave → label/cor)
    formatCurrency.js   # Formatação BRL
```

## Roteamento
- Rotas: `/login`, `/lista`, `/usuario`
- Usuário sem nome → redireciona para `/login`
- Usuário com nome → redireciona para `/lista` (ou `/usuario` na primeira vez)
- `BottomNav` só aparece quando o usuário está logado

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
| `shopping-list-dark-mode` | `"true"/"false"/"auto"` — preferência de tema |
| `shopping-list-user-name` | `string` — nome do usuário |
| `shopping-list-user-photo` | `string` — foto em base64 |
| `shopping-list-user-seen-profile` | `"true"` — se já visitou a página de perfil |

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
- Três modos: `dark`, `light`, `auto` (padrão: auto)
- Modo `auto`: dark das 18h às 6h, light durante o dia — atualiza a cada minuto
- Controlado por `data-theme="dark"|"light"` no `<html>`
- CSS variables em `index.css` — `:root` (light) e `[data-theme="dark"]`
- Preferência salva como `"true"`, `"false"` ou `"auto"` no localStorage

## Deploy
- Vercel (configuração em `vercel.json`)
- GitHub Actions para CI/CD (`.github/workflows/`)
