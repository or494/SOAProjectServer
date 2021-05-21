import express, { Router } from 'express';
import GameMapperService from '../Services/GameMapper';
const router:  Router = express.Router();

router.get('/getGameData', (req, res) => {
    const isAuthenticated = !!req.user;
    if (isAuthenticated) {
        // @ts-ignore
        const userColor =  GameMapperService.GetUserColor(req.user?._id);
        // @ts-ignore
        const game = GameMapperService.GetGameByUser(req.user?._id);
        res.send({color: userColor, game: game});
    } else{
        res.status(401).send();
    }
})

export default router;