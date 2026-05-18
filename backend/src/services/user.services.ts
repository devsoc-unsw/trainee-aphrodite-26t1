import { usersCollection } from "../lib/connect.js";
// Need to create a new ObjectId to reference a user's database _id. Example: _id: new ObjectId(user)
import { ObjectId } from "mongodb";
import { SpotifyTrack } from "../types/api.types.js";

function similarityScore(a: string, b: string): number {
    a = a.toLowerCase()
    b = b.toLowerCase()

    if (a == b) return 1;
    if (b.startsWith(a)) return 0.9
    if (b.includes(a)) return 0.8
    return 0;

}

export async function findUsers( username: string, self: string  ) {
    const self_user = await usersCollection.findOne({
        _id: new ObjectId(self)
    })
    if (!self_user) {
        throw new Error("Current user not found")
    }
    const self_username = self_user.username
    const users = await usersCollection.find({
        $and: [
            { username: { $regex: username, $options: "i" }} ,
            { username: { $ne: self_username} }
        ]
    })
    .limit(8)
    .toArray();
    users.map(user => ({
        ...user,
        score: similarityScore(username, user.username)
    })).sort((a, b) => b.score - a.score)
    return users;
}
    

export async function getFriends( self: string  ) {
    const self_user = await usersCollection.findOne({
        _id: new ObjectId(self)
    })
    if (!self_user) {
        throw new Error("Current user not found")
    }
    const friends = await Promise.all(
        self_user.friends.map((friend: string) => 
            usersCollection.findOne({ _id: new ObjectId(friend) })
        )
    );

    return friends.filter(Boolean);
}

export async function friendReq( recipient: string, senderId: string, isAdding: boolean) {
    const update = isAdding
    ? { $push: { requests: { senderId: senderId, date: new Date() } } }
    : { $pull: { requests: { senderId: senderId } } };
    const result = await usersCollection.updateOne(
        { username: recipient },
        update
    )
    return result

}

export async function addFriend( recipient: string, senderId: string, accepted: boolean) {
    if (accepted) {
        const results = await Promise.all([
            usersCollection.updateOne(
                { _id: new ObjectId(recipient) },
                { $push: { friends: senderId} }
            ),
            usersCollection.updateOne(
                { _id: new ObjectId(recipient) },
                { $pull: { requests: { senderId: senderId } } }
            ),
            usersCollection.updateOne(
                { _id: new ObjectId(senderId) },
                { $push: { friends: recipient} }
            ),
            usersCollection.updateOne(
                { _id: new ObjectId(senderId) },
                { $pull: { requests: { senderId: recipient } } }
            )
        ])
        return results
    } else {
        const results = await usersCollection.updateOne(
            { _id: new ObjectId(recipient) },
            { $pull: { requests: { senderId: senderId } } }
        )
        return results
    }
}

//UPDATE TO INCLUDE COMMENTS LATER ON
export async function getNotifs( user: string ) {

    const result = await usersCollection.findOne(
        { _id: new ObjectId(user) }
    )

    if (!result) {
        throw new Error("User not found");
    }
    const friendRequests = result.requests.map((req: { senderId: string, date: Date }) => ({
        type: "FRIEND_REQUEST",
        senderId: req.senderId,
        date: req.date
    }));

    return friendRequests

}

export async function getUser(user: string) {

    const result = await usersCollection.findOne({ _id: new ObjectId(user) })
    console.log(result)
    return result?.username

}


export async function getFavSongs(username: string) {
    const user = await usersCollection.findOne( {username: username })
    if (!user?.spotifyAccessToken) return null;

    let res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1", {
        headers: { "Authorization": `Bearer ${user.spotifyAccessToken}` }
    });
    if (res.status === 401) {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: user.spotifyRefreshToken!,
      })
    });
    const tokens = await tokenRes.json();
    await usersCollection.updateOne({ username }, { $set: { spotifyAccessToken: tokens.access_token } });

    res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1", {
      headers: { "Authorization": `Bearer ${tokens.access_token}` }
    });
  }
  return res.json();
}

export async function getFavArtist(username: string) {
    const user = await usersCollection.findOne( {username: username })
    if (!user?.spotifyAccessToken) return null;

    let res = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=1", {
        headers: { "Authorization": `Bearer ${user.spotifyAccessToken}` }
    });
    if (res.status === 401) {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: user.spotifyRefreshToken!,
      })
    });
    const tokens = await tokenRes.json();
    await usersCollection.updateOne({ username }, { $set: { spotifyAccessToken: tokens.access_token } });

    res = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=1", {
      headers: { "Authorization": `Bearer ${tokens.access_token}` }
    });
  }
  return res.json();
}


export async function getListeningAge(username: string) {
    const user = await usersCollection.findOne( {username: username })
    if (!user?.spotifyAccessToken) return null;

    let res = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=50", {
        headers: { "Authorization": `Bearer ${user.spotifyAccessToken}` }
    });
    if (res.status === 401) {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: user.spotifyRefreshToken!,
      })
    });
    const tokens = await tokenRes.json();
    await usersCollection.updateOne({ username }, { $set: { spotifyAccessToken: tokens.access_token } });

    res = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=50", {
      headers: { "Authorization": `Bearer ${tokens.access_token}` }
    });
  }
  const result = await res.json()
  const tracks: SpotifyTrack[] = result.items;
  const artistCount = tracks.reduce((acc, track) => {
    const artist = track.artists[0].name;
    acc[artist] = (acc[artist] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topArtist = Object.entries(artistCount).sort((a, b) => b[1] - a[1])[0][0];
  const avgYear = Math.round(
    tracks.reduce((sum, r) => sum + parseInt(r.album.release_date.split("-")[0]), 0) / tracks.length
  );
  const artistRes = await fetch(`https://api.spotify.com/v1/search?q=${topArtist}&type=artist&limit=1`, {
    headers: { "Authorization": `Bearer ${user.spotifyAccessToken}` }
  });
  const artistData = await artistRes.json()
  const artistInfo = artistData.artists.items[0];
  return { artistInfo, avgYear };
}

export async function makePrivate(user: string, update: boolean) {

    const result = await usersCollection.updateOne(
        { _id: new ObjectId(user) },
        { $set: {
            isPrivate: update
        }}
    )
    return result

}

export async function isPrivate(name: string) {

    const result = await usersCollection.findOne(
        {username: name }
    )
    if (!result) {
        throw new Error("User not found")
    }
    return result.isPrivate ?? false;
}

export async function updateBanner(user: string, file: string) {
    const result = await usersCollection.updateOne(
        { _id: new ObjectId(user) },
        { $set: {
            bannerPic: file
        }}
    )
}

export async function fetchBanner(name: string) {

    const result = await usersCollection.findOne(
        {username: name }
    )
    if (!result) {
        throw new Error("User not found")
    }
    return result.bannerPic ?? null;
}