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
}