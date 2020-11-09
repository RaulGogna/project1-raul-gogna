import { Auth } from "./classes/auth.class";
import { User } from "./classes/user.class";

let newUserForm: HTMLFormElement = null;
let imgPreview: HTMLImageElement = null;
let errorInfo: HTMLElement = null;

function convertBase64(file: File): void {
    const reader = new FileReader();

    if (file) { // File has been selected (convert to Base64)
        reader.readAsDataURL(file);
    }

    reader.addEventListener('load', () => { //Converted into Base64 event (async)
        imgPreview.src = reader.result as string;
    });
}

async function register(e: Event): Promise<void> {
    e.preventDefault();
    let name: string = (newUserForm.name as any).value;
    let email: string = newUserForm.email.value;
    let email2: string = newUserForm.email2.value;
    let password: string = newUserForm.password.value;
    // let lat: string = newUserForm.lat.value;
    // let lng: string = newUserForm.lng.value;
    let photo: string = imgPreview.src;

    if (!name || !email || !email2 || !password || !newUserForm.avatar.value) {
        if (email !== email2) {
            errorInfo.innerText = 'The emails must be same';
        }
        errorInfo.innerText = 'All fields are mandatory!';
        setTimeout(() => errorInfo.innerText = null, 3000);
    } else {
        const newUser: User = new User({ name, email, password, photo });
        let respJson: any = null;
        try {
            await Auth.register(newUser);
            errorInfo.innerText = 'Registered user successfully!';
            setTimeout(() => [
                errorInfo.innerText = null, 
                location.assign('login.html')]
                , 3000);
        } catch (error) {
            respJson = await error.json();
            errorInfo.innerText = respJson.message || respJson.error;
            setTimeout(() => errorInfo.innerText = null, 3000);
            throw new Error();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    newUserForm = document.getElementById('form-register') as HTMLFormElement;
    imgPreview = document.getElementById('imgPreview') as HTMLImageElement;
    errorInfo = document.getElementById('errorInfo');

    newUserForm.avatar.addEventListener('change', () => {
        convertBase64(newUserForm.avatar.files[0]);
    });

    newUserForm.addEventListener('submit', register);
});