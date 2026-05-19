import { Sidebar } from "../components/sidebar/sidebar"
import styles from "./notification.module.css"
import { FriendRequestNotif } from "../components/notifications/notification"
import { useState, useEffect } from "react";
import { getNotifications } from "../api/users.ts"

interface userNotification {
    type: string;
    senderId: string;
    date: Date;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<userNotification[]>([])

    function NotificationItem({ notification }: { notification: userNotification }) {
        switch (notification.type) {
            case "FRIEND_REQUEST":
                return <FriendRequestNotif type="FRIEND_REQUEST" senderId={notification.senderId} date={notification.date} />;
            default:
                return null;
        }
    }
    
    useEffect(() => {
        async function fetchNotifications() {
            const data = await getNotifications();
            setNotifications(prev => {
            if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
                return data;
            });
        }
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <Sidebar accountName="account name" />
            <main className={styles.main}>
                <section>
                    <div className={styles.titleSection}>
                        <div className={styles.mainTitle}>Notifications</div>
                    </div>
                    {notifications.length === 0 ? (
                        <>
                            <img className={styles.starImg} src="star.png" />
                            <div className={styles.noNotifs}>Nothing new for now!</div>
                        </>
                        ) : (
                        <div className={styles.notifs}>
                            {notifications.map((notification, i) => (
                            <NotificationItem key={i} notification={notification} />
                            ))}
                        </div>
                        )
                    }
                </section>
            </main>
        </div>
    )
}