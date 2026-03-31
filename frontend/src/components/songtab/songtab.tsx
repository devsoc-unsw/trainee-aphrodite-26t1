import { RatingStars } from "../ratingStars/ratingStars";
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
      <RatingStars rating={rating} />
    </div>
  )
}