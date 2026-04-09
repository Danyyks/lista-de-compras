import { useRef } from "react";
import styles from "./Usuario.module.css";

export function Usuario({
  userName,
  userPhoto,
  onSavePhoto,
  onRemovePhoto,
  onSignOut,
  darkMode,
  onSetTheme,
}) {
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 200;
        const ratio = Math.min(MAX / img.width, MAX / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        canvas
          .getContext("2d")
          .drawImage(img, 0, 0, canvas.width, canvas.height);
        onSavePhoto(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const isLight = darkMode === false;
  const isDark = darkMode === true;
  const isAuto = darkMode === null || darkMode === undefined;

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <h2 className={styles.pageTitle}>
          Listinha<span className={styles.pageTitleDot}>.</span>
        </h2>

        {/* Foto de perfil */}
        <div className={styles.avatarSection}>
          <button
            className={styles.avatarBtn}
            onClick={() => fileInputRef.current?.click()}
            title="Clique para trocar a foto"
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="Foto de perfil"
                className={styles.avatarImg}
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
              </div>
            )}
            <div className={styles.avatarOverlay}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="13"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </button>

          <div
            className={styles.avatarEditBadge}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Editar foto"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
            aria-label="Upload de foto de perfil"
          />
          {userPhoto && (
            <button className={styles.removePhoto} onClick={onRemovePhoto}>
              Remover foto
            </button>
          )}
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
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="12"
                    y1="2"
                    x2="12"
                    y2="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="19"
                    x2="12"
                    y2="22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="2"
                    y1="12"
                    x2="5"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="19"
                    y1="12"
                    x2="22"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="4.22"
                    y1="4.22"
                    x2="6.34"
                    y2="6.34"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="17.66"
                    y1="17.66"
                    x2="19.78"
                    y2="19.78"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="19.78"
                    y1="4.22"
                    x2="17.66"
                    y2="6.34"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="6.34"
                    y1="17.66"
                    x2="4.22"
                    y2="19.78"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className={styles.themeCardLabel}>Light Mode</span>
            </button>

            <button
              className={`${styles.themeCard} ${isDark ? styles.themeCardActive : ""}`}
              onClick={() => onSetTheme(true)}
            >
              <span className={styles.themeCardIcon}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={styles.themeCardLabel}>Dark Mode</span>
            </button>

            <button
              className={`${styles.themeCard} ${isAuto ? styles.themeCardActive : ""}`}
              onClick={() => onSetTheme(null)}
            >
              <span className={styles.themeCardIcon}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 3v18M3 12h9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 3a9 9 0 010 18z"
                    fill="currentColor"
                    opacity="0.2"
                  />
                </svg>
              </span>
              <span className={styles.themeCardLabel}>Auto</span>
            </button>
          </div>
        </div>

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
