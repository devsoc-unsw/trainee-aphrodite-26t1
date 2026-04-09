import { useState, useEffect } from "react";
import styles from "./home.module.css"
import type { Track } from "../spotify.types";
import { Sidebar } from "../components/sidebar/sidebar";
import { LargeCard } from "../components/largecard/largecard";
import { SongItem } from "../components/songitem/songitem";
import { Link, useNavigate } from "react-router";
import SearchBar from "../components/searchbar/SearchBar";


export default function Home() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/home", { replace: true });
    }
  }, []);

  const [topSongs, setTopSongs] = useState<Track[]>([]);
  const navigate = useNavigate();
  const onSubmit = (query: string) => {
    if (!query) return;
    navigate("/search?" + new URLSearchParams({ q: query }).toString());
  }

  useEffect(() => {
    fetch("http://localhost:3000/api/recommended")
      .then(res => res.json())
      .then((data: { tracks: Track[] }) => {
        if (data.tracks) {
          setTopSongs(data.tracks);
        }
      })
      .catch(console.error);
  }, []);
  return (
    <div className={styles.container}>
      <Sidebar accountName="account name" />
      <main className={styles.main}>
        <SearchBar placeholder="Search for a song or user..." onSubmit={onSubmit} />
        <section>
          <h2 className={styles.sectionTitle}>Recommended Songs</h2>
          <div className={styles.recommendedGrid}>
            {topSongs.length > 0 ? topSongs.map((track, i) => (
              <Link key={track.id || i} to={"/songs/" + track.id} className={styles.songLink}>
                <LargeCard title={track.name} imageUrl={track.album?.images?.[0]?.url} imageType="square" artist={track.artists[0].name} />
              </Link>
              
            )) : Array(10).fill(0).map((_, i) => (
              <LargeCard imageType="square" key={i} title="Loading..." />
            ))}
          </div>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Recent Ratings</h2>
          <div className={styles.ratingsList}>
            {topSongs.length > 0 ? Array(5).fill(0).map((_, i) => (
              <Link key={i} to={"/songs/" + topSongs[i + 23].id} className={styles.songLink}>
                <SongItem name={topSongs[i + 23].name} artist={topSongs[i + 23].artists[0].name} imageUrl={topSongs[i + 23].album?.images?.[0]?.url} rating={5} />
              </Link>
            )) : Array(5).fill(0).map((_, i) => (<SongItem key={i} name="Loading..." artist="" rating={5}/>))}
          </div>
        </section>
      </main>
    </div>
  );
}
