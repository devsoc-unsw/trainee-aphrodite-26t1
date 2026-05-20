import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Sidebar } from "../components/sidebar/sidebar";
import { RatingStars } from "../components/ratingStars/ratingStars";
import { Button, LinkButton } from "../components/button/Button";
import { ActionBar } from "../components/actionbar/ActionBar";

import styles from "./song.module.css"
import { ReviewItem } from "../components/reviewitem/ReviewItem";
import type { DisplayReview, Song } from "../../../backend/src/types/api.types";
import { ReviewModal } from "../components/reviewModal/reviewModal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function SongPage() {
  const params = useParams();
  const songId = params.songId;
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentNo, setCommentNo] = useState(0);
  const [songName, setSongName] = useState("Song Name");
  const [artistName, setArtistName] = useState("Artist");
  const [img, setImg] = useState("/spotify.svg");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [recentReviews, setRecentReviews] = useState<DisplayReview[]>([]);
  const [popularReviews, setPopularReviews] = useState<DisplayReview[]>([]);
  const [myReview, setMyReview] = useState<DisplayReview | null>(null);
  const [genre, setGenre] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(BACKEND_URL + "/api/songs/" + songId, token ? {
      headers: { "Authorization": `Bearer ${token}` }
    } : undefined)
      .then(res => res.json())
      .then((song: Song) => {
        if (song) {
          setSongName(song.name);
          setArtistName(song.artists[0].name);
          setImg(song.album.images[0].url);
          setLikes(song.likeCount);
          setCommentNo(song.reviewCount);
          setRating(Math.round(song.averageRating));
          setAverageRating(song.averageRating);
          setLiked(!!song.liked);
          setGenre(song.genres ?? [])
          console.log("Genres:",song.genres)
        }
      })
      .catch(console.error);
    fetch(BACKEND_URL + "/api/reviews/" + songId + "?sort=popular&limit=3", token ? {
      headers: { "Authorization": `Bearer ${token}` }
    } : undefined)
      .then(res => res.json())
      .then((reviews: DisplayReview[]) => {
        setPopularReviews(reviews);
      })
      .catch(console.error);
    fetch(BACKEND_URL + "/api/reviews/" + songId + "?sort=recent&limit=3", token ? {
      headers: { "Authorization": `Bearer ${token}` }
    } : undefined)
      .then(res => res.json())
      .then((reviews: DisplayReview[]) => {
        setRecentReviews(reviews);
      })
      .catch(console.error);
    
    if (token) {
      fetch(BACKEND_URL + "/api/reviews/" + songId + "/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then((review) => {
          if (review && !review.error) setMyReview(review);
        })
        .catch(console.error);
    }
  }, [songId]);
  useEffect(() => {
    // post new rating to backend
  }, [rating]);
  useEffect(() => {
    // post liked state to backend
  }, [liked]);

  const like = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const previousLiked = liked;
    const previousLikes = likes;

    setLiked(!previousLiked);
    setLikes(previousLiked ? previousLikes - 1 : previousLikes + 1);

    fetch(BACKEND_URL + "/api/songs/" + songId + "/like", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setLiked(data.liked);
        if (data.liked !== !previousLiked) {
           setLikes(data.liked ? previousLikes + 1 : previousLikes - 1);
        }
      })
      .catch((err) => {
        console.error(err);
        setLiked(previousLiked);
        setLikes(previousLikes);
      });
  }

  const submitReview = (text: string, rating: number) => {
    setError("");
    if (!text || text.trim() === "") {
      setError("Review text may not be empty");
      return;
    }
    if (!rating || rating === 0) {
      setError("Rating may not be 0");
      return;
    }

    fetch(BACKEND_URL + "/api/reviews/" + songId, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text, rating })
    })
      .then(res => res.json().then(data => ({ res, data })))
      .then(({ res, data }) => {
        if (!res.ok) {
          throw new Error(data.error || "Failed to submit review");
        }
        if (data.error) {
          throw new Error(data.error);
        }
        console.log("Success:", data);
        setReviewModalOpen(false);
        const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` };
        fetch(BACKEND_URL + "/api/reviews/" + songId + "?sort=popular&limit=3", { headers })
          .then(res => res.json())
          .then(setPopularReviews)
          .catch(console.error);
        fetch(BACKEND_URL + "/api/reviews/" + songId + "?sort=recent&limit=3", { headers })
          .then(res => res.json())
          .then(setRecentReviews)
          .catch(console.error);
        fetch(BACKEND_URL + "/api/songs/" + songId, { headers })
          .then(res => res.json())
          .then((track: Song) => {
            if (track) {
              setCommentNo(track.reviewCount);
              setRating(Math.round(track.averageRating));
              setAverageRating(track.averageRating);
            }
          })
          .catch(console.error);
        fetch(BACKEND_URL + "/api/reviews/" + songId + "/me", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
          .then(res => res.json())
          .then((review) => {
            if (review && !review.error) setMyReview(review);
          })
          .catch(console.error);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }

  const deleteMyReview = () => {
    fetch(BACKEND_URL + "/api/reviews/" + songId, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => {
        if (res.ok) {
          setMyReview(null);
          const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` };
          fetch(BACKEND_URL + "/api/reviews/" + songId + "?sort=popular&limit=3", { headers })
            .then(res => res.json()).then(setPopularReviews).catch(console.error);
          fetch(BACKEND_URL + "/api/reviews/" + songId + "?sort=recent&limit=3", { headers })
            .then(res => res.json()).then(setRecentReviews).catch(console.error);
          fetch(BACKEND_URL + "/api/songs/" + songId, { headers })
            .then(res => res.json())
            .then((track: Song) => {
              if (track) {
                setCommentNo(track.reviewCount);
                setRating(Math.round(track.averageRating));
                setAverageRating(track.averageRating);
              }
            }).catch(console.error);
        }
      })
      .catch(console.error);
  }

  return (
    <div className={styles.container}>
      <Sidebar/>
      <main className={styles.main}>
        <div className={styles.header}>
          <img src={img} className={styles.headerImg} alt="Spotify" />
          <div className={styles.headerInfo}>
            <h1 className={styles.songTitle}>{songName}</h1>
            <p className={styles.subText}>{artistName}</p>
            <p className={styles.subText}>{genre.map((g, i) => <span key={i}>{g}</span>)}</p>
            <div className={styles.headerBar}>
              <div className={styles.buttons}>
                <Button onClick={() => setReviewModalOpen(true)}>+ Write a review</Button>
                <LinkButton href={"https://open.spotify.com/track/" + songId} newTab>Listen on Spotify</LinkButton>
              </div>
              <div className={styles.actions}>
                <div className={styles.ratings}>
                  {averageRating.toFixed(1)}
                  <RatingStars rating={rating} setRating={setRating} interactable={false} />
                </div>
                <ActionBar likes={likes} comments={commentNo} liked={liked} onLike={like} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sectionHeader} style={{ display: popularReviews.length === 0 && recentReviews.length === 0 ? "initial" : "none" }}>
          <h2 className={styles.sectionTitle}>No Reviews Yet!</h2>
        </div>
        {/* Popular Reviews Section */}
        <div className={styles.sectionHeader} style={{display: popularReviews?.length > 0 ? "flex" : "none"}}>
          <h2 className={styles.sectionTitle}>Popular Reviews</h2>
          <div className={styles.buttons}>
            <Button>View More</Button>
          </div>
        </div>
        <hr style={{ display: popularReviews?.length > 0 ? "initial" : "none" }} />
        <div className={styles.reviews} style={{ display: popularReviews?.length > 0 ? "flex" : "none" }}>
          {
            popularReviews.map((review, i) => <ReviewItem key={i} review={review} />)
          }
        </div>

        {/* Recent Reviews section */}
        <div className={styles.sectionHeader} style={{ display: recentReviews?.length > 0 ? "flex" : "none" }}>
          <h2 className={styles.sectionTitle}>Recent Reviews</h2>
          <div className={styles.buttons}>
            <Button>View More</Button>
          </div>
        </div>
        <hr style={{ display: recentReviews?.length > 0 ? "initial" : "none" }} />
        <div className={styles.reviews} style={{ display: recentReviews?.length > 0 ? "initial" : "none" }}>
          {
            recentReviews && recentReviews.map((review, i) => <ReviewItem key={i} review={review} />)
          }
        </div>

        {/* User's review */}
        {myReview && (
          <>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Your Review</h2>
              <div className={styles.buttons}>
              </div>
            </div>
            <hr />
            <div className={styles.reviews}>
              <ReviewItem review={myReview} onDelete={deleteMyReview} />
            </div>
          </>
        )}
      </main>

      {reviewModalOpen && (
        <ReviewModal
          songName={songName}
          artistName={artistName}
          img={img}
          onClose={() => setReviewModalOpen(false)}
          onSubmit={submitReview}
          error={error}
        />
      )}
    </div>
  );
}
