import { Document } from "mongoose";

export default interface User extends Document{
    username: string;
    email: string;
    password: string;
    friends: User['_id'][];
    victories: number;
    losts: number;
    joinedAt: Date,
    lastSeen: Date
}

const CreateUserInstance = (username: string, email: string, hashedPassword: string) => {
    const user = <User>{};
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.joinedAt = new Date();
    return user;
}

export { CreateUserInstance };