import { useState, useEffect } from "react";
import styles from "./home.module.css"
import type { Track } from "../spotify.types";
import { Sidebar } from "../components/sidebar/sidebar";
import { LargeCard } from "../components/largecard/largecard";
import { SongTab } from "../components/songtab/songtab";
import { Link } from "react-router";


export default function Home() {
  const [topSongs, setTopSongs] = useState<Track[]>([]);

  // should run only the first time it renders
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
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for a song..."
          />
        </div>

        <section>
          <h2 className={styles.sectionTitle}>Recommended Songs</h2>
          <div className={styles.recommendedGrid}>
            {topSongs.length > 0 ? topSongs.map((track, i) => (
              <Link to={"/songs/" + track.id} className={styles.songLink}>
                <LargeCard key={track.id || i} title={track.name} imageUrl={track.album?.images?.[0]?.url} artist={track.artists[0].name} />
              </Link>
              
            )) : [1, 2, 3, 4, 5].map((i) => (
              <LargeCard key={i} title="Loading..." />
            ))}
          </div>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Recent Ratings</h2>
          <div className={styles.ratingsList}>
            {[1, 2].map(() => (
              <SongTab name="Song Name" artist="Artist" rating={5} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
