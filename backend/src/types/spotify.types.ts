export interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

export interface ExternalUrls {
  spotify: string;
}

export interface ExternalIds {
  isrc?: string;
  ean?: string;
  upc?: string;
}

export interface Restrictions {
  reason: 'market' | 'product' | 'explicit' | string;
}

export interface SimplifiedArtist {
  id: string;
  name: string;
  href: string;
  uri: string;
  type: 'artist';
  external_urls: ExternalUrls;
}

export interface SimplifiedAlbum {
  id: string;
  name: string;
  href: string;
  uri: string;
  type: 'album';
  album_type: 'album' | 'single' | 'compilation';
  total_tracks: number;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  images: Image[];
  artists: SimplifiedArtist[];
  available_markets?: string[];
  external_urls: ExternalUrls;
  restrictions?: Restrictions;
}

export interface Track {
  id: string;
  name: string;
  href: string;
  uri: string;
  type: 'track';
  duration_ms: number;
  explicit: boolean;
  disc_number: number;
  track_number: number;
  is_local: boolean;
  is_playable?: boolean;
  popularity?: number;
  preview_url: string | null;
  album: SimplifiedAlbum;
  artists: SimplifiedArtist[];
  available_markets?: string[];
  external_urls: ExternalUrls;
  external_ids?: ExternalIds;
  restrictions?: Restrictions;
}

export interface ResultItems<T> {
  href: string;
  limit: number;
  offset: number;
  total: number;
  next: string | null;
  previous: string | null;
  items: T[];
}

export interface SearchResults {
  tracks: ResultItems<Track>;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}
export interface PlaylistTrack {
  added_at: string;
  added_by: User;
  is_local: boolean;
  item: Track;
}
export interface User {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: "user";
  uri: string
}
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  href: string;
  images: Image[];
  items: ResultItems<PlaylistTrack>
}