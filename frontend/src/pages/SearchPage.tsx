import { useEffect, useState } from "react";
import SearchBar from "../components/searchbar/Searchbar";
import { Sidebar } from "../components/sidebar/sidebar";
import { SongItem } from "../components/songitem/songitem";
import styles from "./search.module.css"
import { LargeCard } from "../components/largecard/largecard";
import { Link, useSearchParams } from "react-router";
import { Button } from "../components/button/Button";
import type { Track } from "../spotify.types";

type SearchType = "all" | "users" | "songs";
function isSearchType(type: string | null): type is SearchType {
  return (type === "all" || type === "users" || type === "songs");
}

interface DisplayUser {
  displayName: string,
  username: string
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q");
  const typeParam = searchParams.get("type");

  const [songResults, setSongResults] = useState<Track[]>([]);
  const [userResults, setUserResults] = useState<DisplayUser[]>([]);
  const [type, setType] = useState<SearchType>(isSearchType(typeParam) ? (typeParam || "all") : "all");

  const onSubmit = (query: string) => {
    const url = new URLSearchParams(searchParams);
    url.set("q", query);
    setSearchParams(url);
    if (!query) {
      setSongResults([]);
      setUserResults([]);
      return;
    }
    // fetch song search
    if (type !== "users") {
      fetch("http://localhost:3000/api/search/?q=" + query)
        .then(res => res.json())
        .then((data: {tracks: Track[]}) => {
          if (data?.tracks?.length > 0) {
            setSongResults(data.tracks);
          }
        })
        .catch(console.error);
    }
    // fetch user search
    if (type !== "songs") {
      setUserResults(Array(4).fill({ displayName: query, username: "@username" }));
    }
    
  }

  // this shouldn't cause cascading renders as it only runs on mount to do the initial search based on query params
  useEffect(() => {
    if (queryParam) onSubmit(queryParam);
  }, []);


  const updateType = (t: SearchType) => {
    setType(t);
    const url = new URLSearchParams(searchParams);
    url.set("type", t);
    setSearchParams(url);
  }
  return (
    <div className={styles.container}>
      <Sidebar accountName="account name" />

      <main className={styles.main}>
        <SearchBar placeholder="Search for a song or user..." onSubmit={onSubmit} />
        <div className={styles.buttons}>
          <Button active={type === "all"} onClick={() => updateType("all")}>All</Button>
          <Button active={type === "songs"} onClick={() => updateType("songs")}>Songs</Button>
          <Button active={type === "users"} onClick={() => updateType("users")}>Users</Button>
        </div>
        <h2 className={styles.sectionTitle}>
          {(songResults.length === 0 && userResults.length === 0) ? "No results found" :
            type !== "all" ? "Search Results" :"Songs"}
        </h2>
        <div className={styles.songs} style={{ display: (type !== "users" && songResults.length > 0) ? "flex" : "none" }}>
            {songResults.map((track, i) => (
              <Link key={i} className={styles.link} to={"/songs/" + track.id}>
                <SongItem name={track.name} artist={track.artists[0].name} imageUrl={track.album?.images?.[0]?.url} rating={5} />
              </Link>
            ))}
          </div>
          <h2 className={styles.sectionTitle} style={{display: (type === "all" && userResults.length > 0) ? "initial" : "none"}}>Users</h2>
        <div className={styles.users} style={{ display: (type !== "songs" && userResults.length > 0) ? "flex" : "none" }}>
          {userResults.map((user, i) => (
            <Link key={i} className={styles.link} to={"/users/" + user.username}>
              <LargeCard imageType="circle" title={user.displayName} artist={user.username} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}