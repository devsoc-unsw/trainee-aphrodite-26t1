import styles from "./setting.module.css"
import { Sidebar } from "../components/sidebar/sidebar"
import { SpotifyLogin } from "../components/spotifyLogin/spotifyLogin"
import { ToggleButton } from "../components/toggle/toggleButton"
import { useState, useEffect, useRef } from "react"
import { isPrivate, getCurrUser } from "../api/users"

export default function SettingPage() {
    const [privateProfile, setPrivate] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const imgInput = useRef<HTMLInputElement>(null);

    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };


    const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const rawFile = toBase64(file)
            
        }
    };

    useEffect (() => {
        const getPrivate = async () => {
            const username = await getCurrUser()
            const result = await isPrivate(username);
            setPrivate(result)
            setIsLoading(false)
        }
        getPrivate()
    }, []);

    return (
    <div className={styles.container}>
      <Sidebar accountName="account name" />
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
                    <ToggleButton initial={privateProfile} setting="private"></ToggleButton>
                </div>
                <div className={styles.itemWrapper}>
                    <div className={styles.description}>
                        <span style={{ color: "#ffffffff", marginRight: "20px"  }}>Profile Banner:</span> Customise your profile banner picture.
                    </div>    
                    <input
                        type="file"
                        accept="image/*"
                        ref={imgInput}
                        style={{ display: "none" }}
                        onChange={handleImg}
                    />
                    <button className={styles.addButton} onClick={() => imgInput.current?.click()}>
                    Add
                    </button>

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