# Backend — Lista de Compras (Flask + Firestore)

API simples em Python/Flask que guarda os dados do app no Firestore (banco
de dados do Firebase) e valida o login feito com Google no front-end.

## Passo a passo para rodar localmente

### 1. Criar um projeto no Firebase (uma vez só)
1. Acesse https://console.firebase.google.com e crie um novo projeto.
2. Vá em **Authentication → Sign-in method** e ative o provedor **Google**.
3. Vá em **Firestore Database** e clique em **Criar banco de dados**
   (pode escolher a região `southamerica-east1`, e modo produção — como
   só o backend acessa o Firestore, as regras podem negar tudo:
   `allow read, write: if false;`).
4. Vá em **Configurações do projeto (⚙️) → Contas de serviço** e clique em
   **Gerar nova chave privada**. Isso baixa um arquivo `.json`.
5. Renomeie esse arquivo para `serviceAccountKey.json` e coloque dentro
   desta pasta (`backend/`). Ele **não deve** ser commitado — já está no
   `.gitignore`.

### 2. Instalar as dependências Python
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

### 3. Configurar as variáveis de ambiente
```bash
copy .env.example .env        # Windows
# cp .env.example .env        # Mac/Linux
```
O `.env.example` já vem com o nome correto do arquivo de credencial
(`serviceAccountKey.json`) — normalmente não precisa mudar nada.

Duas variáveis valem atenção especial:
- `FRONTEND_URL` — único endereço liberado a chamar essa API (CORS). Em
  desenvolvimento local é `http://localhost:5173`; ao publicar o frontend,
  troque para o domínio real (ex: `https://seu-app.vercel.app`).
- `FLASK_DEBUG` — deixe `true` só em desenvolvimento. Em produção, apague
  essa linha ou deixe `false`: com debug ligado, um erro não tratado abre
  um console que executa código Python direto no navegador.

### 4. Rodar o servidor
```bash
python app.py
```
O servidor sobe em `http://localhost:5000`. Teste em
`http://localhost:5000/api/health` — deve responder `{"status": "ok"}`.

## Estrutura
- `app.py` — cria o app Flask e registra as rotas
- `firebase_setup.py` — inicializa o Firebase Admin SDK e o cliente do Firestore
- `auth.py` — decorator que valida o token de login em cada rota protegida
- `routes/` — um arquivo por grupo de rotas (perfil, itens, histórico de preço)
