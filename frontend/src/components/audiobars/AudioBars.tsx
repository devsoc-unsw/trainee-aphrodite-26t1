import styles from './audiobars.module.css'

const bars = Array.from({ length: 40 }, () => ({
  width: Math.random() * 400 + 50,
  duration: Math.random() * 5 + 4.5,
}));

export default function AudioBars() {
  return (
    <div className={styles.audiobars}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className={styles.bar}
          style={{
            "--w": `${bar.width}px`,
            "--duration": `${bar.duration}s`,
          } as React.CSSProperties } 
        />
      ))}
    </div>
  )
}