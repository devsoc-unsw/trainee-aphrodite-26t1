import { AuthToken, TrackSearchParams, TrackSearchResponse } from "../spotify.types.js";

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
    const data: AuthToken = await res.json();
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

export async function searchTracks(accessToken: string, params: TrackSearchParams) {
  const { q, market, limit = 10, offset = 0 } = params;

  const query = new URLSearchParams({
    q,
    type: "track",
    limit: limit.toString(),
    offset: offset.toString(),
    ...(market && { market }),
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

  return response.json() as Promise<TrackSearchResponse>;
}

export async function searchTrackItems(accessToken: string, params: TrackSearchParams) {
  const data = await searchTracks(accessToken, params);
  return data.tracks.items;
}