// Este arquivo liga o front-end ao Firebase: cria a conexão e deixa pronto
// o "provedor" de login com Google, usado pelo hook useAuth.

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Esses valores não são segredos (podem aparecer no navegador), mas mesmo
// assim ficam em variáveis de ambiente para facilitar trocar de projeto
// Firebase sem mexer no código. Veja o arquivo .env.example na raiz.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

// "auth" é o objeto que sabe quem está logado agora e permite login/logout.
export const auth = getAuth(app)

// "googleProvider" representa "quero logar usando uma conta Google".
export const googleProvider = new GoogleAuthProvider()
