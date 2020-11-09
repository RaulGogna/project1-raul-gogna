import { Auth } from "./classes/auth.class";

window.addEventListener('DOMContentLoaded', () => {

    document.getElementById('logout').addEventListener('click', e => {
        Auth.logout();
        location.assign('login.html');
    });
});