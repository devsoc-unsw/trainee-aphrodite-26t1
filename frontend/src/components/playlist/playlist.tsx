import { useState } from "react";
import styles from "./playlist.module.css";
import type { SpotifyPlaylist } from "../../../../backend/src/types/spotify.types";
 
interface PlaylistsProps {
  playlists: SpotifyPlaylist[];
  username: string;
}
 
export function Playlists({ playlists, username }: PlaylistsProps) {
  const [selected, setSelected] = useState<SpotifyPlaylist | null>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
 
  const handleSelect = async (playlist: SpotifyPlaylist) => {
    if (selected?.id === playlist.id) {
      setSelected(null);
      setTracks([]);
      return;
    }
    setSelected(playlist);
    setLoadingTracks(true);
    try {
      const res = await fetch(`http://localhost:3000/api/users/${username}/playlists/${playlist.id}/tracks`);
      const data = await res.json();
      setTracks(data.items ?? []);
    } catch {
      setTracks([]);
    }
    setLoadingTracks(false);
  };
 
  if (!playlists || playlists.length === 0) {
    return <div className={styles.empty}>No playlists available.</div>;
  }
 
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={`${styles.card} ${selected?.id === playlist.id ? styles.active : ""}`}
            onClick={() => handleSelect(playlist)}
          >
            <div
              className={styles.cover}
              style={{
                backgroundImage: playlist.images?.[0]?.url
                  ? `url(${playlist.images[0].url})`
                  : "none",
              }}
            >
              {!playlist.images?.[0]?.url && <div className={styles.placeholder}>♪</div>}
            </div>
            <div className={styles.info}>
              <div className={styles.name}>{playlist.name}</div>
              <div className={styles.meta}>
                {playlist.public ? "Public" : "Private"}
              </div>
            </div>
          </div>
        ))}
      </div>
 
      {selected && (
        <div className={styles.trackPanel}>
          <div className={styles.trackHeader}>
            <div
              className={styles.trackCover}
              style={{
                backgroundImage: selected.images?.[0]?.url
                  ? `url(${selected.images[0].url})`
                  : "none",
              }}
            />
            <div>
              <div className={styles.trackTitle}>{selected.name}</div>
              {selected.description && (
                <div className={styles.trackDesc}>{selected.description}</div>
              )}
              <a
                href={selected.external_urls?.spotify}
                target="_blank"
                rel="noreferrer"
                className={styles.spotifyLink}
              >
                Open in Spotify ↗
              </a>
            </div>
          </div>
 
          <div className={styles.trackList}>
            {loadingTracks ? (
              <div className={styles.loading}>Loading tracks...</div>
            ) : tracks.length === 0 ? (
              <div className={styles.empty}>No tracks found.</div>
            ) : (
              tracks.map((item: any, i: number) => {
                const track = item.item;
                if (!track) return null;
                return (
                  <div key={track.id ?? i} className={styles.track}>
                    <div className={styles.trackNum}>{i + 1}</div>
                    <img
                      src={track.album?.images?.[2]?.url ?? track.album?.images?.[0]?.url}
                      alt={track.name}
                      className={styles.trackImg}
                    />
                    <div className={styles.trackInfo}>
                      <div className={styles.trackName}>{track.name}</div>
                      <div className={styles.trackArtist}>
                        {track.artists?.map((a: any) => a.name).join(", ")}
                      </div>
                    </div>
                    <div className={styles.trackDuration}>
                      {track.duration_ms
                        ? `${Math.floor(track.duration_ms / 60000)}:${String(
                            Math.floor((track.duration_ms % 60000) / 1000)
                          ).padStart(2, "0")}`
                        : ""}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}