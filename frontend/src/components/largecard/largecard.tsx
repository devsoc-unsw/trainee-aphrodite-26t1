import styles from "./largecard.module.css";

interface LargeCardProps {
  title: string,
  imageUrl?: string,
  artist?: string,
  imageType: 'circle' | 'square'
}

export function LargeCard({ title, imageUrl, artist, imageType }: LargeCardProps) {
  return (
    <div className={styles.card}>
      {imageUrl ? 
        (<img src={imageUrl} alt={title} className={`${styles.image} ${imageType == 'circle' ? styles.imageCircle : styles.imageSquare}`} />) :
        (<div className={`${styles.image} ${imageType == 'circle' ? styles.imageCircle : styles.imageSquare}`}></div>)
      }
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        {artist ? <div className={styles.artist}>{artist}</div> : null}
      </div>
    </div>
  )
}