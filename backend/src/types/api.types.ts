import { ObjectId } from "mongodb";
import { Tag } from "./musicbrainz.types.js";
import { SimplifiedAlbum, SimplifiedArtist } from "./spotify.types.js";

export interface ExternalUrls {
  spotify: string;
  youtube?: string;
}

export interface Song {
  id: string;
  name: string;
  isrc?: string;
  durationMs: number;
  explicit: boolean;
  discNumber: number;
  trackNumber: number;
  previewUrl?: string;
  album: SimplifiedAlbum;
  artists: SimplifiedArtist[];
  genres: string[];
  tags: Tag[];
  externalUrls: ExternalUrls;
  averageRating: number;
  reviewCount: number;
  likeCount: number;
  lastFetchedSpotify: number;
  lastFetchedMusicbrainz?: number;
  createdAt: number;
  liked?: boolean;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  disc_number: number;
  track_number: number;
  preview_url?: string;
  album: SimplifiedAlbum;
  artists: SimplifiedArtist[];
  external_urls: ExternalUrls;
}

export interface Artist {
      external_urls: ExternalUrls;
      href: string;
      id: string;
      images: { url: string; height: number; width: number }[];
      name: string;
      type: string;
      uri: string;
}

export interface User {
  email: string;
  googleId?: string;
  password?: string;
  username: string;
  friends: string[];
  requests: { senderId: string; date: Date }[];
  spotifyAccessToken?: string;
  spotifyRefreshToken?: string;
  isPrivate?: boolean;
  bannerPic?: string;
  profilePic?: string;
  description?: string;
  likedSongs?: string[];
  likedReviews?: ObjectId[];
}

export interface DisplayUser {
  displayName: string,
  username: string
}

/**
 * Represents a review for a song
 */
export interface Review {
  /**
   * The spotify id of the song
   */
  songId: string;
  userId: ObjectId;
  rating: number;
  body: string;
  likeCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface DisplayReview {
  id: string;
  to: string;
  songId: string;
  rating: number;
  body: string;
  likeCount: number;
  createdAt: number;
  updatedAt: number;
  user: DisplayUser;
  liked?: boolean;
}