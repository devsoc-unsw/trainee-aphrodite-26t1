import { ReviewModal } from "../components/reviewModal/reviewModal";
import { Sidebar } from "../components/sidebar/sidebar";
import styles from "./review.module.css";
import { useEffect, useRef, useState } from "react";
import type { Track } from "../spotify.types";
import { getSong } from "../api/songs";
import DustEffect from "../components/DustEffect";

function extractSpotifyId(url: string) {
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

const ReviewPage = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [song, setSong] = useState<Track | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!url.trim()) { setStatus("idle"); setSong(null); return; }

    const id = extractSpotifyId(url);
    if (!id) { setStatus("invalid"); setSong(null); return; }

    setStatus("loading");
    clearTimeout(debounceRef.current!);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await getSong(id);
        setSong(data);
        setStatus("valid");
        setReviewModalOpen(true);
      } catch {
        setStatus("invalid");
      }
    }, 500);
  }, [url]);

  const submitReview = (text: string, rating: number) => {
    setError("");
    if (!text || text.trim() === "") { setError("Review text may not be empty"); return; }
    if (!rating || rating === 0) { setError("Rating may not be 0"); return; }

    fetch(`http://localhost:3000/api/reviews/${song?.id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text, rating })
    })
      .then(res => res.json().then(data => ({ res, data })))
      .then(({ res, data }) => {
        if (!res.ok) throw new Error(data.error || "Failed to submit review");
        setReviewModalOpen(false);
        setUrl("");
      })
      .catch(err => setError(err.message));
  };

  return (
    <div className={styles.container}>
      <DustEffect />
      <Sidebar/>
      <main className={styles.main}>
        <h1 className={styles.title}>What song would you like<br />to review <em>today?</em></h1>
        <p className={styles.subtitle}>paste a spotify link to get started</p>
        <div className={styles["input-wrap"]}>
          <input
            className={styles["link-input"]}
            type="text"
            placeholder="https://open.spotify.com/track/..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            spellCheck={false}
          />
        </div>
        <p className={styles.hint}>
          {status === "loading" && "Fetching song..."}
          {status === "invalid" && "Invalid Spotify track link"}
          {status === "idle" && "Only Spotify track links are supported right now"}
        </p>
      </main>
      {reviewModalOpen && song && (
        <ReviewModal
          songName={song.name}
          artistName={song.artists[0]?.name ?? "Unknown Artist"}
          img={song.album.images[0]?.url ?? "/spotify.svg"}
          onClose={() => { setReviewModalOpen(false); setUrl(""); }}
          onSubmit={submitReview}
          error={error}
        />
      )}
    </div>
  );
};

export { ReviewPage };