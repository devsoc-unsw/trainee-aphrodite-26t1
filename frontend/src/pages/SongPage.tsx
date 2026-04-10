import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Sidebar } from "../components/sidebar/sidebar";
import { RatingStars } from "../components/ratingStars/ratingStars";
import { Button, LinkButton } from "../components/button/Button";
import { ActionBar } from "../components/actionbar/ActionBar";

import styles from "./song.module.css"
import { ReviewItem } from "../components/reviewitem/ReviewItem";
import type { Song } from "../../../backend/src/types/api.types";


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
                  <Button>+ Write a review</Button>
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
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Reviews</h2>
            <div className={styles.buttons}>
              <Button>Top</Button>
              <Button>New</Button>
            </div>
          </div>
          <hr />
          <div className={styles.reviews}>
          {new Array(15).fill(0).map((_, i) => (<ReviewItem key={i}to="/reviews/testid" name="username" artist="thing" rating={3} description="“At DevSoc, there are good programmers… and then there’s Andy…”" />))}
          </div>
        </main>
      </div>
  );
}
