import { MongoClient, Collection, Db } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is not defined in .env");
}

let client: MongoClient;
let db: Db;

// Collections
export let usersCollection: Collection;
export let songsCollection: Collection;

export async function connectToDatabase() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI environment variable is undefined");
    }

    client = new MongoClient(uri);
    await client.connect();

    db = client.db();
    console.log(`Successfully connected to database: ${db.databaseName}`);

    // Initialise collections
    usersCollection = db.collection("users");
    songsCollection = db.collection("songs");

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