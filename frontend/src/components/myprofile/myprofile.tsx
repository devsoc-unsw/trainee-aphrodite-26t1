import styles from "./myprofile.module.css"
import { getCurrUser } from "../../api/users";
import { useNavigate} from "react-router-dom";
import { useState } from "react";

export function MyProfile() {
    const navigate = useNavigate();
    const [menu, setMenu] = useState(false);

    const handleProfileClick = async () => {
        const user = await getCurrUser()
        console.log(user)
        navigate(`/users/${user}`)
        setMenu(false)
    }

    const handleSettingClick = () => {
        navigate(`/settings`)
        setMenu(false)
    }

    return (
        <div className={styles.container}>
            <button className={styles.profileButton} onClick={() => setMenu(prev => !prev)}>
                <img className={styles.img} src="samplepfp.jpg"></img>
            </button>
            {menu && (
                <div className={styles.dropdown}>
                    <button onClick={handleProfileClick}>My Profile</button>
                    <button onClick={handleSettingClick}>Settings</button>
                </div>
            )}
        </div>
    )
}