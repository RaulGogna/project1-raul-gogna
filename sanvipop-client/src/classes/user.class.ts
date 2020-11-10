import * as moment from "moment";
import { SERVER } from "../constants";
import { IUser } from "../interfaces/iuser";
import { UserResponse } from "../interfaces/responses";
import { Http } from "./http.class";
const profileTemplate: (user: IUser) => string = require('../../templates/profile.handlebars');
export class User implements IUser {
    name?: string;
    email: string;
    id?: number;
    password?: string;
    photo?: string;
    me?: boolean;
    lat?: number;
    lng?: number;

    constructor(userJson: IUser) {
        Object.assign(this, userJson);
    }

    static async getProfile(id?: number): Promise<User> {
        let exist = id ? `${id}` : 'me';
        const data = await Http.get<UserResponse>(`${SERVER}/users/${exist}`);
        return new User(data.user);
    }

    static async saveProfile(name: string, email: string): Promise<void> {
        await Http.put<void>(`${SERVER}/users/me`, {name, email});
    }

    static async saveAvatar(avatar: string): Promise<string> {
        const data = await Http.put<string>(`${SERVER}/users/me/photo`, avatar);
        return data;
    }

    static async getAvatar(): Promise<string>{
        const data = await Http.get<string>(`${SERVER}/users/me/photo`);
        return data;
    }

    static async savePassword(password: string): Promise<void> {
        await Http.put<void>(`${SERVER}/users/me/password`, password);
    }

    toHtml(): HTMLDivElement {
        //Add newCard
        let newCard = document.createElement('div');
        newCard.setAttribute('class', 'row mt-4');
        //Add img
        let userHtml = profileTemplate({
            ...this,
            photo: this.photo,
        });
        newCard.innerHTML = userHtml;

        return newCard;
    }
}