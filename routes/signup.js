import express from 'express';
import { connectDB } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const db = await connectDB();
        const data = await db.collection('user_data').findOne({ "username": req.body.username });
        if (data) {
            res.status(200).json({ "message": "Username already exist" });
        } else {
            await db.collection('user_data').insertOne(req.body);
            res.status(201).json({ "message": "User created" });
        }
    } catch (error) {
        res.status(500).json({ "message": "internal server error" });
    }


}).post('/username', async (req, res) => {
    const db = await connectDB();
    const data = await db.collection('user_data').findOne({ "username": req.body.username })
    if (data) {
        res.status(200).json({ "message": "User already exist" })
    } else {
        res.status(201).json({ "message": "Go Ahead" })
    }
})

export default router;