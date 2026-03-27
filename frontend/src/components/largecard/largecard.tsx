import styles from "./largecard.module.css";

export function LargeCard({ title, imageUrl, artist }: { title: string, imageUrl?: string, artist?: string }) {
  return (
    <div className={styles.card}>
      {imageUrl ? 
        (<img src={imageUrl} alt={title} className={styles.cardArt} />) :
        (<div className={styles.cardArt}></div>)
      }
      <div className={styles.cardTitle}>{title}</div>
      {artist ? <div className={styles.cardArtist}>{artist}</div> : null}
    </div>
  )
}