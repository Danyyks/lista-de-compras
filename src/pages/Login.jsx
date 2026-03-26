import { useState } from "react";
import styles from "./Login.module.css";

export function Login({ onEnter }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) onEnter(name.trim());
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Listinha</h1>
        <p className={styles.subtitle}>Compras Organizadas</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label className={styles.fieldLabel} htmlFor="login-name">
              Qual o seu nome?
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="login-name"
                type="text"
                placeholder="Ex: Erisvaldo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                autoFocus
                maxLength={30}
                autoComplete="off"
              />
              <span className={styles.inputIcon}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          <button type="submit" className={styles.btn} disabled={!name.trim()}>
            Entrar
          </button>
        </form>

        <p className={styles.hint}>Desde 2026</p>
      </div>
    </div>
  );
}
