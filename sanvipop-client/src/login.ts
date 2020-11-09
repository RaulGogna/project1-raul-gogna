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
        try{
            await Auth.login(userLogin);
            location.assign('index.html');
        } catch(error){
            const respJson = await error.json();
            errorInfo.innerText = respJson.message || respJson.error;
            setTimeout(() => errorInfo.innerText = null, 3000);
            throw new Error();
        }
}

window.addEventListener('DOMContentLoaded', () => {
    loginForm = document.getElementById('form-login') as HTMLFormElement;
    errorInfo = document.getElementById('errorInfo');
    loginForm.addEventListener('submit', login);
});