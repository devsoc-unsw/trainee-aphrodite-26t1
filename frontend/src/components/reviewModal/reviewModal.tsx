import { useState } from "react";
import { RatingStars } from "../ratingStars/ratingStars";
import styles from "./reviewModal.module.css";
import { LikeHeart } from "../likeHeart/likeHeart";

interface ReviewModalProps {
//   songId: string;
//   songName: string;
  onClose: () => void;
//   onSubmitted: () => void;
}


export function ReviewModal({onClose} : ReviewModalProps) {
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [img, setImg] = useState("/spotify.svg");
    const [liked, setLiked] = useState(false);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>I listened to...</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.modalBody}>
          <img src={img} className={styles.songImg} alt="Spotify" />
          <div>
            <h1>Song Name</h1>
            <textarea
              className={styles.textarea}
              placeholder="Add a review..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              rows={5}
            />
            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                <span className={styles.label}>Rating</span>
                <RatingStars rating={reviewRating} setRating={setReviewRating} interactable={true} />
              </div>
              <div className={styles.like}>
                <span className={styles.label}>Like</span>
                <LikeHeart liked ={liked} setLiked={setLiked} interactable/>
              </div>
            </div>

          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose} >Cancel</button>
          <button className={styles.submitBtn}> Submit Review</button>
        </div>
      </div>
    </div>
  );
}