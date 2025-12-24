import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.MONGO_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;

export async function connectDB() {
    if (db) return db; // prevent reconnecting

    await client.connect();
    db = client.db("interact");
    console.log("✅ MongoDB connected");
    return db;
}