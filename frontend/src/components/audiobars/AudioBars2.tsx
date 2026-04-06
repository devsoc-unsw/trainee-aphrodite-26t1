import styles from './audiobars2.module.css'

const bars = Array.from({ length: 80 }, () => ({
  width: Math.random() * 375 + 25,
  duration: Math.random() * 5 + 4.5,
}));

export default function AudioBars2() {
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
