import { useState } from "react";
import styles from "./ratingStars.module.css";

interface RatingStarsProps {
  rating: number;
  setRating?: React.Dispatch<React.SetStateAction<number>>;
  interactable?: boolean;
}

const RatingStars = ({ rating, setRating, interactable } : RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState<number|null>(rating);
  return (
    <div className={styles.ratingStars} onMouseLeave={() => setHoverRating(null)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          onMouseEnter={() => setHoverRating(i + 1)}
          onClick={() => { if (interactable && setRating) setRating(i + 1) }}
          className={ i < (hoverRating && interactable ? hoverRating : rating) ? styles.starActive : styles.star }
          viewBox="0 0 33 32"
          fill="currentColor"
        >
          <path d="M14.5818 1.09082C15.3241 -0.363682 17.4024 -0.363685 18.1447 1.09082L21.7463 8.14818C22.0369 8.71762 22.5822 9.11382 23.2136 9.21423L31.0385 10.4587C32.6512 10.7152 33.2934 12.6918 32.1395 13.8472L26.5405 19.4534C26.0887 19.9057 25.8804 20.5468 25.9801 21.1783L27.2145 29.0048C27.4689 30.6178 25.7875 31.8394 24.3321 31.099L17.2701 27.5064C16.7003 27.2165 16.0263 27.2165 15.4564 27.5064L8.39447 31.099C6.93902 31.8394 5.25764 30.6178 5.51206 29.0048L6.74651 21.1783C6.84611 20.5468 6.63782 19.9057 6.18605 19.4534L0.587061 13.8472C-0.566875 12.6918 0.0753512 10.7152 1.68804 10.4587L9.51295 9.21423C10.1443 9.11382 10.6896 8.71762 10.9802 8.14818L14.5818 1.09082Z" />

        </svg>
      ))}
    </div>
  )
}

export { RatingStars };