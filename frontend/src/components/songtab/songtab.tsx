import styles from "./songtab.module.css";

interface SongTabInfo {
  name: string,
  artist: string,
  rating: number
}

export function SongTab({ name, artist, rating }: SongTabInfo) {
  return (
    <div className={styles.ratingRow}>
      <div className={styles.ratingArt}></div>
      <div className={styles.ratingInfo}>
        <div className={styles.ratingTitle}>{name}</div>
        <div className={styles.ratingArtist}>{artist}</div>
      </div>
      <div className={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map(i => (
          <svg
            key={i}
            className={i <= rating ? styles.starActive : styles.star}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    </div>
  )
}