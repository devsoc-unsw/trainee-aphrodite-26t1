import { Sidebar } from "../components/sidebar/sidebar";
import styles from "./explore.module.css"
import SearchBar from "../components/searchbar/SearchBar";
import { SongItem } from "../components/songitem/songitem";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { Song } from "../../../backend/src/types/api.types";
import DustEffect from "../components/DustEffect";

export default function ExplorePage() {
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);

  const navigate = useNavigate();
  const onSubmit = (query: string) => {
    if (!query) return;
    navigate("/search?" + new URLSearchParams({ q: query }).toString());
  }

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

  return (
    <div className={styles.container}>
      <Sidebar/>
      <DustEffect />
      <main className={styles.main}>
        <SearchBar placeholder="Search for a song or user..." onSubmit={onSubmit} />

        <section>
          <h2 className={styles.sectionTitle}>Trending</h2>
          <div className={styles.songs}>
            {recentSongs.length > 0 ? recentSongs.map((track, i) => (
              <Link key={track.id || i} to={"/songs/" + track.id} className={styles.songLink}>
                <SongItem name={track.name} artist={track.artists?.[0]?.name} imageUrl={track.album?.images?.[0]?.url} rating={Math.round(track.averageRating || 5)} />
              </Link>
            )) : Array(5).fill(0).map((_, i) => (<SongItem key={i} name="Loading..." artist="" rating={5} />))}
          </div>
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Top songs</h2>
          <div className={styles.songs}>
            {recommendedSongs.length > 0 ? recommendedSongs.map((track, i) => (
              <Link key={track.id || i} to={"/songs/" + track.id} className={styles.songLink}>
                <SongItem name={track.name} artist={track.artists?.[0]?.name} imageUrl={track.album?.images?.[0]?.url} rating={Math.round(track.averageRating || 5)} />
              </Link>
            )) : Array(5).fill(0).map((_, i) => (<SongItem key={i} name="Loading..." artist="" rating={5} />))}
          </div>
        </section>
      </main>
    </div>
  );
}