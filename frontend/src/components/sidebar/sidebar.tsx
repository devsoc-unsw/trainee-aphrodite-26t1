import { useState } from "react";
import styles from "./sidebar.module.css";
import { Miniplayer } from "../miniplayer/miniplayer";
import { NavLink } from "react-router";

export interface SidebarTab {
  label: string,
  to: string,
}
const tabs: SidebarTab[] = [
  { label: "Home", to: "/" },
  { label: "Friends", to: "/friends" },
  { label: "Explore", to: "/explore" },
  { label: "Jam", to: "/jam" },
]

export function Sidebar({ accountName }: { accountName: string }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  return (
    <div className={`${styles.sidebar} ${isSidebarExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed}`}>
      <div className={styles.sidebarHeader}>
        <h1 className={styles.logo}>startune</h1>
        <div className={styles.accountName}>{accountName}</div>
      </div>
      <nav className={styles.nav}>
        {tabs.map(tab =>
          <NavLink to={tab.to} className={props => `${styles.navItem} ${props.isActive ? styles.active : ""}`} end>
            <div className={styles.navIcon}></div>
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
      {isSidebarExpanded ? <Miniplayer /> : null}
    </div>
  )
}