import { Sidebar } from "../components/sidebar/sidebar";
import styles from "./explore.module.css"
import SearchBar from "../components/searchbar/Searchbar";
import { SongItem } from "../components/songitem/songitem";
import { useNavigate } from "react-router";

export default function ExplorePage() {
  const navigate = useNavigate();
  const onSubmit = (query: string) => {
    if (!query) return;
    navigate("/search?" + new URLSearchParams({ q: query }).toString());
  }

  return (
    <div className={styles.container}>
      <Sidebar accountName="account name" />

      <main className={styles.main}>
        <SearchBar placeholder="Search for a song or user..." onSubmit={onSubmit} />

        <section>
          <h2 className={styles.sectionTitle}>Trending</h2>
          <div className={styles.songs}>
            {Array(4).fill(0).map((_, i) => (
              <SongItem key={i} name="Song Name" artist="artist" rating={5} />
            ))}
          </div>
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Top songs</h2>
          <div className={styles.songs}>
            {Array(4).fill(0).map((_, i) => (
              <SongItem key={i} name="Song Name" artist="artist" rating={5} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}