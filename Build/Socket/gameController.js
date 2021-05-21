"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var GameMapper_1 = __importDefault(require("../Services/GameMapper"));
var router = express_1.default.Router();
router.get('/getGameData', function (req, res) {
    var _a, _b;
    var isAuthenticated = !!req.user;
    if (isAuthenticated) {
        // @ts-ignore
        var userColor = GameMapper_1.default.GetUserColor((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        // @ts-ignore
        var game = GameMapper_1.default.GetGameByUser((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
        res.send({ color: userColor, game: game });
    }
    else {
        res.status(401).send();
    }
});
exports.default = router;
//# sourceMappingURL=gameController.js.map