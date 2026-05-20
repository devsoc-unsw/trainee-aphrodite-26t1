import type { Track } from "../spotify.types";
import type { Artist } from "../../../backend/src/types/api.types";
const BASE_URL = "http://localhost:3000/api";

export async function getSong(id: string): Promise<Track> {
  console.log("attempting to conneect to backend")
  const res = await fetch(`${BASE_URL}/songs/${id}`);
  if (!res.ok) throw new Error("Song not found");
  return res.json();
}

export async function getArtist(id: string): Promise<Artist> {
  console.log("attempting to conneect to backend")
  const res = await fetch(`${BASE_URL}/songs/${id}`);
  if (!res.ok) throw new Error("Song not found");
  return res.json();
}


export async function searchSongs(query: string): Promise<Track[]> {
  const res = await fetch(`${BASE_URL}/songs/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}