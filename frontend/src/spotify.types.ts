export interface SpotifyImage {
    url: string;
    height: number | null;
    width: number | null;
}

export interface SpotifyExternalUrls {
    spotify: string;
}

export interface SpotifyExternalIds {
    isrc?: string;
    ean?: string;
    upc?: string;
}

export interface SpotifyRestrictions {
    reason: 'market' | 'product' | 'explicit' | string;
}

export interface SimplifiedArtist {
    id: string;
    name: string;
    href: string;
    uri: string;
    type: 'artist';
    external_urls: SpotifyExternalUrls;
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
    images: SpotifyImage[];
    artists: SimplifiedArtist[];
    available_markets?: string[];
    external_urls: SpotifyExternalUrls;
    restrictions?: SpotifyRestrictions;
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
    external_urls: SpotifyExternalUrls;
    external_ids?: SpotifyExternalIds;
    restrictions?: SpotifyRestrictions;
}

export interface PaginatedTracks {
    href: string;
    limit: number;
    offset: number;
    total: number;
    next: string | null;
    previous: string | null;
    items: Track[];
}

export interface TrackSearchResponse {
    tracks: PaginatedTracks;
}

export interface TrackSearchParams {
    q: string;
    market?: string;
    limit?: number;
    offset?: number;
}

export interface AuthToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface PlaylistResponse {
    id: string;
    name: string;
    tracks: {
        items: { track: Track }[];
    };
}