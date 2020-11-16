import { Auth } from "./classes/auth.class";
import { User } from "./classes/user.class";
import Swal, { SweetAlertIcon } from 'sweetalert2';

let loginForm: HTMLFormElement = null;

function showError(textIcon: string, title: string, contexText: string, ok: true) {
    Swal.fire({
        icon: textIcon as SweetAlertIcon,
        titleText: title,
        text: contexText,
        showConfirmButton: ok,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
}

async function login(e: Event) {

    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const userLogin: User = new User({ email, password });
    try {
        await Auth.login(userLogin);
        location.assign('index.html');
    } catch (error) {
        const respJson = await error.json();
        showError('error', 'Oops...', respJson.message.join(' - ') || respJson.error, true);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loginForm = document.getElementById('form-login') as HTMLFormElement;
    loginForm.addEventListener('submit', login);
});