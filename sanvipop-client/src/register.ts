import { Auth } from "./classes/auth.class";
import { Geolocation } from "./classes/geolocation.class";
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

function showError(mssg: string, ok: boolean) {
    errorInfo.innerText = mssg;
    setTimeout(() => [errorInfo.innerText = null, ok ? location.assign('login.html') : '']
        , 3000);
}

async function register(e: Event): Promise<void> {
    e.preventDefault();
    let locations = Geolocation.getLocation();
    let name: string = (newUserForm.name as any).value;
    let email: string = newUserForm.email.value;
    let email2: string = newUserForm.email2.value;
    let password: string = newUserForm.password.value;
    let lat: number = (await locations).latitude;
    let lng: number = (await locations).longitude;
    let photo: string = imgPreview.src;
    
    if (email !== email2) {
        showError('The emails must be same', false);
        //ToDo meter todos los errores en el sweetAlert.
        return;
    }
    if (!name || !email || !email2 || !password || !newUserForm.avatar.value) {
        showError('All fields are mandatory!', false);
        return;
    } else {
        const newUser: User = new User({ name, email, password, photo, lat, lng });
        let respJson: any = null;
        try {
            await Auth.register(newUser);
            showError('Registered user successfully!', true);
        } catch (error) {
            respJson = await error.json();
            showError(respJson.message || respJson.error, false);
            throw new Error();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    newUserForm = document.getElementById('form-register') as HTMLFormElement;
    imgPreview = document.getElementById('imgPreview') as HTMLImageElement;
    errorInfo = document.getElementById('errorInfo');
    Geolocation.getLocation().then(x => {newUserForm.lat.value = x.latitude.toString()});
    Geolocation.getLocation().then(x => {newUserForm.lng.value = x.longitude.toString()});
    
    newUserForm.avatar.addEventListener('change', () => {
        convertBase64(newUserForm.avatar.files[0]);
    });

    newUserForm.addEventListener('submit', register);
});