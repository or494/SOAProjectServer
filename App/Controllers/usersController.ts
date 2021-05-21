import express, { Router } from 'express';
import User from '../Models/User';
import {GetFriendsById, GetAllUserChats} from '../Repositories/UserRepository';
const router: Router = express.Router();


router.get('/getFriends', async (req, res) => {
    const isAuthenticated = !!req.user;
    if (isAuthenticated) {
        // @ts-ignore
        const friends = await GetFriendsById(req.user?._id);
        res.send(friends);
    } else{
        res.status(401).send();
    }
});

router.get('/getUserChats', async(req, res) => {
    const isAuthenticated = !!req.user;
    if (isAuthenticated) {
        // @ts-ignore
        const chat = await GetAllUserChats(req.user?._id);
        res.send(chat);
    } else{
        res.status(401).send();
    }
})

export default router;