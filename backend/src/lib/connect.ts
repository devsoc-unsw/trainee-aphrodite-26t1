import { MongoClient, Collection, Db } from "mongodb";
import { Review, Song, User } from "../types/api.types.js";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is not defined in .env");
}

let client: MongoClient;
let db: Db;

// Collections
export let usersCollection: Collection<User>;
export let songsCollection: Collection<Song>;
export let reviewsCollection: Collection<Review>;

export async function connectToDatabase() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI environment variable is undefined");
    }

    client = new MongoClient(uri);
    await client.connect();

    db = client.db("startune");
    console.log(`Successfully connected to database: ${db.databaseName}`);

    // Initialise collections
    usersCollection = db.collection<User>("users");
    songsCollection = db.collection<Song>("songs");
    reviewsCollection = db.collection<Review>("reviews");

  } catch (error) {
    console.error("Error found when connecting to MongoDB: ", error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    console.log("Database connection closed");
  }
}