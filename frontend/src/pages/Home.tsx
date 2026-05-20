import { useState, useEffect } from "react";
import styles from "./home.module.css"
import type { Song } from "../../../backend/src/types/api.types";
import { Sidebar } from "../components/sidebar/sidebar";
import { LargeCard } from "../components/largecard/largecard";
import { SongItem } from "../components/songitem/songitem";
import { Link, useNavigate } from "react-router";
import SearchBar from "../components/searchbar/SearchBar";


export default function Home() {
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/home", { replace: true });
    }

    fetch("http://localhost:3000/api/songs?sort=recommended&limit=10")
      .then(res => res.json())
      .then(setRecommendedSongs)
      .catch(console.error);

    fetch("http://localhost:3000/api/songs?sort=recent&limit=5")
      .then(res => res.json())
      .then(setRecentSongs)
      .catch(console.error);
  }, []);

  const navigate = useNavigate();
  const onSubmit = (query: string) => {
    if (!query) return;
    navigate("/search?" + new URLSearchParams({ q: query }).toString());
  }

  return (
    <div className={styles.container}>
      <Sidebar/>
      <main className={styles.main}>
        <SearchBar placeholder="Search for a song or user..." onSubmit={onSubmit} />
        <section>
          <h2 className={styles.sectionTitle}>Recommended Songs</h2>
          <div className={styles.recommendedGrid}>
            {recommendedSongs.length > 0 ? recommendedSongs.map((track, i) => (
              <Link key={track.id || i} to={"/songs/" + track.id} className={styles.songLink}>
                <LargeCard title={track.name} imageUrl={track.album?.images?.[0]?.url} imageType="square" artist={track.artists?.[0]?.name} />
              </Link>
              
            )) : Array(10).fill(0).map((_, i) => (
              <LargeCard imageType="square" key={i} title="Loading..." />
            ))}
          </div>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Recently Rated</h2>
          <div className={styles.ratingsList}>
            {recentSongs.length > 0 ? recentSongs.map((track, i) => (
              <Link key={track.id || i} to={"/songs/" + track.id} className={styles.songLink}>
                <SongItem name={track.name} artist={track.artists?.[0]?.name} imageUrl={track.album?.images?.[0]?.url} rating={Math.round(track.averageRating || 5)} />
              </Link>
            )) : Array(5).fill(0).map((_, i) => (<SongItem key={i} name="Loading..." artist="" rating={5}/>))}
          </div>
        </section>
      </main>
    </div>
  );
}
