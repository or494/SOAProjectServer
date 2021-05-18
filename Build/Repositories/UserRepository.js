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
exports.GetUserByName = exports.GetUserById = exports.LoginValidation = exports.CreateUser = void 0;
var UserSchema_1 = __importDefault(require("../DB/Schema/UserSchema"));
var ErrorResult_1 = __importDefault(require("../Models/ErrorResult"));
var Result_1 = __importDefault(require("../Models/Result"));
var User_1 = require("../Models/User");
var CreateUser = function (username, email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = ValidateUserDetailes(username, email, password);
                if (result.erros.length > 0)
                    return [2 /*return*/, result];
                return [4 /*yield*/, AreDetailesAlreadyInUse(username, email)];
            case 1:
                result = _a.sent();
                if (result.erros.length > 0)
                    return [2 /*return*/, result];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, UserSchema_1.default.create(User_1.CreateUserInstance(username, email, password))];
            case 3: return [2 /*return*/, _a.sent()];
            case 4:
                err_1 = _a.sent();
                console.log(err_1);
                result = new Result_1.default();
                result.erros.push(ErrorResult_1.default.UnknownError);
                return [2 /*return*/, result];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.CreateUser = CreateUser;
var ValidateUserDetailes = function (username, email, password) {
    var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var result = new Result_1.default();
    if (username.length <= 5)
        result.erros.push(ErrorResult_1.default.UsernameLength);
    if (password.length <= 6)
        result.erros.push(ErrorResult_1.default.PasswordLength);
    if (!emailRegex.test(String(email).toLowerCase()))
        result.erros.push(ErrorResult_1.default.EmailInvalid);
    return result;
};
var AreDetailesAlreadyInUse = function (username, email) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = new Result_1.default();
                return [4 /*yield*/, UserSchema_1.default.findOne({ email: email })];
            case 1:
                if ((_a.sent()) !== null)
                    result.erros.push(ErrorResult_1.default.EmailIsAlreadyInUse);
                return [4 /*yield*/, UserSchema_1.default.findOne({ username: username })];
            case 2:
                if ((_a.sent()) !== null)
                    result.erros.push(ErrorResult_1.default.UsernameAlreadyInUse);
                return [2 /*return*/, result];
        }
    });
}); };
var LoginValidation = function (username, password) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, UserSchema_1.default.findOne({ username: username, password: password })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.LoginValidation = LoginValidation;
var GetUserById = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, UserSchema_1.default.findById(userId)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.GetUserById = GetUserById;
var GetUserByName = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, UserSchema_1.default.findOne({ username: username })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.GetUserByName = GetUserByName;
//# sourceMappingURL=UserRepository.js.map