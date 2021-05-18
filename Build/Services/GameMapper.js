"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameMapper = /** @class */ (function () {
    function GameMapper() {
        var _this = this;
        this.gameUserMapper = new Map(); // index 0 = false, index 1 = true
        this.userGameMapper = new Map();
        this.Add = function (game, user1Id, user2Id) {
            if (_this.userGameMapper.get(user1Id) !== undefined || _this.userGameMapper.get(user2Id) !== undefined)
                throw new Error('conflict with on of users');
            _this.gameUserMapper.set(game, [user1Id, user2Id]);
            _this.userGameMapper.set(user1Id, game);
            _this.userGameMapper.set(user2Id, game);
        };
        this.Remove = function (userId) {
            var game = _this.userGameMapper.get(userId);
            if (game === undefined)
                throw new Error('game is not defined');
            var gameParticipants = _this.gameUserMapper.get(game);
            var secondUserId = gameParticipants[0] !== userId ? gameParticipants[0] : gameParticipants[1];
            _this.userGameMapper.delete(userId);
            _this.userGameMapper.delete(secondUserId);
            _this.gameUserMapper.delete(game);
        };
        this.GetGameByUser = function (userId) {
            var game = _this.userGameMapper.get(userId);
            return game;
        };
        this.GetRivalByUser = function (userId) {
            var game = _this.userGameMapper.get(userId);
            if (game === undefined)
                throw new Error('game is not defined');
            var gameParticipants = _this.gameUserMapper.get(game);
            var secondUserId = gameParticipants[0] !== userId ? gameParticipants[0] : gameParticipants[1];
            return secondUserId;
        };
    }
    return GameMapper;
}());
exports.default = new GameMapper();
//# sourceMappingURL=GameMapper.js.map