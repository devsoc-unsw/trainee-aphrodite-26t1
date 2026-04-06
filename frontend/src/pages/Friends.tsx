import { useState } from "react";
import { LargeCard } from "../components/largecard/largecard";
import { Sidebar } from "../components/sidebar/sidebar";
import styles from "./friends.module.css"
import SearchBar from "../components/searchbar/SearchBar";
import { Link } from "react-router";

interface DisplayUser {
  displayName: string,
  username: string
}

export default function FriendsPage() {
  const [searchResults, setSearchResults] = useState<DisplayUser[]>([]);
  const onSubmit = (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setSearchResults(Array(4).fill({ displayName: query, username: "@username"}));
  }

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
              
            )) : Array(10).fill(0).map((_, i) => (
              <Link key={i} className={styles.link} to={"/users/" + "@username"}>
                <LargeCard imageType="circle" title="User Name" artist="@username" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}