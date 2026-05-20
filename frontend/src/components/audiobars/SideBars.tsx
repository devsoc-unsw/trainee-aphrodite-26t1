import styles from './sidebars.module.css'

const bars = Array.from({ length: 50 }, () => ({
  width: Math.random() * 80 + 30,
  duration: Math.random() * 5 + 4.5,
}));

export default function SideBars() {
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
