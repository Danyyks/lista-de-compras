<h1>
  <img src="public/icons/icon.svg" width="38" align="center" alt="Listinha"> Listinha
</h1>

App de lista de compras para o celular — sem papel, sem cadastro, sem internet. Você monta a lista antes de sair, marca os itens no mercado e acompanha o gasto em tempo real.

Demo: https://lista-de-compras-dany.vercel.app

---

## O projeto

Toda semana o mesmo problema: chegar no mercado sem lista, comprar o que não precisava e esquecer o que precisava. Os apps disponíveis tinham conta, sincronização em nuvem e funcionalidades que eu nunca ia usar.

Resolvi construir o meu: sem cadastro, sem backend, sem mensalidade. Tudo salvo no próprio dispositivo via localStorage. O resultado é um PWA instalável que uso no dia a dia para planejar as compras, controlar o gasto e não precisar mais do papel.

---

## Telas

<div align="center">
  <img src="fotosReadme/Captura%20de%20tela%202026-06-03%20135758.png" width="192" alt="Lista vazia">
  &nbsp;
  <img src="fotosReadme/Captura%20de%20tela%202026-06-03%20135919.png" width="192" alt="Lista com itens">
  &nbsp;
  <img src="fotosReadme/Captura%20de%20tela%202026-06-03%20140020.png" width="192" alt="Lista completa com orçamento">
  &nbsp;
  <img src="fotosReadme/Captura%20de%20tela%202026-06-03%20135851.png" width="192" alt="Perfil e aparência">
</div>

---

## Funcionalidades

**Lista de compras**
Adicione produtos por nome e escolha a categoria. Os itens ficam organizados automaticamente por grupo — hortifruti, laticínios, limpeza, e por aí vai.

**Quantidade e preço**
Defina quantas unidades quer de cada item e qual o preço. O total da lista é calculado em tempo real conforme você adiciona ou ajusta os produtos.

**Orçamento**
Defina quanto quer gastar. O app mostra quanto você já comprometeu, quanto sobra, e celebra quando você termina a lista dentro do limite.

**Modo de compras**
Marque os itens conforme coloca no carrinho. Os produtos marcados ficam separados dos pendentes para você não perder o fio da meada no mercado.

**Memória de preços**
O app registra o último preço de cada produto. Na próxima vez que você adicionar o mesmo item, ele já sugere o valor automaticamente.

**Aparência**
Tema claro, escuro ou automático. No modo automático, o app muda sozinho dependendo do horário do dia — escuro à noite, claro de dia.

**PWA**
Instalável como app nativo na tela inicial do celular. Funciona sem internet depois de carregado.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + Vite 6 |
| Roteamento | React Router DOM com HashRouter |
| Estilização | CSS Modules |
| Persistência | localStorage (sem backend) |
| PWA | vite-plugin-pwa |
| Deploy | Vercel |

O design usa um sistema próprio — roxo médio como cor primária, tipografia com Titan One e Space Grotesk, tokens de cor definidos em `src/index.css` com suporte a dark e light mode.

---

## Estrutura

```
src/
  App.jsx               — estado global, handlers e rotas
  index.css             — CSS variables, reset global, dark/light mode
  components/           — componentes reutilizáveis (Header, BottomNav, Logo...)
  hooks/                — lógica de estado (useItems, useBudget, useTheme...)
  pages/
    Login.jsx           — entrada do nome do usuário
    ListaCompras.jsx    — página principal da lista
    Usuario.jsx         — perfil, foto, tema, sign out
  utils/
    categories.js       — mapa de categorias com label e cor
    formatCurrency.js   — formatação BRL
```

---

## Rodando localmente

```bash
git clone https://github.com/Danyyks/lista-de-compras
cd lista-de-compras
npm install
npm run dev
# http://localhost:5173
```

Para gerar a versão de produção:

```bash
npm run build
```

---

Feito por Dany Jonathan Bueno
