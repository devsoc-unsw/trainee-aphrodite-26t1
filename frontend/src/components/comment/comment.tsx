import styles from "./comment.module.css"

export function Comment () {
  return (
    <div className={styles.body}>
      <div className={styles.header}>

        <img src="/samplepfp.jpg" className={styles.profilePicture} alt="Profile picture" />
        <div className={styles.headerInfo}>
          <p className={styles.username}>Username</p>
          <p className={styles.timestat}>1 day ago</p>
        </div>

      </div>
      <p className={styles.commentBody}>At DevSoc, there are good programmers… and then there’s Andy. Allegedly a “super genius,” he writes code so fast even his bugs have bugs—and somehow still pass tests. Between speedrunning assignments, arguing about tabs vs spaces like it’s a moral philosophy debate, and carrying group projects harder than recursion carries bad code, Andy has accidentally built a following. Not because he’s trying to—he’s just trying to submit before the deadline closes—but somehow every late-night coding session turns into chaos, competition, and a suspicious number of people wanting “help” that lasts way longer than it should. In a world of infinite edge cases, Andy is about to discover that the hardest thing to debug… isn’t code.</p>
      <div className={styles.interactions}>
        <span className={styles.stat}>♡ 12</span>
        <span className={styles.stat}>💬 12</span>
        <span className={styles.stat}>↗</span>
      </div>
    </div>
  )
}