import { useNavigate, useLocation } from 'react-router-dom'
import styles from './BottomNav.module.css'

export function BottomNav({ onNavigateToLista }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Descobre qual aba está ativa com base na URL atual
  const isLista   = location.pathname === '/lista'
  const isUsuario = location.pathname === '/usuario'

  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      <div className={styles.inner}>

        {/* Minha Lista */}
        <button
          className={`${styles.tab} ${isLista ? styles.active : ''}`}
          onClick={onNavigateToLista}
          aria-label="Minha Lista"
          aria-current={isLista ? 'page' : undefined}
        >
          <span className={styles.iconWrapper}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="9"  y1="12" x2="15" y2="12"/>
              <line x1="9"  y1="16" x2="13" y2="16"/>
            </svg>
          </span>
          <span className={styles.label}>Minha Lista</span>
        </button>

        {/* Usuário / Config */}
        <button
          className={`${styles.tab} ${isUsuario ? styles.active : ''}`}
          onClick={() => navigate('/usuario')}
          aria-label="Configurações"
          aria-current={isUsuario ? 'page' : undefined}
        >
          <span className={styles.iconWrapper}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </span>
          <span className={styles.label}>Config</span>
        </button>

      </div>
    </nav>
  )
}
