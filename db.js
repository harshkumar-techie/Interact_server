import { MongoClient, ServerApiVersion } from "mongodb";

let client;
let db;

export async function connectDB() {
    if (db) return db; // prevent reconnecting

    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL environment variable is not set");
    }

    client = new MongoClient(process.env.MONGO_URL, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    await client.connect();
    db = client.db("interact");
    return db;
}