import { useState, useEffect } from "react";
import { ActionBar } from "../components/actionbar/ActionBar";
import { Button } from "../components/button/Button";
import { Sidebar } from "../components/sidebar/sidebar"
import styles from "./profile.module.css"
import { ReviewItem } from "../components/reviewitem/ReviewItem";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { getCurrUser, getFriends, handleFriendReq, getFavSongs, getFavArtist, getListeningAge, isPrivate, fetchBanner, fetchAvatar} from "../api/users.ts";
import type { SpotifyTrack, Artist } from "../../../backend/src/types/api.types";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnUser, setIsOwnUser] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isAdding, setFriends] = useState(false);
  const [isFriend, setIsFriend ] = useState(false);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtist, setTopArtist] = useState<Artist[]>([]);
  const [age, setAge] = useState("");
  const [artistOfAge, setAgeArtist] = useState<Artist | null>(null);
  const [profilePrivate, setPrivate] = useState(true);
  const [banner, setBanner] = useState("");
  const [avatar, setAvatar] = useState("/samplepfp.jpg");
  const navigate = useNavigate()
  useEffect(() => {
    async function checkUser() {
      const user = await getCurrUser()
      const isPriv = await isPrivate(username!);
      const banner = await fetchBanner(username!);
      const avatar = await fetchAvatar(username!);
      setIsOwnUser(user === username)
      setPrivate(isPriv)
      setBanner(banner)
      setAvatar(avatar)
      if (!isPriv) {
        const friends = await getFriends();
        const tracks = await getFavSongs(username!);
        const artist = await getFavArtist(username!);
        const listeningAge = await getListeningAge(username!);
        if (tracks) {
          const { artistInfo, avgYear } = listeningAge;
          setAgeArtist(artistInfo)
          setAge(avgYear)
          setTopArtist(artist.items)
          setTopTracks(tracks.items)
        }
        for (const friend of friends) {
          if (friend.username === username) {
            setIsFriend(true);
          }
        }
      }
      setIsLoading(false)
    }
    checkUser();
  }, []);

  const handleSettings = () => {
    navigate(`/settings`)
  }

  return (
    <div className={styles.container}>
      <Sidebar accountName="account name" />
      <main className={styles.main}>
        <div className={styles.header} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${banner})`}}>
          <div className={styles.profileRow}>
            <div className={styles.avatarWrapper}>
              <img src={avatar} className={styles.avatarImg} alt="Spotify" />
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
          <div className={styles.lowerProfileContainer}>
            <div className={`${styles.profileRow} ${styles.grow}`}>
              <div>
                among us
              </div>
              <div className={styles.profileButtons}>
                {(isOwnUser || isFriend || isLoading) ? null : <Button onClick={() => {const nextState = !isAdding; setFriends(!isAdding); handleFriendReq(profileName, nextState)}} active={isAdding}>{isAdding ? "Request Sent!" : "+ Add Friend"}</Button>}
                <ActionBar likes={likes} comments={67} liked={liked} />
              </div>
            </div>
            {isOwnUser && <button className={styles.profileSettings} onClick={() => handleSettings()}>Edit profile</button>}
          </div>
        </div>
        {(!profilePrivate || isFriend || isOwnUser) ? <div className={styles.body}>
          {(topTracks.length !== 0) && <div className={styles.cards}>
            <ProfileCard to={"/songs/" + topTracks[0]?.id} imageUrl={topTracks[0]?.album?.images?.[0]?.url} description={topTracks[0]?.name}><span style={{ color: "#FF7272"}}>Favourite</span> song this month</ProfileCard>
            <ProfileCard to="/explore" imageUrl={topArtist[0]?.images?.[0]?.url} description={topArtist[0]?.name}><span style={{ color: "#DCFF15" }}>Top</span> artist this month</ProfileCard>
            <ProfileCard to="/explore" imageUrl={artistOfAge?.images?.[0].url ?? ""} description={age}>Listening <span style={{ color: "#AF99FF"}}>Age</span></ProfileCard>
          </div>}
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
        </div> : <div className={styles.private}>User has privated their account</div>}
      </main>
    </div>
  )
}