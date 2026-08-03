import { useState } from "react";
import styles from "./Login.module.css";
import { LogoHorizontal } from "../components/Logo";

// Página de entrada do app: um único botão de login com Google.
// onEnter é chamado pelo App.jsx (via useAuth().signInWithGoogle).
export function Login({ onEnter }) {
  const [error, setError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleSignIn() {
    setError(null);
    setIsSigningIn(true);
    try {
      await onEnter();
    } catch {
      // Ex: usuário fechou o popup do Google antes de terminar o login.
      setError("Não foi possível entrar. Tente novamente.");
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* Blobs decorativos */}
      <div className={styles.blobPink} aria-hidden="true" />
      <div className={styles.blobLavender} aria-hidden="true" />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <LogoHorizontal fontSize={48} />
        </div>

        <p className={styles.subtitle}> SUA LISTA DE COMPRAS </p>

        {/* Divisor com círculo */}
        <div className={styles.divider} aria-hidden="true">
          <div className={styles.dividerLine} />
          <div className={styles.dividerCircle} />
          <div className={styles.dividerLine} />
        </div>

        {/* Boas vindas */}
        <div className={styles.welcomeText}>
          <p className={styles.welcomeLine1}>Bem-vindo!</p>
          <p className={styles.welcomeLine2}>Vamos organizar suas compras?</p>
        </div>

        <button
          type="button"
          className={styles.btn}
          onClick={handleSignIn}
          disabled={isSigningIn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className={styles.googleIcon}>
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0012 23z" />
            <path fill="#fff" d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.13-1.44.34-2.1V7.05H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.95l3.66-2.85z" />
            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 00-9.82 6.05l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          {isSigningIn ? "Entrando..." : "Entrar com Google"}
        </button>

        {error && <p className={styles.errorText}>{error}</p>}

        {/* Footer badge */}
        <div className={styles.footerBadge}>
          <p className={styles.footerText}> Organizado com carinho </p>
        </div>
      </div>
    </div>
  );
}
