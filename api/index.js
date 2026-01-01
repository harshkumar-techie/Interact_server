import express from "express";
import cors from "cors";
import "dotenv/config";
import login from '../routes/login.js'
import signup from '../routes/signup.js'
import home from '../routes/home.js'
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

app.use(cors({
  origin: "https://interact.harshtechie.xyz",
  credentials: true
}));

app.use(express.json());
app.use(express.static("public"));

app.use('/login', login)
app.use('/signup', signup)
app.use('/home', home)

app.get('/', (req, res) => {
  res.send("hello world")
})


// app.listen(3000, '0.0.0.0', () => {
//   console.log("server is live on port 3000")
// })



export default app;
