import { RatingStars } from "../ratingStars/ratingStars";
import styles from "./songitem.module.css";

interface SongItemInfo {
  name: string,
  artist: string,
  rating: number,
  imageUrl?: string
}

export function SongItem({ name, artist, rating, imageUrl }: SongItemInfo) {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        {imageUrl ?
          (<img src={imageUrl} alt={name} className={styles.image}/>) :
          (<div className={styles.image}></div>)
        }
        <div>
          <div className={styles.title}>{name}</div>
          <div className={styles.artist}>{artist}</div>
        </div>
      </div>
      <RatingStars rating={rating} />
    </div>
  )
}