export interface Tag {
  name: string;
  count: number;
}

export type ArtistType = "Person" | "Group" | "Orchestra" | "Choir" | "Character" | "Other";

export interface Artist {
  country: string;
  disambiguation: string;
  id: string;
  name: string;
  "sort-name": string;
  tags: Tag[];
  type: ArtistType;
  "type-id": string;
}

export interface ArtistCredit {
  joinphrase: string;
  name: string;
  artist: Artist;
}

export interface Recording {
  "artist-credit"?: ArtistCredit[];
  disambiguation: string;
  "first-release-date": string;
  id: string;
  length: number;
  tags?: Tag[];
  title: string;
  video: false;
}

export interface ISRCTrack {
  isrc: string;
  recordings: Recording[];
}