import { IUser } from "../interfaces/iuser";

export class User implements IUser {
    name?: string;
    email: string;
    id?: number;
    password?: string;
    photo?: string;
    me?: boolean;
    lat?: number;
    lng?: number;
   
    constructor(userJson: IUser){
        Object.assign(this, userJson);
    }

    static async getProfile(id?: number): Promise<User>{
        return;
    }

    static async saveProfile(name: string, email: string): Promise<void>{

    }

    static async saveAvatar(avatar: string): Promise<string>{
        return;
    }

    static async savePassword(password: string): Promise<void>{

    }

    toHtml(): HTMLDivElement{
        return;
    }

}