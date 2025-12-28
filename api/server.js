import express from "express";
import cors from "cors";
import "dotenv/config";
import login from '../routes/login.js'
import signup from '../routes/signup.js'
import home from '../routes/home.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use("/assets", express.static("assets"));

app.use('/login', login)
app.use('/signup', signup)
app.use('/home', home)

// app.listen(3000, '0.0.0.0', () => {
//   console.log("server is live on port 3000")
// })


export default app;
