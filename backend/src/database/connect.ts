import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is not defined in .env");
}

const client = new MongoClient(uri);

let db: Db;

export async function connectDB(): Promise<Db> {
  if (!db) {
    console.log("connecting")
    await client.connect();
    db = client.db("startune");
    console.log("Database connected");
  }
  return db;
}