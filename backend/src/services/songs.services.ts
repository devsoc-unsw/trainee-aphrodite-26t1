import { getAccessToken, getTrack, searchTracks } from "../lib/spotify.js";
import { Song } from "../types/api.types.js";
import { Track } from "../types/spotify.types.js";
import PQueue from "p-queue";
import { getRecording } from "../lib/musicbrainz.js";
import { fetchSongById, fetchSongsByIds, updateSong, upsertSong } from "../database/songs.js";

export async function getSong(id: string) {
  const song = await fetchSongById(id);
  if (song) {
    return song;
  }
  const token = await getAccessToken();
  const track = await getTrack(token, id);
  const newSong = transformSpotifyTrack(track);
  handleNewSong(newSong).catch(e => console.error('Background save error:', e));
  return newSong;
}
export async function searchSong(query: string) {
  // TODO: if no spotify search available (rate limited) then perform internal database search
  const token = await getAccessToken();
  const results = await searchTracks(token, query.trim());
  const tracks = results.tracks.items;
  const dbTracks = await fetchSongsByIds(tracks.map(t => t.id));
  const newSongs: Song[] = [];
  const songs = tracks.map(track => {
    const existing = dbTracks.find(t => t.id == track.id);
    if (existing) return existing;
    const newSong = transformSpotifyTrack(track);
    newSongs.push(newSong);
    return newSong;
  });

  // update database and update with musicbrainz data lazily
  Promise.allSettled(newSongs.map(async song => handleNewSong(song))).catch(e => console.error('Background save error:', e));

  return songs;
}

/**
 * Upserts the song into the database and queues musicbrainz enrichment
 * @param song the new song
 */
async function handleNewSong(song: Song) {
  await upsertSong(song);
  if (song.isrc) {
    scheduleMusicbrainz(song.id, song.isrc);
  }
}


export function transformSpotifyTrack(track: Track): Song {
  return {
    id: track.id,
    name: track.name,
    isrc: track.external_ids?.isrc,
    durationMs: track.duration_ms,
    explicit: track.explicit,
    discNumber: track.disc_number,
    trackNumber: track.track_number,
    previewUrl: track.preview_url || undefined,
    album: track.album,
    artists: track.artists,
    genres: [],
    tags: [],
    externalUrls: { spotify: track.href },
    averageRating: 0,
    reviewCount: 0,
    likeCount: 0,
    lastFetchedSpotify: Date.now(),
    lastFetchedMusicbrainz: undefined,
    createdAt: Date.now(),
  }
}

const musicbrainzQueue = new PQueue({
  concurrency: 1,
  interval: 1100, // rate limited at 1 query per second
  intervalCap: 1,
});

/**
 * Schedule musicbrainz database enrichment
 * @param id Spotify song ID
 * @param isrc ISRC of the song 
 */
export function scheduleMusicbrainz(id: string, isrc: string) {
  musicbrainzQueue.add(async () => {
    try {
      const isrcTrack = await getRecording(isrc);
      const recording = isrcTrack.recordings[0];
      const data: Partial<Song> = {
        tags: recording.tags,
        lastFetchedMusicbrainz: Date.now()
      }
      updateSong(id, data);
    }
    catch (e) {
      console.warn(`musicbrainz failed for ${id}:`, e);
    }
  });
}

