import styles from "./miniplayer.module.css";

export function Miniplayer() {
  return (
    <div className={styles.miniPlayerContainer}>
      <div className={styles.miniPlayerInner}>
        <div className={styles.miniPlayerArt}></div>
        <div className={styles.miniPlayerContent}>
          <div className={styles.miniPlayerText}>
            <div className={styles.playerTitle}>Song Name</div>
            <div className={styles.playerArtist}>Artist</div>
          </div>
          <div className={styles.miniPlayerControls}>
            <button className={styles.iconButton}>
              <svg className={styles.controlIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button className={styles.iconButton}>
              <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
            <button className={styles.iconButton}>
              <svg className={styles.controlIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <button className={styles.rateButton}>Rate Song</button>
    </div>
  )
}