import styles from "./myprofile.module.css"
import { getCurrUser } from "../../api/users";
import { useNavigate } from "react-router-dom";

export function MyProfile() {
    const navigate = useNavigate();
    const handleClick = async () => {
        const user = await getCurrUser()
        console.log(user)
        navigate(`/users/${user}`)
    }

    return (
        <div>
            <button className={styles.profileButton} onClick={handleClick}>
                <img className={styles.img} src="samplepfp.jpg"></img>
            </button>
        </div>
    )
}