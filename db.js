import { MongoClient, ServerApiVersion } from "mongodb";

let client;
let db;

export async function connectDB() {
    if (db) return db; // prevent reconnecting

    const mongoUrl = process.env.MONGO_URL;

    console.log("MONGO_URL check:", mongoUrl
        ? `SET (starts with "${mongoUrl.substring(0, 20)}...", length: ${mongoUrl.length})`
        : "NOT SET — add MONGO_URL in Vercel Environment Variables"
    );

    if (!mongoUrl || (!mongoUrl.startsWith("mongodb://") && !mongoUrl.startsWith("mongodb+srv://"))) {
        throw new Error(`MONGO_URL is invalid or not set. Got: ${mongoUrl ? mongoUrl.substring(0, 20) + "..." : "undefined"}`);
    }

    client = new MongoClient(mongoUrl, {
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