import { ObjectId } from "mongodb";
import { DisplayReview } from "../types/api.types.js";
import { reviewsCollection, usersCollection } from "../lib/connect.js";
import { getSong } from "./songs.services.js";
import { updateSong } from "../database/songs.js";

/**
 * Gets the most popular (most liked) reviews for a song. Secondary sorting is by creation time
 * @param id The spotify song id
 * @param limit The max amount of reviews to return
 * @param offset The search offset. Default 0
 */
export async function getPopularReviews(id: string, limit: number, offset: number = 0) {
  const results: DisplayReview[] = await reviewsCollection.aggregate([
    { $match: { songId: id } },
    { $sort: { likeCount: -1, createdAt: -1 } },
    { $skip: offset },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        songId: 1,
        rating: 1,
        body: 1,
        likeCount: 1,
        createdAt: 1,
        updatedAt: 1,
        id: { $toString: "$_id" },
        user: { username: "$user.username" }
      }
    }
  ]).toArray() as DisplayReview[];
  return results;
}


/**
 * Gets the most recent reviews for a song
 * @param id The spotify song id
 * @param limit The max amount of reviews to return
 * @param offset The search offset. Default 0
 */
export async function getRecentReviews(id: string, limit: number, offset: number = 0) {
  const results: DisplayReview[] = await reviewsCollection.aggregate([
    { $match: { songId: id } },
    { $sort: { createdAt: -1 } },
    { $skip: offset },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        songId: 1,
        rating: 1,
        body: 1,
        likeCount: 1,
        createdAt: 1,
        updatedAt: 1,
        id: { $toString: "$_id" },
        user: { username: "$user.username" }
      }
    }
  ]).toArray() as DisplayReview[];
  return results;
}

/**
 * Gets a review for a song by a user
 * @param songId The spotify song id
 * @param user The user mongo object id
 */
export async function getUserReview(songId: string, user: ObjectId) {
  const review = reviewsCollection.findOne({ songId: songId, userId: user });
  return review;
}

export async function addReview(songId: string, user: ObjectId, text: string, rating: number) {
  const existingReview = await getUserReview(songId, user);
  if (existingReview) {
    throw new Error("You have already reviewed this song");
  }

  if (!text || text.trim() === "") {
    throw new Error("Review text may not be empty");
  }

  if (!rating || rating === 0) {
    throw new Error("Rating may not be 0");
  }

  const now = Date.now();

  await reviewsCollection.insertOne({
    songId,
    userId: user,
    body: text,
    rating,
    likeCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  const song = await getSong(songId);
  const newReviewCount = song.reviewCount + 1;
  const newAverageRating = ((song.averageRating * song.reviewCount) + rating) / newReviewCount;

  await updateSong(songId, {
    reviewCount: newReviewCount,
    averageRating: newAverageRating
  });
}

export async function getDisplayUserReview(songId: string, user: ObjectId) {
  const results = await reviewsCollection.aggregate([
    { $match: { songId, userId: user } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        songId: 1,
        rating: 1,
        body: 1,
        likeCount: 1,
        createdAt: 1,
        updatedAt: 1,
        id: { $toString: "$_id" },
        user: { username: "$user.username" }
      }
    }
  ]).toArray() as DisplayReview[];
  return results[0] || null;
}

export async function deleteReview(songId: string, user: ObjectId) {
  const existingReview = await getUserReview(songId, user);
  if (!existingReview) {
    throw new Error("Review not found");
  }

  await reviewsCollection.deleteOne({ songId, userId: user });

  const song = await getSong(songId);
  const newReviewCount = Math.max(0, song.reviewCount - 1);
  const newAverageRating = newReviewCount === 0
    ? 0
    : ((song.averageRating * song.reviewCount) - existingReview.rating) / newReviewCount;

  await updateSong(songId, {
    reviewCount: newReviewCount,
    averageRating: newAverageRating
  });
}

export async function toggleLikeReview(userId: string, reviewId: string) {
  const userObjId = new ObjectId(userId);
  const reviewObjId = new ObjectId(reviewId);
  const user = await usersCollection.findOne({ _id: userObjId });
  if (!user) throw new Error("User not found");

  const likedReviews = user.likedReviews || [];

  if (likedReviews.some(id => id.toString() === reviewId)) {
    await usersCollection.updateOne(
      { _id: userObjId },
      { $pull: { likedReviews: reviewObjId } as any }
    );
    await reviewsCollection.updateOne(
      { _id: reviewObjId },
      { $inc: { likeCount: -1 } }
    );
    return false;
  }
  else {
    await usersCollection.updateOne(
      { _id: userObjId },
      { $push: { likedReviews: reviewObjId } as any }
    );
    await reviewsCollection.updateOne(
      { _id: reviewObjId },
      { $inc: { likeCount: 1 } }
    );
    return true;
  }
}