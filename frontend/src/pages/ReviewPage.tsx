
import { Sidebar } from "../components/sidebar/sidebar";
import { RatingStars } from "../components/ratingStars/ratingStars";
import { ProfilePicture } from "../components/ProfilePicture/ProfilePicture";
import { Comment } from "../components/comment/comment";

import styles from "./review.module.css"
import { useState } from "react";
import { ActionBar } from "../components/actionbar/ActionBar";
import { Button } from "../components/button/Button";

const ReviewPage = () => {
  const [rating, setRating] = useState(3);
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
                  <ProfilePicture src="/samplepfp.jpg" />
                  <p className={styles.username}>Username (Reviewer)</p>
                  <RatingStars rating={rating} setRating={setRating} interactable={false} />
                  <ActionBar likes={69} comments={67} />
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
              <ProfilePicture src="/samplepfp.jpg" />
              <input
                type="text"
                className={styles.commentInput}
                placeholder="Add a comment"
              />
            </div>
            <Button>Comment</Button>
            {/* <button className={styles.commentButton}>Comment</button> */}
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