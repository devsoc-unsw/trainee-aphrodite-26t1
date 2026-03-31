import styles from "./ratingStars.module.css";

const RatingStars = () => {
  // TODO make stars interactable during rating 
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={styles.star}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
      ))}
    </div>
  )
}

export { RatingStars };