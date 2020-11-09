import { Auth } from "./classes/auth.class";
import { User } from "./classes/user.class";
import { TokenResponse } from "./interfaces/responses";

let loginForm: HTMLFormElement = null;
let errorInfo: HTMLElement = null;

async function login(e: Event){

    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    let userLogin: User = new User({email, password});
        let resp: any = null; 
        try{
            resp = await Auth.login(userLogin);
            location.assign('index.html');
        } catch(resp){
            errorInfo.innerText = resp.statusText;
            setTimeout(() => errorInfo.innerText = null, 3000);
            throw new Error();
        }
}

window.addEventListener('DOMContentLoaded', () => {
    loginForm = document.getElementById('form-login') as HTMLFormElement;
    errorInfo = document.getElementById('errorInfo');
    loginForm.addEventListener('submit', login);
});