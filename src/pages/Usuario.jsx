import styles from "./Usuario.module.css";

// Página de perfil: foto e nome vêm prontos da conta Google (somente
// leitura aqui — não existe mais upload manual de foto). O usuário ainda
// pode trocar o tema, limpar o histórico de preços e sair da conta.
export function Usuario({
  userName,
  userPhoto,
  onSignOut,
  darkMode,
  onSetTheme,
  onClearPriceHistory,
}) {
  const isLight = darkMode === false;
  const isDark = darkMode === true;
  const isAuto = darkMode === null || darkMode === undefined;

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        {/* Foto de perfil (da conta Google, somente leitura) */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarBtn}>
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="Foto de perfil"
                className={styles.avatarImg}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Nome */}
        <div className={styles.nameSection}>
          <h1 className={styles.name}>{userName}</h1>
        </div>

        {/* Seção Aparência */}
        <div className={styles.appearanceSection}>
          <p className={styles.appearanceTitle}>Aparência</p>

          <div className={styles.themeCards}>
            <button
              className={`${styles.themeCard} ${isLight ? styles.themeCardActive : ""}`}
              onClick={() => onSetTheme(false)}
            >
              <span className={styles.themeCardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="19.78" y1="4.22" x2="17.66" y2="6.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="6.34" y1="17.66" x2="4.22" y2="19.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.themeCardLabel}>Claro</span>
            </button>

            <button
              className={`${styles.themeCard} ${isDark ? styles.themeCardActive : ""}`}
              onClick={() => onSetTheme(true)}
            >
              <span className={styles.themeCardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={styles.themeCardLabel}>Escuro</span>
            </button>

            <button
              className={`${styles.themeCard} ${isAuto ? styles.themeCardActive : ""}`}
              onClick={() => onSetTheme(null)}
            >
              <span className={styles.themeCardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 3v18M3 12h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 3a9 9 0 010 18z" fill="currentColor" opacity="0.2" />
                </svg>
              </span>
              <span className={styles.themeCardLabel}>Automático</span>
            </button>
          </div>
        </div>

        {/* Seção Dados */}
        {onClearPriceHistory && (
          <div className={styles.dataSection}>
            <p className={styles.appearanceTitle}>Dados</p>
            <button
              className={styles.dangerBtn}
              onClick={() => {
                if (window.confirm('Limpar histórico de preços? Não é possível desfazer.')) {
                  onClearPriceHistory()
                }
              }}
            >
              Limpar histórico de preços
            </button>
          </div>
        )}

        {/* Agradecimento */}
        <p className={styles.thanks}>Boas compras, volte sempre!</p>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={styles.heart}
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>

        {/* Sair */}
        <button className={styles.signOut} onClick={onSignOut}>
          Sair do app
        </button>
      </div>
    </div>
  );
}
