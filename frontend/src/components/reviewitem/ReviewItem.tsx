import { useState, useEffect } from "react";
import { RatingStars } from "../ratingStars/ratingStars";
import styles from "./reviewitem.module.css";
import { LikeHeart } from "../likeHeart/likeHeart";
import type { DisplayReview } from "../../../../backend/src/types/api.types";
import { fetchAvatar, getUsername } from "../../api/users";

interface ReviewItemInfo {
  review: DisplayReview;
  onDelete?: () => void;
}

const CHAR_LIMIT = 200;

export function ReviewItem({ review, onDelete }: ReviewItemInfo) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(!!review.liked);
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [avatar, setAvatar] = useState("/samplepfp.png");
  const toggleLike = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    const previousLiked = liked;
    setLiked(!previousLiked);
    setLikeCount(prev => previousLiked ? prev - 1 : prev + 1);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/review/${review.id}/like`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setLiked(data.liked);
        if (data.liked !== !previousLiked) {
          setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
        }
      })
      .catch(err => {
        console.error(err);
        setLiked(previousLiked);
        setLikeCount(prev => previousLiked ? prev + 1 : prev - 1);
      });
  };

  useEffect(() => {
    const init = async () => {
      const profilepic = await fetchAvatar(review.user.username)
      setAvatar(profilepic)
    }
    init()
  },[])

  const isLong = review.body && review.body.length > CHAR_LIMIT;
  const displayText = isLong && !expanded
    ? review.body.slice(0, CHAR_LIMIT) + "…"
    : review.body;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <img className={styles.profile} src={avatar}></img>
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
            <LikeHeart liked={liked} setLiked={toggleLike as any} interactable={true}/>
            <div className={styles.likeText}>{likeCount}</div>
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