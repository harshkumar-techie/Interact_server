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
