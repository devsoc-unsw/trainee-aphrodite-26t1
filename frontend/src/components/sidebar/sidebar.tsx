import { useState, useEffect } from "react";
import styles from "./sidebar.module.css";
import { NavLink } from "react-router";
import { getCurrUser, getNotifications } from "../../api/users";
import { Home, Users, Compass, Bell, Star } from "lucide-react";
import { MyProfile } from "../myprofile/myprofile";
import SideBars from "../audiobars/SideBars.tsx";

export interface SidebarTab {
  label: string,
  to: string,
  icon: React.ReactNode
}
const tabs: SidebarTab[] = [
  { label: "Home", to: "/home", icon: <Home size={20} /> },
  { label: "Friends", to: "/friends", icon: <Users size={20} /> },
  { label: "Explore", to: "/explore", icon: <Compass size={20} /> },
  { label: "Notifications", to: "/notif", icon: <Bell size={20} /> },
  { label: "Review", to: "/review", icon: <Star size={20} /> },
]

interface userNotification {
    type: string;
    senderId: string;
    date: Date;
}

export function Sidebar() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [notifications, setNotifications] = useState<userNotification[]>([]);
  const [name, setName] = useState("")
  useEffect(() => {
    async function fetchName() {
      const data = await getCurrUser();
      setName(data)
    }
    async function fetchNotifications() {
        const data = await getNotifications();
        setNotifications(prev => {
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
            return data;
        });
    }
    fetchNotifications();
    fetchName();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div onMouseEnter={() => setIsSidebarExpanded(true)} onMouseLeave={() => setIsSidebarExpanded(false)} className={`${styles.sidebar} ${isSidebarExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed}`}>
      <SideBars></SideBars>
      <div className={styles.sidebarHeader}>
        <h1 className={styles.logo}>startune</h1>
        <div className={styles.accountName}></div>
      </div>
      <nav className={styles.nav}>
        {tabs.map((tab, i) =>
          <NavLink key={i} to={tab.to} className={props => `${styles.navItem} ${props.isActive ? styles.active : ""}`} end>
            <div className={`${styles.tabBar} ${(notifications.length !== 0 && tab.label === "Notifications") ? styles.notif : ''}`}>
              {(notifications.length !== 0 && tab.label === "Notifications") ? notifications.length : tab.icon}
            </div>
            <span className={styles.navLabel}>{tab.label}</span>
          </NavLink>
        )}
      </nav>
      <div className={styles.profile}>
        <MyProfile></MyProfile> {name}
      </div>
    </div>
  )
}