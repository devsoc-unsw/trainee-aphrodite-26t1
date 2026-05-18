import { getAccessToken, getTrack, searchTracks } from "../lib/spotify.js";
import { Song } from "../types/api.types.js";
import { Track } from "../types/spotify.types.js";
import PQueue from "p-queue";
import { getRecording } from "../lib/musicbrainz.js";
import { fetchSongById, fetchSongsByIds, updateSong, upsertSong } from "../database/songs.js";
import { usersCollection, songsCollection, reviewsCollection } from "../lib/connect.js";
import { ObjectId } from "mongodb";

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
  // dont save every song from search results
  // Promise.allSettled(newSongs.map(async song => handleNewSong(song))).catch(e => console.error('Background save error:', e));

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

export async function toggleLikeSong(userId: string, songId: string) {
  const userObjId = new ObjectId(userId);
  const user = await usersCollection.findOne({ _id: userObjId });
  if (!user) throw new Error("User not found");

  const likedSongs = user.likedSongs || [];

  if (likedSongs.includes(songId)) {
    await usersCollection.updateOne(
      { _id: userObjId },
      { $pull: { likedSongs: songId } as any }
    );
    await songsCollection.updateOne(
      { id: songId },
      { $inc: { likeCount: -1 } }
    );
    return false;
  }
  else {
    await usersCollection.updateOne(
      { _id: userObjId },
      { $push: { likedSongs: songId } as any }
    );
    await songsCollection.updateOne(
      { id: songId },
      { $inc: { likeCount: 1 } }
    );
    return true;
  }
}

export async function getRecommendedSongs(limit: number = 10) {
  const songs = await songsCollection
    .find({ reviewCount: { $gt: 0 } })
    .sort({ reviewCount: -1, averageRating: -1 })
    .limit(limit)
    .toArray();
  return songs;
}

export async function getRecentlyRatedSongs(limit: number = 5) {
  // Aggregate to find the latest reviews, grouping by songId so we get unique songs
  const recentReviews = await reviewsCollection.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$songId",
        createdAt: { $first: "$createdAt" }
      }
    },
    { $sort: { createdAt: -1 } },
    { $limit: limit }
  ]).toArray();

  if (recentReviews.length === 0) {
    return [];
  }

  const songIds = recentReviews.map(r => r._id as string);

  // Fetch the songs
  const songs = await songsCollection.find({ id: { $in: songIds } }).toArray();

  // Sort the songs to match the order of recentReviews
  const sortedSongs = recentReviews.map(review => songs.find(s => s.id === review._id)).filter(Boolean);

  return sortedSongs;
}
