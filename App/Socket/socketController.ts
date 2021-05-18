import io from './webSocket';
import { GetUserById } from '../Repositories/UserRepository';
import SocketUserMapperService from '../Services/SocketUserMapper';
import GameMapperService from '../Services/GameMapper';
import GameInvitationMapper from '../Services/GameInvitationMapper';
import Logic from '../Logic/logic';
let RandomGameQueue: undefined | any;

const OnSocketConnection = (socket: any) => {
    AddToSocketMapper(socket);
    InformFriendsOnConnection(socket);
    GameInviteListener(socket);
    AcceptGameInvitationListener(socket);
    ThrowOneDice(socket);
    RequestRandomGame(socket);
}

const RequestRandomGame = (socket: any) => {
    socket.on('requestRandomGame', () => {
        if(RandomGameQueue === undefined){
            RandomGameQueue = socket.request.user._id;
            socket.emit('waitInQueue', true);
        } else if(RandomGameQueue != socket.request.user._id){
            const userInQueue = RandomGameQueue;
            GameMapperService.Add(new Logic(), socket.request.user._id, userInQueue);
            socket.emit('joinGame', {color: false, game: GameMapperService.GetGameByUser(userInQueue)}); 
            GetSocketById(SocketUserMapperService.GetSocketIdByUserId(userInQueue) as string)
                .emit('joinGame', {color: true, game: GameMapperService.GetGameByUser(userInQueue)}); 
            console.log('starting game');
            RandomGameQueue = undefined;
        }
        console.log(RandomGameQueue);
    })
}

// informs all of user's friends (if connected) that the has connected
const InformFriendsOnConnection = async(socket: any) => {
    const user = await GetUserById(socket.request.user._id);
    if(user === null) throw new Error("user doesn't exist");
    user.friends.forEach(friendId => {
        const socketId = SocketUserMapperService.GetSocketIdByUserId(friendId);
        if(socketId !== undefined){
            GetSocketById(socketId).emit('friendConnected', user._id);
        }
    });
}

// adds the user to socket mapper
const AddToSocketMapper = (socket: any) => {
    SocketUserMapperService.Add(socket.request.user._id, socket.id);
}

// recieves invitation from one user (sender) and sends it to the second user
// also sends to the sender a result which says if the invitation is valid (second user is exist and connected)
const GameInviteListener = (socket: any) => {
    socket.on('invite', async(id: string) => {
        if(!await CheckIfUserExistAndConnected(id)) socket.emit('invitationResult', false);
        else{
            const previousInvitedUser = GameInvitationMapper.Remove(socket.request.user._id);
            if(previousInvitedUser != undefined) GetSocketById(SocketUserMapperService.GetSocketIdByUserId(id) as string).emit('invitationCancelled', socket.request.user._id);
            GameInvitationMapper.Add(socket.request.user._id, id);
            socket.emit('invitationResult', true);
            GetSocketById(SocketUserMapperService.GetSocketIdByUserId(id) as string)
                .emit('invited', socket.request.user._id);
        }
        console.log(GameInvitationMapper);
    });
}

// recieves an invitation accept (validate in the function) and then sends to both users order to go to game with game data
const AcceptGameInvitationListener = (socket: any) => {
    socket.on('acceptInvitation', async(id: string) => {
        if(!await CheckIfUserExistAndConnected(id)) socket.emit('invitationResult', false);
        else{
            console.log(GameInvitationMapper);
            if(GameInvitationMapper.IsInvitationExist(socket.request.user._id, id)){
                GameInvitationMapper.Remove(socket.request.user._id);
                GameMapperService.Add(new Logic(), socket.request.user._id, id);
                socket.emit('joinGame', {color: false, game: GameMapperService.GetGameByUser(id)}); 
                GetSocketById(SocketUserMapperService.GetSocketIdByUserId(id) as string)
                    .emit('joinGame', {color: true, game: GameMapperService.GetGameByUser(id)}); 
            } else socket.emit('joinGame', false);
        }
    });
}

const ThrowOneDice = (socket: any) => {
    
}

// checks if user is exist and connected
const CheckIfUserExistAndConnected = async(id: any) => {
    if(await GetUserById(id) == null || SocketUserMapperService.GetSocketIdByUserId(id) == undefined) return false;
    else return true;
}

// checks if game exist in game mapper
const CheckIfGameExist = (socket: any) => {
    const game = GameMapperService.GetGameByUser(socket.request.user._id);
    return game == undefined ? false : true;
}

const GetSocketById = (socketId: string) => {
    return io.of('/').sockets.get(socketId);
}

module.exports = () => {
    io.on('connection', (socket: any) => {
        OnSocketConnection(socket);
        socket.on('disconnect', (reason: any) => {
            OnSocketDisconnect(socket);
        });
    });
}

const OnSocketDisconnect = (socket: any) => {
    CleanFromGameInvitationMapper(socket);
    CleanFromUserSocketMapper(socket);
    InformFriendsOnDisconnection(socket);
}

const InformFriendsOnDisconnection = async(socket: any) => {
    const user = await GetUserById(socket.request.user._id);
    if(user === null) throw new Error("user doesn't exist");
    user.friends.forEach(friendId => {
        const socketId = SocketUserMapperService.GetSocketIdByUserId(friendId);
        if(socketId !== undefined){
            GetSocketById(socketId).emit('friendDisconnected', user._id);
        }
    });
}

const CleanFromUserSocketMapper = (socket: any) => {
    SocketUserMapperService.RemoveBySocketId(socket.id);
}

const CleanFromGameInvitationMapper = (socket: any) => {
    if(GameInvitationMapper.IsAnyInvitationExist(socket.request.user._id)){
        const invitedId = GameInvitationMapper.Remove(socket.request.user._id) as string;
        if(CheckIfUserExistAndConnected(invitedId)){
            const invitedSocketId = SocketUserMapperService.GetSocketIdByUserId(invitedId) as string;
            const invitedSocket = GetSocketById(invitedSocketId);
            invitedSocket.emit('InvitationCancelled', socket.request.user._id);
        }
    }
}