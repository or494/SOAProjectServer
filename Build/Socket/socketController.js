"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webSocket_1 = __importDefault(require("./webSocket"));
var UserRepository_1 = require("../Repositories/UserRepository");
var SocketUserMapper_1 = __importDefault(require("../Services/SocketUserMapper"));
var GameMapper_1 = __importDefault(require("../Services/GameMapper"));
var GameInvitationMapper_1 = __importDefault(require("../Services/GameInvitationMapper"));
var logic_1 = __importDefault(require("../Logic/logic"));
var RandomGameQueue;
var OnSocketConnection = function (socket) {
    AddToSocketMapper(socket);
    InformFriendsOnConnection(socket);
    GameInviteListener(socket);
    AcceptGameInvitationListener(socket);
    ThrowOneDice(socket);
    RequestRandomGame(socket);
};
var RequestRandomGame = function (socket) {
    socket.on('requestRandomGame', function () {
        if (RandomGameQueue === undefined) {
            RandomGameQueue = socket.request.user._id;
            socket.emit('waitInQueue', true);
        }
        else if (RandomGameQueue != socket.request.user._id) {
            var userInQueue = RandomGameQueue;
            GameMapper_1.default.Add(new logic_1.default(), socket.request.user._id, userInQueue);
            socket.emit('joinGame', { color: false, game: GameMapper_1.default.GetGameByUser(userInQueue) });
            GetSocketById(SocketUserMapper_1.default.GetSocketIdByUserId(userInQueue))
                .emit('joinGame', { color: true, game: GameMapper_1.default.GetGameByUser(userInQueue) });
            console.log('starting game');
            RandomGameQueue = undefined;
        }
        console.log(RandomGameQueue);
    });
};
// informs all of user's friends (if connected) that the has connected
var InformFriendsOnConnection = function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, UserRepository_1.GetUserById(socket.request.user._id)];
            case 1:
                user = _a.sent();
                if (user === null)
                    throw new Error("user doesn't exist");
                user.friends.forEach(function (friendId) {
                    var socketId = SocketUserMapper_1.default.GetSocketIdByUserId(friendId);
                    if (socketId !== undefined) {
                        GetSocketById(socketId).emit('friendConnected', user._id);
                    }
                });
                return [2 /*return*/];
        }
    });
}); };
// adds the user to socket mapper
var AddToSocketMapper = function (socket) {
    SocketUserMapper_1.default.Add(socket.request.user._id, socket.id);
};
// recieves invitation from one user (sender) and sends it to the second user
// also sends to the sender a result which says if the invitation is valid (second user is exist and connected)
var GameInviteListener = function (socket) {
    socket.on('invite', function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var previousInvitedUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, CheckIfUserExistAndConnected(id)];
                case 1:
                    if (!(_a.sent()))
                        socket.emit('invitationResult', false);
                    else {
                        previousInvitedUser = GameInvitationMapper_1.default.Remove(socket.request.user._id);
                        if (previousInvitedUser != undefined)
                            GetSocketById(SocketUserMapper_1.default.GetSocketIdByUserId(id)).emit('invitationCancelled', socket.request.user._id);
                        GameInvitationMapper_1.default.Add(socket.request.user._id, id);
                        socket.emit('invitationResult', true);
                        GetSocketById(SocketUserMapper_1.default.GetSocketIdByUserId(id))
                            .emit('invited', socket.request.user._id);
                    }
                    console.log(GameInvitationMapper_1.default);
                    return [2 /*return*/];
            }
        });
    }); });
};
// recieves an invitation accept (validate in the function) and then sends to both users order to go to game with game data
var AcceptGameInvitationListener = function (socket) {
    socket.on('acceptInvitation', function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, CheckIfUserExistAndConnected(id)];
                case 1:
                    if (!(_a.sent()))
                        socket.emit('invitationResult', false);
                    else {
                        console.log(GameInvitationMapper_1.default);
                        if (GameInvitationMapper_1.default.IsInvitationExist(socket.request.user._id, id)) {
                            GameInvitationMapper_1.default.Remove(socket.request.user._id);
                            GameMapper_1.default.Add(new logic_1.default(), socket.request.user._id, id);
                            socket.emit('joinGame', { color: false, game: GameMapper_1.default.GetGameByUser(id) });
                            GetSocketById(SocketUserMapper_1.default.GetSocketIdByUserId(id))
                                .emit('joinGame', { color: true, game: GameMapper_1.default.GetGameByUser(id) });
                        }
                        else
                            socket.emit('joinGame', false);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
};
var ThrowOneDice = function (socket) {
};
// checks if user is exist and connected
var CheckIfUserExistAndConnected = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, UserRepository_1.GetUserById(id)];
            case 1:
                if ((_a.sent()) == null || SocketUserMapper_1.default.GetSocketIdByUserId(id) == undefined)
                    return [2 /*return*/, false];
                else
                    return [2 /*return*/, true];
                return [2 /*return*/];
        }
    });
}); };
// checks if game exist in game mapper
var CheckIfGameExist = function (socket) {
    var game = GameMapper_1.default.GetGameByUser(socket.request.user._id);
    return game == undefined ? false : true;
};
var GetSocketById = function (socketId) {
    return webSocket_1.default.of('/').sockets.get(socketId);
};
module.exports = function () {
    webSocket_1.default.on('connection', function (socket) {
        OnSocketConnection(socket);
        socket.on('disconnect', function (reason) {
            OnSocketDisconnect(socket);
        });
    });
};
var OnSocketDisconnect = function (socket) {
    CleanFromGameInvitationMapper(socket);
    CleanFromUserSocketMapper(socket);
    InformFriendsOnDisconnection(socket);
};
var InformFriendsOnDisconnection = function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, UserRepository_1.GetUserById(socket.request.user._id)];
            case 1:
                user = _a.sent();
                if (user === null)
                    throw new Error("user doesn't exist");
                user.friends.forEach(function (friendId) {
                    var socketId = SocketUserMapper_1.default.GetSocketIdByUserId(friendId);
                    if (socketId !== undefined) {
                        GetSocketById(socketId).emit('friendDisconnected', user._id);
                    }
                });
                return [2 /*return*/];
        }
    });
}); };
var CleanFromUserSocketMapper = function (socket) {
    SocketUserMapper_1.default.RemoveBySocketId(socket.id);
};
var CleanFromGameInvitationMapper = function (socket) {
    if (GameInvitationMapper_1.default.IsAnyInvitationExist(socket.request.user._id)) {
        var invitedId = GameInvitationMapper_1.default.Remove(socket.request.user._id);
        if (CheckIfUserExistAndConnected(invitedId)) {
            var invitedSocketId = SocketUserMapper_1.default.GetSocketIdByUserId(invitedId);
            var invitedSocket = GetSocketById(invitedSocketId);
            invitedSocket.emit('InvitationCancelled', socket.request.user._id);
        }
    }
};
//# sourceMappingURL=socketController.js.map