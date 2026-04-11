import * as Spotify from "../types/spotify.types.js";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

interface AuthTokenCache {
    access_token: string;
    expires_at: number;
}

let cache: AuthTokenCache | null = null;

export async function getAccessToken() {
  if (cache && cache.expires_at - 30000 > Date.now()) {
    return cache.access_token;
  }
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
    },
  });
  if (res.status === 200) {
    console.log("got token");
    const data: Spotify.AuthToken = await res.json();
    cache = {
        access_token: data.access_token,
        expires_at: Date.now() + data.expires_in * 1000
    }
    return cache.access_token;
  }
  else {
    throw new Error(`Spotify Auth error ${res.status}`);
  }
}

/**
 * Search for tracks via the Spotify API
 * @param accessToken Spotify access token
 * @param q Search query
 * @param limit Search results limit (default 10)
 * @param offset Search results offset (default 0)
 * @returns Search results
 */
export async function searchTracks(accessToken: string, q: string, limit?: number, offset?: number) {
  try {
    const query = new URLSearchParams({
      q,
      type: "track",
      limit: limit ? limit.toString() : "10",
      offset: offset ? offset.toString() : "0",
    });

    const response = await fetch(`https://api.spotify.com/v1/search?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Spotify API error ${response.status}: ${error?.error?.message ?? response.statusText}`
      );
    }
    return response.json() as Promise<Spotify.SearchResults>;
  }
  catch (e) {
    throw e;
  }
}

/**
 * Gets a track from the Spotify API
 * @param accessToken Spotify access token
 * @param id Spotify ID of the song
 */
export async function getTrack(accessToken: string, id: string) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch song: ${response.statusText}`);
    }

    const data: Spotify.Track = await response.json();
    return data;
  }
  catch (err) {
    throw err;
  }
}