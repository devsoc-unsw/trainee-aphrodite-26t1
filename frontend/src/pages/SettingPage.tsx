import styles from "./setting.module.css"
import { Sidebar } from "../components/sidebar/sidebar"
import { SpotifyLogin } from "../components/spotifyLogin/spotifyLogin"
import { ToggleButton } from "../components/toggle/toggleButton"
import { useState, useEffect, useRef } from "react"
import { isPrivate, getCurrUser, updateBanner, updateAvatar, updateDescription, fetchDescription, showPlaylist, uploadImage} from "../api/users"


export default function SettingPage() {
    const [privateProfile, setPrivate] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [bio, setBio] = useState("");
    const imgInput = useRef<HTMLInputElement>(null);
    const bannerInput = useRef<HTMLInputElement>(null);
    const [popup, setPopup] = useState(false);
    const [playlistShow, setPlaylist] = useState(false)
    const showPopup = () => {
        setPopup(true);
        setTimeout(() => setPopup(false), 2000);
    };



    const handleBio = async () => {
        updateDescription(bio)
        showPopup();
    }

    const handleBannerImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
            const url = await uploadImage(file, "banner");
            await updateBanner(url);
            showPopup();
            } catch (err) {
                console.error("Banner upload failed", err);
            }
        }
    };

    const handleProfileImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
            const url = await uploadImage(file, "avatar");
            await updateAvatar(url);
            showPopup();
            } catch (err) {
                console.error("Avatar upload failed", err);
            }
        }
    };

    useEffect (() => {
        const getPrivate = async () => {
            const username = await getCurrUser()
            const result = await isPrivate(username!);
            const bio = await fetchDescription(username!);
            const playlist = await showPlaylist(username!);
            console.log(playlist)
            setBio(bio)
            setPrivate(result)
            setIsLoading(false)
            setPlaylist(playlist)
        }
        getPrivate()
    }, []);

    return (
    <div className={styles.container}>
      <Sidebar/>
      <div className={`${styles.updated} ${popup ? "" : styles.hide}`}>Updated!</div>
      <div className={styles.main}>
        <div className={styles.title}>Settings</div>
        {!isLoading && <div className={styles.options}>
            <div className={styles.option}>
                Profile Customisation
                <div className={styles.lineBreak}></div>
                <div className={styles.itemWrapper}>
                    <div className={styles.description}>
                        <span style={{ color: "#ffffffff", marginRight: "20px"  }}>Link your Spotify account:</span>Displays your listening statistics in your profile.
                    </div>
                    <SpotifyLogin></SpotifyLogin>
                </div>
                
                <div className={styles.itemWrapper}>
                    <div className={styles.description}>
                        <span style={{ color: "#ffffffff", marginRight: "20px"  }}>Private Profile:</span> Your profile will only be visible to your friends.
                    </div>    
                    <button className={styles.toggle} onClick={showPopup}><ToggleButton initial={privateProfile} setting="private"></ToggleButton></button>
                </div>
                <div className={styles.itemWrapper}>
                    <div className={styles.description}>
                        <span style={{ color: "#ffffffff", marginRight: "20px"  }}>Hide Playlists:</span> Your playlists will not be displayed.
                    </div>    
                    <button className={styles.toggle} onClick={showPopup}><ToggleButton initial={playlistShow} setting="hidePlaylist"></ToggleButton></button>
                </div>
                <div className={styles.itemWrapper}>
                    <div className={styles.description}>
                        <span style={{ color: "#ffffffff", marginRight: "20px"  }}>Profile Banner:</span> Customise your profile banner picture.
                    </div>    
                    <input
                        type="file"
                        accept="image/*"
                        ref={bannerInput}
                        style={{ display: "none" }}
                        onChange={handleBannerImg}
                    />
                    <button className={styles.addButton} onClick={() => bannerInput.current?.click()}>
                    Add
                    </button>
                </div>
                 <div className={styles.itemWrapper}>
                    <div className={styles.description}>
                        <span style={{ color: "#ffffffff", marginRight: "20px"  }}>Profile picture:</span> Customise your profile picture.
                    </div>    
                    <input
                        type="file"
                        accept="image/*"
                        ref={imgInput}
                        style={{ display: "none" }}
                        onChange={handleProfileImg}
                    />
                    <button className={styles.addButton} onClick={() => imgInput.current?.click()}>
                    Add
                    </button>
                </div>
                <div className={styles.itemWrapper}>
                    <div className={styles.description}>
                        <span style={{ color: "#ffffffff", marginRight: "20px"  }}>About me:</span> Customise your biography
                    </div>    
                    <textarea
                        placeholder="Customise your biography"
                        value={bio}
                        maxLength={300}
                        onChange={(e) => setBio(e.target.value)}
                        onBlur={handleBio}
                        className={styles.textInput}
                    />
                </div>
            </div>
            <div className={styles.option}>
            </div>
            <div className={styles.option}>
            </div>
        </div>}
      </div>
    </div>
    )
}