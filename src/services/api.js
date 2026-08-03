// Este arquivo centraliza toda comunicação com o backend Flask.
// Em vez de cada hook lidar com fetch/headers/token na mão, todo mundo
// chama api.get/post/put/del e recebe já o JSON pronto.

import { auth } from './firebase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Monta os headers de toda requisição, incluindo o token de login do
// usuário atual (quando existir) no formato que o backend espera:
// "Authorization: Bearer <token>".
async function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' }

  const user = auth.currentUser
  if (user) {
    // getIdToken() já cuida de renovar o token se ele estiver perto de expirar.
    const token = await user.getIdToken()
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

// Função central: faz a chamada HTTP e já devolve o corpo como JSON.
async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: await buildHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || `Erro ${response.status} ao chamar ${path}`)
  }

  // Respostas 204 (No Content) não têm corpo para converter em JSON.
  if (response.status === 204) return null

  return response.json()
}

// Atalhos usados pelos hooks — deixam a intenção de cada chamada clara.
export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
}
