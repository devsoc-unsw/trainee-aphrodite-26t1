import { ISRCTrack } from "../types/musicbrainz.types.js";

const BASE_URL = "https://musicbrainz.org/ws/2";
const USER_AGENT = "Startune/1.0.0 ( teohjyim@gmail.com )";

/**
 * Gets a recording from the Musicbrainz database from ISRC code
 * @param isrc The ISRC code
 */
export async function getRecording(isrc: string) {
  const response = await fetch(`${BASE_URL}/isrc/${isrc}?inc=tags+ratings+releases+media+artist-credits`, {
    method: "GET",
    headers: {
      "User-Agent": USER_AGENT,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Musicbrainz API error ${response.status}: ${error?.error?.message ?? response.statusText}`
    );
  }

  return response.json() as Promise<ISRCTrack>;
}