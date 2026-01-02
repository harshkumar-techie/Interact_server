import express from 'express';
import { connectDB } from '../db.js'
import { createtoken } from '../middleware/jwt_auth.js';

const router = express.Router();

router.get('/', (req, res) => {
    if (req.cookies.token) {
        res.status(200).json({ auth: true });
    } else {
        res.status(200).json({ auth: false });
    }
})

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

router.post('/auth', async (req, res) => {
    try {
        const db = await connectDB();
        const user = await db.collection('user_data').findOne({ username: req.body.username, password: req.body.password });
        if (user) {
            const token = createtoken({ username: user.username, name: user.name })
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "none",
                path:'/'
            });
            res.status(200).json({ auth: true });
        }
    }
    catch (err) {
        res.status(500)
    }
})

export default router;