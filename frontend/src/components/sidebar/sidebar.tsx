import { useState, useEffect } from "react";
import styles from "./sidebar.module.css";
import { NavLink } from "react-router";
import { getNotifications } from "../../api/users";
export interface SidebarTab {
  label: string,
  to: string,
}
const tabs: SidebarTab[] = [
  { label: "Home", to: "/home" },
  { label: "Friends", to: "/friends" },
  { label: "Explore", to: "/explore" },
  { label: "Notifications", to: "/notif" },
  { label: "Review", to: "/review" },
]

interface userNotification {
    type: string;
    senderId: string;
    date: Date;
}

export function Sidebar({ accountName }: { accountName: string }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [notifications, setNotifications] = useState<userNotification[]>([])

  useEffect(() => {
          async function fetchNotifications() {
              const data = await getNotifications();
              setNotifications(prev => {
              if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
                  return data;
              });
          }
          fetchNotifications();
          const interval = setInterval(fetchNotifications, 10000);
          return () => clearInterval(interval);
      }, []);

  return (
    <div className={`${styles.sidebar} ${isSidebarExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed}`}>
      <div className={styles.sidebarHeader}>
        <h1 className={styles.logo}>startune</h1>
        <div className={styles.accountName}>{accountName}</div>
      </div>
      <nav className={styles.nav}>
        {tabs.map((tab, i) =>
          <NavLink key={i} to={tab.to} className={props => `${styles.navItem} ${props.isActive ? styles.active : ""}`} end>
            <div className={`${styles.navIcon} ${(notifications.length !== 0 && tab.label === "Notifications") ? styles.notif : ''}`}>{(notifications.length !== 0 && tab.label === "Notifications") ? notifications.length : null}</div>
            <span className={styles.navLabel}>{tab.label}</span>
          </NavLink>
        )}
      </nav>

      <div className={styles.collapseContainer}>
        <button className={styles.iconButton} onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
          <svg className={styles.iconSidebar} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
      </div>
    </div>
  )
}