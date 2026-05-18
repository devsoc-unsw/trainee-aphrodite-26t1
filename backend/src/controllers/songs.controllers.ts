
import { Request, Response } from "express";
import * as songsService from "../services/songs.services.js";
import { usersCollection } from "../lib/connect.js";
import { ObjectId } from "mongodb";


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

    const userId = (req as any).user?.id || (req as any).user?._id;
    if (userId) {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (user && user.likedSongs?.includes(songId as string)) {
        song.liked = true;
      }
      else {
        song.liked = false;
      }
    }

    res.json(song);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get song" });
  }
}

export async function addSong(req: Request, res: Response) {
  try {
    const { spotifyUrl } = req.body;
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

export async function toggleLike(req: Request, res: Response) {
  try {
    const { songId } = req.params;
    const userId = (req as any).user._id || (req as any).user.id;

    const liked = await songsService.toggleLikeSong(userId, songId as string);
    res.json({ liked });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Failed to toggle like" });
  }
}

export async function getSongs(req: Request, res: Response) {
  try {
    const { sort, limit } = req.query;
    const parsedLimit = limit ? parseInt(limit as string, 10) : undefined;
    
    let songs;
    if (sort === "recent") {
      songs = await songsService.getRecentlyRatedSongs(parsedLimit || 5);
    } else {
      songs = await songsService.getRecommendedSongs(parsedLimit || 10);
    }
    
    res.json(songs);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Failed to get songs" });
  }
}
