import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB client (cached for serverless)
const client = new MongoClient(process.env.MONGO_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

// Connect once (important for Vercel)
async function connectDB() {
  if (db) return db; // prevent reconnecting

  await client.connect();
  db = client.db("interact");
  console.log("✅ MongoDB connected");
  return db;
}

app.get('/', (req, res) => {
  res.send("hello world")
})

app.post("/login", async (req, res) => {
  try {
    const db = await connectDB();
    await db.collection("user_data").insertOne(req.body);
    res.status(200).json({ message: "signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB insert failed" });
  }
});


export default app;
