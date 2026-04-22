import { useState } from "react";
import { RatingStars } from "../ratingStars/ratingStars";
import styles from "./reviewModal.module.css";
import { LikeHeart } from "../likeHeart/likeHeart";
import type { Track } from "../../spotify.types";

interface ReviewModalProps {
  song: Track;
  onClose: () => void;
}


export function ReviewModal({ song, onClose } : ReviewModalProps) {
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [liked, setLiked] = useState(false);

    const albumArt = song.album.images[0]?.url ?? "/spotify.svg";
    const artistNames = song.artists.map(a => a.name).join(", ");


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
          <img src={albumArt} className={styles.songImg} alt="Spotify" />
          <div>
            <h1>{song.name}</h1>
            <p>{artistNames}</p>
            <p>{song.album.name} · {song.album.release_date.slice(0, 4)}</p>
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