import { useState } from 'react'

const KEY_NAME   = 'shopping-list-user-name'
const KEY_PHOTO  = 'shopping-list-user-photo'
const KEY_SEEN   = 'shopping-list-user-seen-profile'

export function useUser() {
  const [userName, setUserName] = useState(() => localStorage.getItem(KEY_NAME) || null)
  const [userPhoto, setUserPhoto] = useState(() => localStorage.getItem(KEY_PHOTO) || null)

  // true = já visitou o perfil antes (não é primeira vez)
  const [hasSeenProfile, setHasSeenProfile] = useState(
    () => localStorage.getItem(KEY_SEEN) === 'true'
  )

  function saveName(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    localStorage.setItem(KEY_NAME, trimmed)
    setUserName(trimmed)
  }

  function savePhoto(base64) {
    localStorage.setItem(KEY_PHOTO, base64)
    setUserPhoto(base64)
  }

  function removePhoto() {
    localStorage.removeItem(KEY_PHOTO)
    setUserPhoto(null)
  }

  function markProfileSeen() {
    localStorage.setItem(KEY_SEEN, 'true')
    setHasSeenProfile(true)
  }

  function clearUser() {
    localStorage.removeItem(KEY_NAME)
    localStorage.removeItem(KEY_PHOTO)
    localStorage.removeItem(KEY_SEEN)
    setUserName(null)
    setUserPhoto(null)
    setHasSeenProfile(false)
  }

  return {
    userName, saveName,
    userPhoto, savePhoto, removePhoto,
    hasSeenProfile, markProfileSeen,
    clearUser,
  }
}
