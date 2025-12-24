import express from "express";
import cors from "cors";
import "dotenv/config";
import login from '../routes/login.js'
import signup from '../routes/signup.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/login', login)
app.use('/signup', signup)

app.listen(3000, () => {
  console.log("server in live on port 3000")
})

app.post("/signup", async (req, res) => {
  try {
    const db = await connectDB();
    await db.collection("user_data").insertOne(req.body);
    console.log(req.body)
    res.status(200).json({ message: "signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB insert failed" });
  }
});


export default app;
