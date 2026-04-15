import { useState } from "react";
import { RatingStars } from "../ratingStars/ratingStars";
import styles from "./reviewitem.module.css";
import { LikeHeart } from "../likeHeart/likeHeart";

interface ReviewItemInfo {
  name: string,
  artist: string,
  rating: number,
  description?: string
}

const CHAR_LIMIT = 200;

export function ReviewItem({ name, rating, description }: ReviewItemInfo) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  const isLong = description && description.length > CHAR_LIMIT;
  const displayText = isLong && !expanded
    ? description.slice(0, CHAR_LIMIT) + "…"
    : description;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.profile}></div>
        <div className={styles.body}>
          <div className={styles.commentHeader}>
            <div className={styles.title}>Review by {name}</div>
            <RatingStars rating={rating} size={14} />
          </div>
          {description ? <div className={styles.description}>
            {displayText}
            {isLong && (
              <button
                className={styles.seeMoreBtn}
                onClick={() => setExpanded(prev => !prev)}
              >
                {expanded ? "See less" : "See more"}
              </button>
            )}
          </div> : null}
          <div className={styles.interactions}>
            <LikeHeart liked={liked} setLiked={setLiked} interactable={true}/>
            <div className={styles.likeText}>Like Review</div>
            <div className={styles.likeText}>67 Likes</div>

          </div>
        </div>

      </div>
      <hr className={styles.divider} />
    </div>

  )
}