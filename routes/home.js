import express, { json } from 'express';
import { connectDB } from '../db.js'
import { verifytoken } from '../middleware/jwt_auth.js'

const router = express.Router();


//to add new users in chat list
router.post('/add_user', async (req, res) => {
    const auth = verifytoken(req.cookies.token)
    if (!auth) {//returns if authentication fails
        return res.status(200).json({ status: false, msg: "invalid credentials" })
    }
    const db = await connectDB();
    const user = await db.collection('user_data').findOne({ "username": auth.username });
    const search_user = await db.collection('user_data').findOne({ "username": req.body.searchUser });

    if (!search_user) {//returns if searched user doesn't exist
        return res.status(200).json({ message: "This user doesn't exist", status: false });
    }

    if (user.chats.some(obj => obj === req.body.searchUser)) {//retruns if user already in chat list
        return res.status(200).json({ message: "user already exist in your chat list" })
    }
    await db.collection('user_data').updateOne(
        { username: user.username },   // find user
        {
            $push: {
                chats: req.body.searchUser
            }
        }
    );
    res.status(200).json({ status: true });
})

//on message sent
router.post('/msg', async (req, res) => {
    try {
        const auth = verifytoken(req.cookies.token);
        if (!auth) {
            return res.status(200).json({ status: false, msg: "invalid token" });
        }
        const db = await connectDB();
        const user = await db.collection('user_data').findOne({ username: auth.username });
        if (req.body.msg === "") {//return if is a blank message
            return res.status(200).json({ status: false, msg: "Please enter your message" })
        }

        const second_user = await db.collection('user_data').findOne({ username: req.body.msg_to });
        if (!second_user) {//returns if second user doesn't exist
            return res.status(200).json({ status: false, msg: "User doesn't exist" });
        }

        const chat_exist = await db.collection('chats_data').findOne({ users: { $all: [user.username, second_user.username] } });

        if (!chat_exist) {//chat list nox exist then it creates new entry
            await db.collection('chats_data').insertOne({ users: [user.username, second_user.username], chat: [] });
        }

        const chat = await db.collection('chats_data').findOne({ users: { $all: [user.username, second_user.username] } });

        if (!second_user.chats.some(obj => obj === user.username)) {//add user in receiving user chat list
            await db.collection("user_data").updateOne({ username: second_user.username }, { $push: { chats: user.username } });
        }

        await db.collection('chats_data').updateOne({ users: { $all: [user.username, second_user.username] } }, { $push: { chat: { id: (chat.chat.length), by: user.username, msg: req.body.msg } } });
        res.status(200).json({ sent: true });


    } catch (err) {
        res.status(400).json({ msg: "server error", sent: false });
        console.log(err)
    }
})

router.post('/profile_pic', async (req, res) => {
    const db = await connectDB();
    const user = await db.collection('user_data').findOne({ username: req.body.username });
    if (user.password === req.body.password) {
        res.status(200).json({ "dp_link": user.dp });
    }
})

router.post('/status', (req, res) => {
    try {
        if (req.cookies.token) {
            const auth = verifytoken(req.cookies.token);
            res.status(200).json({ auth: true, username: auth.username });
        } else {
            res.status(200).json({ auth: false });
        }
    } catch (err) {
        res.status(400);
    }
});

const chat_list = (chats) => {
    const chats_list = []
    chats.forEach(e => {
        chats_list.push({ username: e.username, name: e.name, dp: e.dp })
    });
    return chats_list;
}
const chat_data = async (username, chats, db) => {
    const all_chats = [];
    for (let i = 0; i < (chats.length); i++) {
        const user = await db.collection('chats_data').findOne({ users: { $all: [username, chats[i]] } });
        if (!user) {
            continue
        }
        all_chats.push({ [chats[i]]: user.chat })
    }
    return all_chats
}

router.post('/sync_chats', async (req, res) => {
    const auth = verifytoken(req.cookies.token);
    if (!auth) {
        return res.status(200).json({ status: false, msg: "invalid credeintials" })
    }
    const db = await connectDB();
    const user = await db.collection('user_data').findOne({ username: auth.username });//to find user chat list
    const chats_list_db = await db.collection('user_data').find({ username: { $in: user.chats } }).toArray();//to get chat list
    const chats_list = chat_list(chats_list_db);
    const chats_data = await chat_data(user.username, user.chats, db);
    res.status(200).json({ "chats_list": chats_list, "chats_data": chats_data })
})
export default router; 