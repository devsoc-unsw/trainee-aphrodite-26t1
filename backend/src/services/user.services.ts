import { usersCollection } from "../lib/connect.js";
// Need to create a new ObjectId to reference a user's database _id. Example: _id: new ObjectId(user)
import { ObjectId } from "mongodb";

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

export async function getUser( user: string) {

    const result = await usersCollection.findOne({ _id: new ObjectId(user) })
    console.log(result)
    return result?.username

}

