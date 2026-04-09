import { useState } from "react";
import styles from "./Login.module.css";

export function Login({ onEnter }) {
  const [name, setName] = useState("");
  const [shake, setShake] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) {
      onEnter(name.trim());
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* Blobs decorativos */}
      <div className={styles.blobPink} aria-hidden="true" />
      <div className={styles.blobLavender} aria-hidden="true" />

      <div className={styles.card}>
        {/* Logo stamp */}
        <div className={styles.logoWrap}>
          <img
            src={`${import.meta.env.BASE_URL}icons/icon.svg`}
            alt="Listinha logo"
            className={styles.logoImg}
          />
        </div>

        {/* Título */}
        <h1 className={styles.title}>
          Listinha<span className={styles.titleDot}>.</span>
        </h1>

        {/* Underline tracejado */}
        <div className={styles.titleUnderline} aria-hidden="true" />

        <p className={styles.subtitle}> SUA LISTA DE COMPRAS </p>

        {/* Divisor com círculo */}
        <div className={styles.divider} aria-hidden="true">
          <div className={styles.dividerLine} />
          <div className={styles.dividerCircle} />
          <div className={styles.dividerLine} />
        </div>

        {/* Boas vindas */}
        <div className={styles.welcomeText}>
          <p className={styles.welcomeLine1}>Bem-vindo! Como</p>
          <p className={styles.welcomeLine2}>posso te chamar?</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div
            className={`${styles.inputWrapper} ${shake ? styles.shake : ""}`}
          >
            <input
              id="login-name"
              type="text"
              placeholder="Digite seu nome..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              autoFocus
              maxLength={30}
              autoComplete="off"
            />
          </div>

          <button type="submit" className={styles.btn}>
            Entrar
          </button>
        </form>

        {/* Footer badge */}
        <div className={styles.footerBadge}>
          <p className={styles.footerText}> Organizado com carinho </p>
        </div>
      </div>
    </div>
  );
}
