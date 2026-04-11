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
}