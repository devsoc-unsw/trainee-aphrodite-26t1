import { WithId } from "mongodb";
import { Song } from "../types/api.types.js";
import { connectDB } from "./connect.js";

export async function fetchSongById(id: string) {
  const db = await connectDB();
  const songs = db.collection<Song>("songs");
  const song = await songs.findOne({ id });
  return song;
}

/**
 * Gets songs from the database based on spotify ids
 * @param ids Array of ids
 * @returns Array of database documents for songs
 */
export async function fetchSongsByIds(ids: string[]) {
  const db = await connectDB();
  const songs = db.collection<Song>("songs");
  const found = await songs.find({ id: { $in: ids } }).toArray();
  return found;
}

/**
 * Inserts or updates a song in the database (before musicbrainz enrichment)
 * @param song 
 */
export async function upsertSong(song: Song) {
  const db = await connectDB();
  const songs = db.collection<Song>("songs");
  const { createdAt, averageRating, reviewCount, likeCount, tags, ...data } = song;
  await songs.updateOne(
    { id: song.id },
    {
      $setOnInsert: {
        createdAt,
        averageRating,
        reviewCount,
        likeCount,
        tags
      },
      $set: data,
    },
    { upsert: true }
  );
}

/**
 * Updates song data in the database
 * @param id the spotify id
 * @param data Partial data to update
 */
export async function updateSong(id: string, data: Partial<Song>) {
  const db = await connectDB();
  const songs = db.collection<Song>("songs");
  await songs.updateOne(
    { id },
    { $set: data }
  );
}