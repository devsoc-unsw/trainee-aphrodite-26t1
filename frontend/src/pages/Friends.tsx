import { useState, useEffect } from "react";
import { LargeCard } from "../components/largecard/largecard";
import { Sidebar } from "../components/sidebar/sidebar";
import styles from "./friends.module.css"
import SearchBar from "../components/searchbar/SearchBar";
import { Link } from "react-router";
import { findUsers, getFriends } from "../api/users.ts"

interface DisplayUser {
  displayName: string,
  username: string
}

export default function FriendsPage() {
  const [searchResults, setSearchResults] = useState<DisplayUser[]>([]);
  const [friends, setFriends] = useState<DisplayUser[]>([]);
  const onSubmit = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const data = await findUsers(query)
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
      <Sidebar accountName="account name" />

      <main className={styles.main}>
        <SearchBar placeholder="Search for a friend..." onSubmit={onSubmit}/>
        <section>
          <h2 className={styles.sectionTitle}>{searchResults.length > 0 ? "Search Results" : "My Friends"}</h2>
          <div className={styles.users}>
            {searchResults.length > 0 ? searchResults.map((user, i) => (
              <Link key={i} className={styles.link} to={"/users/" + user.username}>
                <LargeCard imageType="circle" title={user.displayName} artist={user.username} />
              </Link>
              
            )) : friends.map((user, i) => (
              <Link key={i} className={styles.link} to={"/users/" + user.username}>
                <LargeCard imageType="circle" title={user.displayName} artist={user.username} />
              </Link>
              
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}