import express from 'express';
import { connectDB } from '../db.js'

const router = express.Router();

router.post('/username', async (req, res) => {
    try {
        const db = await connectDB();
        const data = await db.collection("user_data").findOne({ "username": req.body.username });
        if (data) {
            res.status(200).json({ "exist": true });
        } else {
            res.status(200).json({ "exist": false });
        }
    } catch (err) {
        res.status(500).json({ message: "DB insert failed" });
    }
});

router.post('/', async (req, res) => {
    try {
        const db = await connectDB();
        const data = await db.collection("user_data").findOne({ "username": req.body.username })
        if (data.password === req.body.password) {
            res.status(200).json({ "auth": true });
        } else {
            res.status(200).json({ "auth": false });
        }
    } catch (error) {
        res.status(500).json({ "message": "Internal Server error" });
    }
})

export default router;