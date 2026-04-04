import { useState } from "react";
import { ActionBar } from "../components/actionbar/ActionBar";
import { Button } from "../components/button/Button";
import { Sidebar } from "../components/sidebar/sidebar"
import styles from "./profile.module.css"
import { ReviewItem } from "../components/reviewitem/ReviewItem";

export default function Profile() {
  const [likes, setLikes] = useState(67);
  const [liked, setLiked] = useState(false);
  const [img, setImg] = useState("/samplepfp.jpg");
  return (
    <div className={styles.container}>
      <Sidebar accountName="account name" />
      <main className={styles.main}>
        <div className={styles.header} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/samplebanner.png")`}}>
          <div className={styles.profileRow}>
            <img src={img} className={styles.headerImg} alt="Spotify" />
            <div className={styles.headerInfo}>
              <h1 className={styles.songTitle}>User Name</h1>
              <p className={styles.subText}>@username</p>
              <div className={styles.headerBar}>
                <div className={styles.headerStat}>
                  <div>14</div>
                  <div>reviews</div>
                </div>
                <div className={styles.headerStat}>
                  <div>67</div>
                  <div>followers</div>
                </div>
                <div className={styles.headerStat}>
                  <div>67</div>
                  <div>following</div>
                </div>
                <div className={styles.headerStat}>
                  <div>7</div>
                  <div>playlists</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.profileRow}>
            <div>
              among us
            </div>
            <div className={styles.profileButtons}>
              <Button>+ Follow</Button>
              <ActionBar likes={likes} comments={67} liked={liked} />
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Reviews</h2>
            <div className={styles.buttons}>
              <Button>Top</Button>
              <Button>New</Button>
            </div>
          </div>
          <hr />
          <div className={styles.reviews}>
            {new Array(3).fill(0).map((_, i) => (<ReviewItem key={i} to="/reviews/testid" name="username" artist="thing" rating={3} description="“At DevSoc, there are good programmers… and then there’s Andy…”" />))}
          </div>
        </div>

      </main>
    </div>
  )
}