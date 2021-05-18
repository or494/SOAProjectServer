import UserModel from '../DB/Schema/UserSchema';
import ErrorResult from '../Models/ErrorResult';
import Result from '../Models/Result';
import { CreateUserInstance } from '../Models/User';

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

export {CreateUser, LoginValidation, GetUserById, GetUserByName};