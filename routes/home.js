import express from 'express';
import { connectDB } from '../db.js'

const router = express.Router();

router.post('/chats_fetch', async (req, res) => {
    const db = await connectDB();
    const user = await db.collection('user_data').findOne({ "username": req.body.username }); //return full user data
    const user_chats = await db.collection('user_data').find({ username: { $in: user.chats } }).toArray();
    if (user.password === req.body.password) {
        res.json(user_chats);
    }

})

router.post('/addUser', async (req, res) => {
    const db = await connectDB();
    const userdata = await db.collection('user_data').findOne({ "username": req.body.username });
    if (userdata.password === req.body.password) {
        const search_user = await db.collection('user_data').findOne({ "username": req.body.searchUser });
        if (search_user) {
            if (userdata.chats.some(obj => obj === req.body.searchUser)) {
                res.status(200).json({ message: "user already exist in your chat list" })
            } else {
                await db.collection('user_data').updateOne(
                    { username: req.body.username },   // find user
                    {
                        $push: {
                            chats: req.body.searchUser

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

router.post('/msg', async (req, res) => {
    try {
        const db = await connectDB();
        const user = await db.collection('user_data').findOne({ username: req.body.username });
        if (user.password === req.body.password) {
            const chat = await db.collection('user_data').findOne({ username: req.body.msg.msg_to });
            const chat_exist = await db.collection('chats_data').findOne({ users: { $all: [user.username, chat.username] } });
            if (!chat.chats.some(obj => obj === user.username)) {//add user in receiving user chat list
                await db.collection("user_data").updateOne({ username: chat.username }, { $push: { chats: user.username } });
            }
            if (!chat_exist) {
                await db.collection('chats_data').insertOne({ users: [user.username, chat.username], chat: [] });
            }
            await db.collection('chats_data').updateOne({ users: { $all: [user.username, chat.username] } }, { $push: { chat: { id: (chat_exist.chat.length), by: user.username, msg: req.body.msg.msg } } });
            res.status(200).json({ sent: true });
        }
    } catch (err) {
        res.status(400).json({ msg: "server error", sent: false });
    }
})

router.post('/chat_refresher', async (req, res) => {
    const db = await connectDB();
    const user = await db.collection('user_data').findOne({ username: req.body.username });
    if (user.password === req.body.password) {
        const data = await db.collection('chats_data').findOne({ users: { $all: [req.body.username, req.body.msgto] } });
        if (data) {
            res.status(200).json(data.chat)
        }
    }
})

export default router; 