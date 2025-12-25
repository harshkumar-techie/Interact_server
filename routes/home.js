import express from 'express';
import { connectDB } from '../db.js'

const router = express.Router();

router.post('/chats_fetch', async (req, res) => {
    const db = await connectDB();
    const user = await db.collection('user_data').findOne({ "username": req.body.username });
    if (user.password === req.body.password) {
        res.json(user.chats);
    }

})

router.post('/addUser', async (req, res) => {
    const db = await connectDB();
    const userdata = await db.collection('user_data').findOne({ "username": req.body.username });
    const search_user = await db.collection('user_data').findOne({ "username": req.body.searchUser });
    const chatExists = await db.collection("user_data").findOne({ username: req.body.username, "chats.id": req.body.searchUser });
    if (userdata.username === req.body.username && userdata.password === req.body.password) {
        if (search_user) {
            if (chatExists) {
                res.status(200).json({ message: "user already exist in your chat list" })
            } else {
                await db.collection('user_data').updateOne(
                    { username: req.body.username },   // find user
                    {
                        $push: {
                            chats: {
                                id: req.body.searchUser
                            }
                        }
                    }
                );
            }
            res.status(200).json({ status: true });
        } else {
            res.status(200).json({ message: "This user doesn't exist", status: false });
        }
    } else {
        res.status(200).json({ message: "Invalid Crediantials" });
    }

})

export default router;