# Lista de Compras — Contexto do Projeto

## Stack

**Frontend**
- **React 19** + **Vite 6**
- **React Router DOM** com `HashRouter` (compatível com GitHub Pages / Vercel)
- **CSS Modules** para estilos de componente
- **Firebase Auth** (login com Google) — sem senha própria
- Sem bibliotecas de UI externas

**Backend**
- **Python 3** + **Flask** — API simples e didática, ver `backend/README.md`
- **Firestore** (Firebase) como banco de dados, acessado via **Firebase Admin SDK**
- Autenticação: o backend valida o token de login do Google em cada requisição (`backend/auth.py`)

## Estrutura de Pastas

```
firebase.json            # aponta para firestore.rules
firestore.rules          # regras de segurança do Firestore
backend/                # API Flask (ver backend/README.md para setup e deploy)
  app.py                 # cria o app Flask, CORS, registra as rotas
  firebase_setup.py       # inicializa Firebase Admin SDK + cliente Firestore
  auth.py                  # decorator @login_required (valida o Bearer token)
  routes/
    profile_routes.py        # GET/PUT /api/profile
    items_routes.py           # CRUD /api/items
    price_history_routes.py    # GET/POST/DELETE /api/price-history
  api/index.py            # ponto de entrada só usado pelo deploy serverless na Vercel
  vercel.json              # config do deploy serverless do backend
src/
  App.jsx               # Orquestra estado global, handlers e rotas
  App.css               # Estilos do layout da app
  index.css             # CSS variables, resets globais, dark/light/auto mode
  services/              # Comunicação com Firebase e com a API
    firebase.js            # initializeApp + getAuth + GoogleAuthProvider
    api.js                   # helper fetch() que injeta o token em toda chamada
  components/            # Componentes de UI reutilizáveis
    CLAUDE.md              # Documentação dos componentes
  hooks/                 # Custom hooks com lógica de estado
    CLAUDE.md               # Documentação dos hooks
  pages/                  # Páginas roteadas
    Login.jsx               # Botão "Entrar com Google"
    ListaCompras.jsx         # Página principal da lista
    Usuario.jsx               # Perfil (somente leitura), tema, sign out
  utils/
    categories.js             # Mapa de categorias (chave → label/cor)
    formatCurrency.js          # Formatação BRL
```

## Roteamento
- Rotas: `/login`, `/lista`, `/usuario`
- Usuário sem sessão do Firebase → redireciona para `/login`
- Usuário logado → redireciona para `/lista`
- `BottomNav` só aparece quando o usuário está logado

## Convenções
- Componentes em PascalCase, com arquivo `.module.css` próprio
- Hooks prefixados com `use`
- CSS variables definidas em `index.css`, usadas em todos os módulos
- Nenhum estado global além dos hooks — tudo flui de `App.jsx`
- Cada função/rota relevante (Python e JS) tem um comentário curto explicando o "porquê" — o projeto é usado como material didático

## Onde cada dado mora

| Dado | Onde vive | Hook/serviço |
|---|---|---|
| Sessão de login (uid, nome, foto, e-mail) | Firebase Auth | `useAuth` |
| Itens da lista | Firestore: `users/{uid}/items` | `useShoppingList` |
| Histórico de último preço por item | Firestore: `users/{uid}/priceHistory` | `usePriceHistory` |
| Orçamento e tema | Firestore: `users/{uid}` (campos `budget`, `theme`) | `useProfile` |
| Agrupar por categoria (`autoSort`) e modo de compra (`shoppingMode`) | `localStorage`, 100% client-side | direto em `ListaCompras.jsx` |
| Cache do tema para evitar "flash" ao abrir o app | `localStorage` (`shopping-list-dark-mode`, valores `"light"/"dark"/"auto"`) | lido em `main.jsx`, escrito por `useProfile` |

Endpoints da API estão documentados nos comentários de cada arquivo em `backend/routes/`.

## Shape do Item
```js
{
  id: string,          // ID do documento no Firestore
  name: string,
  category: string,    // chave da categoria (ex: "frutas", "limpeza")
  price: number,       // 0 se não definido
  quantity: number,    // padrão 1
  bought: boolean,
  createdAt: number,   // milissegundos desde 1970, gerado pelo servidor
}
```

## Tema
- Três modos: `dark`, `light`, `auto` (padrão: `auto`)
- Modo `auto`: dark das 18h às 6h, light durante o dia — atualiza a cada minuto
- Controlado por `data-theme="dark"|"light"` no `<html>`
- CSS variables em `index.css` — `:root` (light) e `[data-theme="dark"]`
- Persistido no Firestore como texto (`"light"`, `"dark"` ou `"auto"`); os componentes de UI (`Usuario.jsx`) continuam trabalhando com booleano/null — a conversão acontece em `App.jsx`

## Configuração do Firebase
- `firebase.json` e `firestore.rules` (raiz do projeto) — regras de segurança do Firestore, deployadas com `firebase deploy --only firestore:rules`
- Como só o backend acessa o Firestore (via Admin SDK, que ignora essas regras), elas ficam fechadas (`allow read, write: if false`) como segunda camada de proteção

## Deploy
- **Frontend**: Vercel, projeto `listinha` (https://listinha-mu.vercel.app) — configuração em `vercel.json`, variáveis `VITE_FIREBASE_*` e `VITE_API_URL` no painel do projeto
- **Backend**: Vercel também, mas como projeto separado, `listinha-api` (https://listinha-api-delta.vercel.app), rodando como função Python serverless — configuração em `backend/vercel.json` + `backend/api/index.py`. Detalhes de como publicar em `backend/README.md`
- Domínio de produção do frontend precisa estar em **Firebase Console → Authentication → Settings → Domínios autorizados**, senão o login com Google falha
- `public/sw.js` — **não é um service worker de verdade**, é um "matador" do service worker do PWA antigo (removido nessa migração). Quem instalou o app antes continuaria preso na versão em cache pra sempre sem isso; esse arquivo limpa o cache antigo, se desregistra e recarrega a página. Pode ser removido depois que não houver mais instalações antigas por aí (ex: alguns meses)

## Segurança
- Toda rota que lê/escreve dados exige `@login_required` (`backend/auth.py`), que valida o token do Firebase e rejeita sessões revogadas (`check_revoked=True`)
- Dados sempre isolados por `users/{uid}/...` no Firestore — o `uid` vem do token verificado, nunca do corpo da requisição
- CORS restrito à origem definida em `FRONTEND_URL` (não aceita qualquer site)
- `price`/`quantity` validados no backend antes de gravar (rejeita texto, negativos — ver `parse_non_negative_number` em `backend/routes/items_routes.py`)
- `debug=True` do Flask só liga com `FLASK_DEBUG=true` no `.env` — nunca deve estar ligado em produção
