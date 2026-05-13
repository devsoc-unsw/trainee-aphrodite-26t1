
import { Request, Response } from "express";
import * as songsService from "../services/songs.services.js";


export async function search(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "Query parameter 'q' is required" });
      return;
    }

    const songs = await songsService.searchSong(q);
    res.json(songs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to search songs" });
  }
}

export async function getSongById(req: Request, res: Response) {
  try {
    console.log("reached getSongById in songs.controllers.ts");
    const { songId } = req.params;

    const song = await songsService.getSong(songId as string);

    if (!song) {
      res.status(404).json({ error: "Song not found" });
      return;
    }

    res.json(song);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get song" });
  }
}

export async function addSong(req: Request, res: Response) {
    try {
        const {spotifyUrl } = req.body;
        const match = spotifyUrl.match(/track\/([a-zA-Z0-9]+)/);
        if (!match) {
            res.status(400).json({ error: "Invalid Spotify URL" });
            return;
        }
        const trackId = match[1];
        const song = await songsService.getSong(trackId); // your groupmate's function
        res.json(song);
    } catch (e) {
        res.status(500).json({ error: "Failed to add song" });
    }
}

