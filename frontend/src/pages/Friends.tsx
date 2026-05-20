import { useState, useEffect } from "react";
import { LargeCard } from "../components/largecard/largecard";
import { Sidebar } from "../components/sidebar/sidebar";
import styles from "./friends.module.css"
import SearchBar from "../components/searchbar/SearchBar";
import { Link } from "react-router";
import { findUsers, getFriends } from "../api/users.ts"
import type { User } from "../../../backend/src/types/api.types";
import DustEffect from "../components/DustEffect.tsx";

export default function FriendsPage() {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const onSubmit = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const data = await findUsers(query)
    console.log(data)
    setSearchResults(data)
  }

  useEffect(() => { 
    async function fetchFriends() {
      const result = await getFriends()
      setFriends(result)
    }
    fetchFriends()
  }, [])

  return (
    <div className={styles.container}>
      <Sidebar/>
      <DustEffect />
      <main className={styles.main}>
        <SearchBar placeholder="Search for a friend..." onSubmit={onSubmit}/>
        <section>
          <h2 className={styles.sectionTitle}>{searchResults.length > 0 ? "Search Results" : "My Friends"}</h2>
          {(friends.length === 0 && searchResults.length === 0 ) && <div className={styles.noFriends}><img className={styles.star}src="lonelyStar.png"></img></div>}
          <div className={styles.users}>
            {searchResults.length > 0 ? searchResults.map((user, i) => (
              <Link key={i} className={styles.link} to={"/users/" + user.username}>
                <LargeCard imageUrl={user.profilePic} imageType="circle" title={user.username}/>
              </Link>
              
            )) : friends.map((user, i) => (
              <Link key={i} className={styles.link} to={"/users/" + user.username}>
                <LargeCard imageUrl={user.profilePic} imageType="circle" title={user.username}/>
              </Link>
              
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}