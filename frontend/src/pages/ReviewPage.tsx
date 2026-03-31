
import { Sidebar } from "../components/sidebar/sidebar";
import { RatingStars } from "../components/ratingStars/ratingStars";
import { Comment } from "../components/comment/comment";

import styles from "./review.module.css"

const ReviewPage = () => {
  return (
    <div className={styles.container}>
      <Sidebar accountName="account name" />

      <main className={styles.main}>
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for a song..."
          />
        </div>

        <div className={styles.content}>
          {/* Header */}
          <section>
            <div className={styles.header}>
              <img src="/spotify.svg" className={styles.headerImg} alt="Spotify" />
              <div className={styles.headerInfo}>
                <h1 className={styles.songTitle}>Song name</h1>
                <p className={styles.subText}>Artist</p>
                <p className={styles.subText}>Genre</p>
                <div className={styles.headerBar}>
                  <img src="/samplepfp.jpg" className={styles.profilePicture} alt="Profile picture" />
                  <p className={styles.username}>Username (Reviewer)</p>
                  <RatingStars />
                  <span className={styles.stat}>♡ 12</span>
                  <span className={styles.stat}>💬 12</span>
                  <span className={styles.stat}>↗</span>
                </div>
              </div>
            </div>
          </section>

          {/* Review */}
          <section>
            <div className={styles.reviewBody}>
              A heartfelt ballad about falling in love at the DevSoc Training Program. Listen along as code becomes a love language for Andy and Zitian at UNSW.
            </div>
          </section>

          {/* Comments */}
          <section>
            <h1>Comments</h1>
            <hr className="border-t border-gray-200" />
          {/* Input box - placeholder for now*/}

          <div className={styles.comment}>
            <img src="/samplepfp.jpg" className={styles.profilePicture} alt="Profile picture" />
            <input
              type="text"
              className={styles.commentInput}
              placeholder="Add a comment"
            />
          </div>
          <button className={styles.commentButton}>Comment</button>
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          </section>
        </div>


        

      </main>
    </div>
  )
}


export { ReviewPage };