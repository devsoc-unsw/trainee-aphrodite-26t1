import { Request, Response } from "express";
import { DisplayReview } from "../types/api.types.js";
import { addReview, deleteReview, getDisplayUserReview, getPopularReviews, getRecentReviews, toggleLikeReview } from "../services/reviews.services.js";
import * as reviewService from "../services/reviews.services.js";
import { ObjectId } from "mongodb";
import { usersCollection } from "../lib/connect.js";

export async function getReviews(req: Request, res: Response) {
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || 10;
  const sort = req.query.sort;
  let results: DisplayReview[] = [];
  if (sort === "recent") {
    results = await getRecentReviews(req.params.songId as string, limit, offset);
  }
  else {
    results = await getPopularReviews(req.params.songId as string, limit, offset);
  }

  const userId = (req as any).user?.id || (req as any).user?._id;
  if (userId) {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (user && user.likedReviews) {
      const likedReviewStrs = user.likedReviews.map(id => id.toString());
      results.forEach(review => {
        review.liked = likedReviewStrs.includes(review.id);
      });
    }
    else {
      results.forEach(review => {
        review.liked = false;
      });
    }
  }

  res.json(results);
}

export async function postReview(req: Request, res: Response) {
  try {
    const { text, rating } = req.body;
    const userId = new ObjectId((req as any).user._id || (req as any).user.id);
    await addReview(req.params.songId as string, userId, text, rating);
    res.json({ result: "success" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getOwnReview(req: Request, res: Response) {
  try {
    const userId = new ObjectId((req as any).user._id || (req as any).user.id);
    const review = await getDisplayUserReview(req.params.songId as string, userId);
    res.json(review || null);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAllOwnedReviews(req: Request, res: Response) {
  try {
    const username = req.params.username;

    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const reviews = await reviewService.getAllOwnedReviews(user._id);

    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteReviewEndpoint(req: Request, res: Response) {
  try {
    const userId = new ObjectId((req as any).user._id || (req as any).user.id);
    await deleteReview(req.params.songId as string, userId);
    res.json({ result: "success" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function toggleLike(req: Request, res: Response) {
  try {
    const { reviewId } = req.params;
    const userId = (req as any).user._id || (req as any).user.id;

    const liked = await toggleLikeReview(userId, reviewId as string);
    res.json({ liked });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Failed to toggle like" });
  }
}