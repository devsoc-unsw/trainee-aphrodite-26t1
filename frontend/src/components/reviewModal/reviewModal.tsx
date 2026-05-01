import { useState } from "react";
import { RatingStars } from "../ratingStars/ratingStars";
import styles from "./reviewModal.module.css";
import { Button } from "../button/Button";

interface ReviewModalProps {
  songName: string;
  artistName: string;
  img: string;
  onClose: () => void;
  error?: string;
  onSubmit: (text: string, rating: number) => void;
}


export function ReviewModal({ songName, artistName, img, onClose, onSubmit, error }: ReviewModalProps) {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

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
            <h1 className={styles.modalName}>{songName}</h1>
            <p className={styles.artistName}>{artistName}</p>
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
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Button onClick={onClose} buttonStyle="outline">Cancel</Button>
          <Button onClick={() => onSubmit(reviewText, reviewRating)} buttonStyle="accent">Submit Review</Button>
        </div>
        <span className={styles.error} style={
          (error && error !== "") ?
          { display: "initial"} :
          {display: "none"}
        }>{error}</span>
      </div>
    </div>
  );
}