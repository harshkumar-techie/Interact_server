import express from 'express';
import { connectDB } from '../db.js'

const router = express.Router();

router.post('/', async (req, res) => {
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

export default router;