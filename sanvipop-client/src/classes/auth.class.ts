import { SERVER } from "../constants";
import { IUser } from "../interfaces/iuser";
import { TokenResponse, UserResponse } from "../interfaces/responses";
import { Http } from "./http.class";

export class Auth {

    static async login(userInfo: IUser): Promise<void> {
        const resp = await Http.post<TokenResponse>(`${SERVER}/auth/login`, userInfo);
        localStorage.setItem('token', resp.accessToken);
    }

    static async register(userInfo: IUser): Promise<void> {
        await Http.post<UserResponse>(`${SERVER}/auth/register`, userInfo);
    }

    static async checkToken(): Promise<void> {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await Http.get(`${SERVER}/auth/validate`);
            } catch (e) {
                if (e.status === 401) {
                    localStorage.removeItem('token');
                }
                throw new Error();
            }
        }
        else {
            throw new Error();
        }
    }

    static logout(): void {
        localStorage.removeItem('token');
    }
}
