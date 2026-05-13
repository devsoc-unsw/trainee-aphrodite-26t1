import { useState } from "react";
import { ActionBar } from "../components/actionbar/ActionBar";
import { Button } from "../components/button/Button";
import { Sidebar } from "../components/sidebar/sidebar"
import styles from "./profile.module.css"
import { ReviewItem } from "../components/reviewitem/ReviewItem";
import { Link } from "react-router";
import { useParams } from "react-router-dom";
import { handleFriendReq } from "../api/users.ts"


function ProfileCard({ to, children, imageUrl, description }: { to: string, children: React.ReactNode, imageUrl: string, description: string}) {
  return (
    <div className={styles.card}>
      <div>{children}</div>
      <Link to={to} className={styles.cardImage} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${imageUrl}")` }}>
        {description}
      </Link>
    </div>
  )
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const profileName = username ?? "User Not Found"
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isAdding, setFriends] = useState(false);
  const [img, setImg] = useState("/samplepfp.jpg");
  return (
    <div className={styles.container}>
      <Sidebar accountName="account name" />
      <main className={styles.main}>
        <div className={styles.header} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/samplebanner.png")`}}>
          <div className={styles.profileRow}>
            <div className={styles.avatarWrapper}>
              <img src={img} className={styles.avatarImg} alt="Spotify" />
              <div className={styles.avatarBadge}></div>
            </div> 
            
            <div className={styles.headerInfo}>
              <h1 className={styles.songTitle}>{profileName}</h1>
              <div className={styles.headerBar}>
                <div className={styles.headerStat}>
                  <div>14</div>
                  <div>reviews</div>
                </div>
                <div className={styles.headerStat}>
                  <div>67</div>
                  <div>friends</div>
                </div>
                <div className={styles.headerStat}>
                  <div>7</div>
                  <div>playlists</div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.profileRow} ${styles.grow}`}>
            <div>
              among us
            </div>
            <div className={styles.profileButtons}>
              <Button onClick={() => {const nextState = !isAdding; setFriends(!isAdding); handleFriendReq(profileName, nextState)}} active={isAdding}>{isAdding ? "Request Sent!" : "+ Add Friend"}</Button>
              <ActionBar likes={likes} comments={67} liked={liked} />
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.cards}>
            <ProfileCard to="/explore" imageUrl="/spotify.svg" description="hello"><span style={{ color: "#FF7272"}}>Favourite</span> song this week</ProfileCard>
            <ProfileCard to="/explore" imageUrl="/spotify.svg" description="hello"><span style={{ color: "#DCFF15" }}>Top</span> artist this month</ProfileCard>
            <ProfileCard to="/explore" imageUrl="/spotify.svg" description="hello"><span style={{ color: "#AF99FF"}}>Minutes</span> listened this week</ProfileCard>
          </div>
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Reviews</h2>
              <div className={styles.buttons}>
                <Button>Top</Button>
                <Button>New</Button>
              </div>
            </div>
            <hr />
            <div className={styles.reviews}>
              {new Array(3).fill(0).map((_, i) => (
                <ReviewItem
                  key={i}
                  review={{
                    to: "/reviews/testid",
                    songId: "test",
                    rating: 3,
                    body: "At DevSoc, there are good programmers…",
                    likeCount: 0,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    user: { displayName: "Song Name", username: "artist" }
                  }}
                />
              ))}
            </div>
          </div>
          </div>


      </main>
    </div>
  )
}