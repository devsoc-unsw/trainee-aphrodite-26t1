import styles from "./spotifyLogin.module.css"

export function SpotifyLogin() {
  const handleClick = () => {
    const token = localStorage.getItem("token");
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/users/auth/spotify?token=${token}`;
  };

  return (
    <button className={styles.loginButton} onClick={handleClick}>
      <img src='/spotify.svg' className={styles.spotify} />
    </button>
  );
}