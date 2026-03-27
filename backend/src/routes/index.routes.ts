import { Router } from "express"
import { getAccessToken, searchTrackItems } from "../lib/spotify.js";
import { PlaylistResponse } from "../spotify.types.js";

const router: Router = Router();

// for now just getting some random ass playlist just so we can test frontend data fetching.
// in the future this will just be a db call
router.get('/recommended', async (req, res) => {
  try {
    const token = await getAccessToken();
    const playlistId = '0T0nB4Ji1RUN17ifRsaeeP';
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.statusText}`);
    }

    const data: PlaylistResponse = await response.json();
    res.json({ tracks: data.tracks.items.map(item => item.track) });
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// returns track results from a spotify api search query
router.get('/search', async (req, res) => {
  const query = req.query.q;

  if (!query || typeof query !== 'string' || query.trim() === '') {
    res.status(400).json({ error: 'Missing or invalid query parameter: q' });
    return;
  }

  try {
    const token = await getAccessToken();
    const tracks = await searchTrackItems(token, {
      q: query.trim(),
    });
    res.json({ tracks });
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;