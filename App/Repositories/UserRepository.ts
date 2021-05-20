import UserModel from '../DB/Schema/UserSchema';
import ChatModel from '../DB/Schema/ChatSchema';
import MessageModel from '../DB/Schema/MessageSchema';
import ErrorResult from '../Models/ErrorResult';
import Result from '../Models/Result';
import User, { CreateUserInstance } from '../Models/User';
import { CreateMessageInstance } from '../Models/Message';
import Chat, { CreateChatInstance } from '../Models/Chat';

const CreateUser = async(username: string, email: string , password: string) => {
    let result = ValidateUserDetailes(username, email, password);
    if(result.erros.length > 0) return result;

    result = await AreDetailesAlreadyInUse(username, email);
    if(result.erros.length > 0) return result;

    try{
        return await UserModel.create(CreateUserInstance(username, email, password));
    }catch(err) {
        console.log(err);
        result = new Result();
        result.erros.push(ErrorResult.UnknownError);
        return result;
    }
}

const ValidateUserDetailes = (username: string, email: string , password: string) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result = new Result();

    if(username.length <= 5) result.erros.push(ErrorResult.UsernameLength);
    if(password.length <= 6) result.erros.push(ErrorResult.PasswordLength);
    if(!emailRegex.test(String(email).toLowerCase())) result.erros.push(ErrorResult.EmailInvalid);

    return result;
}

const AreDetailesAlreadyInUse = async(username: string, email: string) => {
    const result = new Result();

    if(await UserModel.findOne({email: email}) !== null) result.erros.push(ErrorResult.EmailIsAlreadyInUse);
    if(await UserModel.findOne({username: username}) !== null) result.erros.push(ErrorResult.UsernameAlreadyInUse);

    return result;
}

const LoginValidation = async(username: string, password: string) => {
    return await UserModel.findOne({username: username, password:password});
}

const GetUserById = async(userId: string) => {
    return await UserModel.findById(userId);
}

const GetUserByName = async(username: string) => {
    return await UserModel.findOne({username: username});
}

const GetFriendsById = async(userId: string) => {
    let user = await GetUserById(userId);
    if(user != null){
        user = user as User;
        return await GetAllFriendsData(user.friends);
    } else return undefined;
}

const GetAllFriendsData = (friends: any[]) => {
    return new Promise((resolve) => {
        const friendsData: any[] = [];
        friends.forEach(async friendId => {
            const friend = await GetUserById(friendId);
            const friendData = {id: friend?.id, username: friend?.username};
            friendsData.push(friendData);
            if(friendsData.length == friends.length) resolve(friendsData);
        })
    })
}

const AddMessageToChat = async(sender: string, reciever: string, content: string) => {
    let chat = await ChatModel.findOne({members: [sender, reciever]} || {members: [reciever, sender]});
    if(chat) chat = chat as Chat;
    else{
        chat = await ChatModel.create(CreateChatInstance(sender, reciever));
        let user = await GetUserById(sender) as User;
        user.chats.push(chat._id);
        user.save();
        user = await GetUserById(reciever) as User;
        user.chats.push(chat._id);
        user.save();
    }
    const message = CreateMessageInstance(sender, reciever, content);
    chat.messages.push(message);
    await chat.save()
    return chat;
}

const GetMessages = async(user1: User['_id'], user2: User['_id']) => {
    const chat = await ChatModel.findOne({members: [user1, user2]} || {members: [user2, user1]});
    return await GetAllMessagesFromChat(chat as Chat);
}

const GetAllMessagesFromChat = (chat: Chat) => {
    return new Promise((resolve) => {
        const messages: any[] = [];
        chat.messages.forEach(async messageId => {
            messages.push(await MessageModel.findById(messageId));
            if(messages.length == chat.messages.length) resolve(messages);
        })
    })
}

export {CreateUser, LoginValidation, GetUserById, GetUserByName, GetFriendsById, AddMessageToChat, GetMessages};