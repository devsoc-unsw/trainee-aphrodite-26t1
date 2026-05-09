import { useState } from "react";
import { RatingStars } from "../ratingStars/ratingStars";
import styles from "./reviewitem.module.css";
import { LikeHeart } from "../likeHeart/likeHeart";
import type { DisplayReview } from "../../../../backend/src/types/api.types";

interface ReviewItemInfo {
  review: DisplayReview;
  onDelete?: () => void;
}

const CHAR_LIMIT = 200;

export function ReviewItem({ review, onDelete }: ReviewItemInfo) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  const isLong = review.body && review.body.length > CHAR_LIMIT;
  const displayText = isLong && !expanded
    ? review.body.slice(0, CHAR_LIMIT) + "…"
    : review.body;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.profile}></div>
        <div className={styles.body}>
          <div className={styles.commentHeader}>
            <div className={styles.title}>Review by {review.user.username}</div>
            <RatingStars rating={review.rating} size={14} />
          </div>
          {review.body ? <div className={styles.description}>
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
            <div className={styles.likeText}>{review.likeCount}</div>
            {onDelete && (
              <button className={styles.seeMoreBtn} onClick={onDelete} style={{ marginLeft: "auto", color: "var(--red-500)" }}>
                Delete
              </button>
            )}
          </div>
        </div>

      </div>
      <hr className={styles.divider} />
    </div>

  )
}