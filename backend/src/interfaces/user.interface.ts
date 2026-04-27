import { User } from "../models/user.entity.js";

export interface IUserRegister {
    username: string;
    email: string;
    password?: string;
}

export interface IUserLogin {
    email: string;
    password?: string;
}

export interface IUserService {
    registerUser(data: IUserRegister): Promise<Partial<User>>;
    loginUser(data: IUserLogin): Promise<{ user: Partial<User> | null; accessToken: string; refreshToken: string }>;
    generateAccessToken(user: User): string;
    generateRefreshToken(user: User): string;
}
