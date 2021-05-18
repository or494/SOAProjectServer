import express from 'express';
const session = require("express-session");
const passport = require("passport");
const app = express();
const cors = require('cors');
import configurations from './server-basic-configurations';
import authController from './Controllers/authenticationController';
import authentication from './Authentication/authentication';
import { ConnectMongoDB } from './DB/DBInstance/MongooseConnection';

app.set("port", configurations.port);

const corsOptions = {
  origin: configurations.clientUrl,
  credentials: true
}

app.use(cors(corsOptions));
app.use('/static', express.static('Build/StaticFiles'));
const sessionMiddleware = session({ secret: "sessionsecret", resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

let http = require("http").Server(app);

app.use((req,res,next) => {
  console.log('>>> new request recieved');
  next();
});

app.use(authentication);

app.use(authController);

http.listen(configurations.port, function() {
  console.log(">>> listening on port " + configurations.port);
  InitializeWebSocket();
});

const InitializeWebSocket = async() => {
  await ConnectMongoDB();
  const io = require('./Socket/webSocket');
  const LoadWebSocketFunctions = require('./Socket/socketController');
  LoadWebSocketFunctions();
}

export {http, sessionMiddleware, passport};