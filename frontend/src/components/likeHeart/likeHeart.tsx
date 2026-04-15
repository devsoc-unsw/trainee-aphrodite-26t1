import { useState } from "react";
import styles from "./likeHeart.module.css";

interface LikeHeartProps {
  liked: boolean;
  setLiked?: React.Dispatch<React.SetStateAction<boolean>>;
  interactable?: boolean;
}

const LikeHeart = ({ liked, setLiked, interactable }: LikeHeartProps) => {
  const [hoverLiked, setHoverLiked] = useState(false);

  const active = interactable ? hoverLiked || liked : liked;

  return (
    <svg
      onMouseEnter={() => setHoverLiked(true)}
      onMouseLeave={() => setHoverLiked(false)}
      onClick={() => { if (interactable && setLiked) setLiked(prev => !prev) }}
      className={active ? styles.heartActive : styles.heart}
      viewBox="0 0 32 32"
      fill="currentColor"
    >
      <path d="M16 28.5C16 28.5 2 20 2 10.5C2 6.36 5.36 3 9.5 3C11.9 3 14.05 4.15 15.45 5.95L16 6.65L16.55 5.95C17.95 4.15 20.1 3 22.5 3C26.64 3 30 6.36 30 10.5C30 20 16 28.5 16 28.5Z" />
    </svg>
  );
};

export { LikeHeart };