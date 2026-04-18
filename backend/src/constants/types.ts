// Auth
export type Name = string;
export type UserId = string;
export type Email = string;
export type Password = string;

// Song
export type SongId = number;
export type Title = string;
export type Artist = string[];
export type Reviews = ReviewId[];

// Review
export type ReviewId = number;
export type user = UserId;
export type song = SongId;
export type Likes = number;
export type Rating = number;
export type Description = string;


export type Song = {
  songId: SongId;
  title: Title;
  artist: Artist;
  Reviews: Reviews;

}

export type User = {
  userId: UserId;
  username: Name;
  email: Email;
  password: Password;
}

export type Review = {
  reviewId: ReviewId;
  username: Name;
  rating: Rating;
  description: Description;
  likes: Likes;
  song: Song;
}
