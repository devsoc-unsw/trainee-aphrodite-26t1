import { RatingStars } from "../ratingStars/ratingStars";
import styles from "./reviewitem.module.css";

interface ReviewItemInfo {
  name: string,
  artist: string,
  rating: number,
  description?: string
}

export function ReviewItem({ name, artist, rating, description }: ReviewItemInfo) {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.profile}></div>
        <div>
          <div className={styles.title}>{name}</div>
          <div className={styles.artist}>{artist}</div>
          </div>
        
      </div>
      {description ? <div className={styles.description}>{description}</div> : null}
      <RatingStars rating={rating} />
    </div>
  )
}