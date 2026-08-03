import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, googleProvider } from '../services/firebase'

// Hook que sabe quem está logado agora e oferece login/logout com Google.
// Substitui o antigo useUser.js — não guardamos mais nome/foto na mão,
// eles já vêm prontos da conta Google usada no login.
export function useAuth() {
  const [user, setUser] = useState(null)
  // Começa "true" porque, ao abrir o app, ainda não sabemos se já existe
  // uma sessão salva do Firebase (isso é resolvido de forma assíncrona).
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChanged "escuta" o Firebase e avisa sempre que o login
    // muda — inclusive ao recarregar a página, se o usuário já estava logado.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  // Abre o popup de login do Google. O restante do app não precisa fazer
  // mais nada: o onAuthStateChanged acima já vai disparar com o novo user.
  async function signInWithGoogle() {
    await signInWithPopup(auth, googleProvider)
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  return { user, isLoading, signInWithGoogle, signOut }
}
