import { getUsername, addFriend } from "../../api/users";
import styles from "./notifications.module.css"
import { useState, useEffect } from "react"

interface Notification {
    date: Date
    type: string
}

interface FriendRequestNotification extends Notification {
    type: "FRIEND_REQUEST"
    senderId: string;
}


export function FriendRequestNotif({ senderId }: FriendRequestNotification) {
    const [username, setUsername] = useState<string>("");
    const [accepted, setAccepted] = useState<boolean>(false)
    const [declined, setDeclined] = useState<boolean>(false)
    useEffect(() => {
        async function fetchUsername() {
            const name = await getUsername(senderId);
            setUsername(name);
        }
        fetchUsername();
    }, [senderId])

    const handleFriend = async ( senderId: string, accepted: boolean ) => {
        if (accepted) {
            setAccepted(true)
        } else {
            setDeclined(true)
        }
        addFriend( senderId, accepted )
    }
    if (accepted) {
        return (
            <div className={styles.container}>
                <div>You and {username} are now friends!</div>
            </div>
        )
    } else if (declined) {
        return
    }
    return (
        <div className={styles.container}>
            <div>{username} wants to send you a friend request.</div>
            <div className={styles.buttonContainer}>
                <button onClick={() => handleFriend(senderId, true)} className={`${styles.button} ${styles.accept}`}>Accept</button>
                <button onClick={() => handleFriend(senderId, false)} className={`${styles.button} ${styles.decline}`}>Decline</button>
            </div>

        </div>

    )
}