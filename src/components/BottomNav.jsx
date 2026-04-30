import { useNavigate, useLocation } from 'react-router-dom'
import styles from './BottomNav.module.css'

function IconLista({ filled }) {
  if (filled) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M15 2H9a1 1 0 00-1 1v1H6a2 2 0 00-2 2v13a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2V3a1 1 0 00-1-1zm-3 1.5h2V5h-2V3.5zM8.25 11a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zm0 3.5a.75.75 0 000 1.5h5a.75.75 0 000-1.5h-5z"/>
      </svg>
    )
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  )
}

function IconPerfil({ filled }) {
  if (filled) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a5 5 0 110 10A5 5 0 0112 2zm0 12c5.52 0 8 2.69 8 4v1.5a.5.5 0 01-.5.5h-15a.5.5 0 01-.5-.5V18c0-1.31 2.48-4 8-4z"/>
      </svg>
    )
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"/>
    </svg>
  )
}

export function BottomNav({ onNavigateToLista }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isLista   = location.pathname === '/lista'
  const isUsuario = location.pathname === '/usuario'

  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      <div className={styles.inner}>

        <button
          className={`${styles.tab} ${isLista ? styles.active : ''}`}
          onClick={onNavigateToLista}
          aria-label="Minha Lista"
          aria-current={isLista ? 'page' : undefined}
        >
          <span className={styles.iconWrapper}>
            <IconLista filled={isLista} />
          </span>
          <span className={styles.label}>Lista</span>
        </button>

        <button
          className={`${styles.tab} ${isUsuario ? styles.active : ''}`}
          onClick={() => navigate('/usuario')}
          aria-label="Perfil"
          aria-current={isUsuario ? 'page' : undefined}
        >
          <span className={styles.iconWrapper}>
            <IconPerfil filled={isUsuario} />
          </span>
          <span className={styles.label}>Perfil</span>
        </button>

      </div>
    </nav>
  )
}
