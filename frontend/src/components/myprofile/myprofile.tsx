import styles from "./myprofile.module.css"
import { getCurrUser, fetchAvatar } from "../../api/users";
import { useNavigate } from "react-router"
import { useState, useEffect } from "react";

export function MyProfile() {
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState("samplepfp.jpg")
    const [username, setUsername] = useState("")
    const handleProfileClick = async () => {
        navigate(`/users/${username}`)
    }
    useEffect(() => {
        async function getUser() {
            const user = await getCurrUser()
            const avatar = await fetchAvatar(user!)
            setUsername(user)
            setAvatar(avatar)
        }
        getUser();
    }, [])

    return (
        <div className={styles.container}>
            <button className={styles.profileButton} onClick={() => handleProfileClick()}>
                <img className={styles.img} src={avatar}></img>
            </button>
        </div>
    )
}