import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Sidebar } from "../components/sidebar/sidebar";
import { RatingStars } from "../components/ratingStars/ratingStars";
import { Button, LinkButton } from "../components/button/Button";
import { ActionBar } from "../components/actionbar/ActionBar";

import styles from "./song.module.css"
import { ReviewItem } from "../components/reviewitem/ReviewItem";
import type { Song } from "../../../backend/src/types/api.types";
import { ReviewModal } from "../components/reviewModal/reviewModal";


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

  useEffect(() => {
    fetch("http://localhost:3000/api/songs/" + songId)
      .then(res => res.json())
      .then((track: Song) => {
        if (track) {
          setSongName(track.name);
          setArtistName(track.artists[0].name);
          setImg(track.album.images[0].url);
          setLikes(track.likeCount);
          setCommentNo(track.reviewCount);
          setRating(Math.round(track.averageRating));
          setAverageRating(track.averageRating);
        }
      })
      .catch(console.error);
  }, [songId]);
  useEffect(() => {
    // post new rating to backend
  }, [rating]);
  useEffect(() => {
    // post liked state to backend
  }, [liked]);

  const like = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    }
    else {
      setLikes(likes + 1);
      setLiked(true);
    }
  }

  return (
    <div className={styles.container}>
      <Sidebar accountName="account name" />
        <main className={styles.main}>
          <div className={styles.header}>
            <img src={img} className={styles.headerImg} alt="Spotify" />
            <div className={styles.headerInfo}>
            <h1 className={styles.songTitle}>{songName}</h1>
            <p className={styles.subText}>{artistName}</p>
              <p className={styles.subText}>Genre</p>
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
          <div className={styles.reviewBody}>
            A heartfelt ballad about falling in love at the DevSoc Training Program. Listen along as code becomes a love language for Andy and Zitian at UNSW.
          </div>

          {/* Popular Reviews Section */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Popular Reviews</h2>
            <div className={styles.buttons}>
              <Button>View More</Button>
            </div>
          </div>
          <hr />
          <div className={styles.reviews}>
          {new Array(3).fill(0).map((_, i) => (<ReviewItem key={i} name="username" artist="thing" rating={3} description="At DevSoc, there are good programmers… and then there’s Andy. Allegedly a “super genius,” he writes code so fast even his bugs have bugs—and somehow still pass tests. Between speedrunning assignments, arguing about tabs vs spaces like it’s a moral philosophy debate, and carrying group projects harder than recursion carries bad code, Andy has accidentally built a following. Not because he’s trying to—he’s just trying to submit before the deadline closes—but somehow every late-night coding session turns into chaos, competition, and a suspicious number of people wanting “help” that lasts way longer than it should. In a world of infinite edge cases, Andy is about to discover that the hardest thing to debug… isn’t code." />))}
          </div>

          {/* Recent Reviews section */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Reviews</h2>
            <div className={styles.buttons}>
              <Button>View More</Button>
            </div>
          </div>
          <hr />
          <div className={styles.reviews}>
          {new Array(3).fill(0).map((_, i) => (<ReviewItem key={i} name="username" artist="thing" rating={3} description="At DevSoc, there are good programmers… and then there’s Andy. Allegedly a “super genius,” he writes code so fast even his bugs have bugs—and somehow still pass tests. Between speedrunning assignments, arguing about tabs vs spaces like it’s a moral philosophy debate, and carrying group projects harder than recursion carries bad code, Andy has accidentally built a following. Not because he’s trying to—he’s just trying to submit before the deadline closes—but somehow every late-night coding session turns into chaos, competition, and a suspicious number of people wanting “help” that lasts way longer than it should. In a world of infinite edge cases, Andy is about to discover that the hardest thing to debug… isn’t code." />))}
          </div>

          {/* User's review */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Review</h2>
            <div className={styles.buttons}>
            </div>
          </div>
          <hr />
          <div className={styles.reviews}>
          <ReviewItem name="username" artist="thing" rating={3} description="At DevSoc, there are good programmers… and then there’s Andy. Allegedly a “super genius,” he writes code so fast even his bugs have bugs—and somehow still pass tests. Between speedrunning assignments, arguing about tabs vs spaces like it’s a moral philosophy debate, and carrying group projects harder than recursion carries bad code, Andy has accidentally built a following. Not because he’s trying to—he’s just trying to submit before the deadline closes—but somehow every late-night coding session turns into chaos, competition, and a suspicious number of people wanting “help” that lasts way longer than it should. In a world of infinite edge cases, Andy is about to discover that the hardest thing to debug… isn’t code." />
          </div>
        </main>

        {reviewModalOpen && (
          <ReviewModal
            onClose={() => setReviewModalOpen(false)}
          />
        )}
      </div>
  );
}
