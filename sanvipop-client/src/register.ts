import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";
import { Auth } from "./classes/auth.class";
import { Geolocation } from "./classes/geolocation.class";
import { User } from "./classes/user.class";

let newUserForm: HTMLFormElement = null;
let imgPreview: HTMLImageElement = null;
let message: string = '';

function showError(textIcon: string, title: string, contexText: string, ok: true): Promise<SweetAlertResult<any>> {
    return Swal.fire({
        icon: textIcon as SweetAlertIcon,
        title: title,
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
    let locations = Geolocation.getLocation();
    let name: string = (newUserForm.name as any).value;
    let email: string = newUserForm.email.value;
    let email2: string = newUserForm.email2.value;
    let password: string = newUserForm.password.value;
    let lat: number = (await locations).latitude;
    let lng: number = (await locations).longitude;
    let photo: string = imgPreview.src;

    if (email !== email2) {
        message = 'The emails must be same!';
        showError('warning', 'Oops...', message, true);
        return;
    }
    if (!name || !email || !email2 || !password || !newUserForm.avatar.value) {
        message = 'All fields are mandatory!';
        showError('error', 'Oops...', message, true);
        return;

    } else {
        const newUser: User = new User({ name, email, password, photo, lat, lng });
        let respJson: any = null;
        try {
            await Auth.register(newUser);
            message = 'Registered user successfully!';
            showError('success', 'OuuuuYeah!', message, true)
                .then(() => location.assign('login.html'));
        } catch (error) {
            respJson = await error.json();
            showError(
                'error',
                'Oops.. Algo ha ido mal!',
                respJson.message || respJson.error,
                true
            )
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    newUserForm = document.getElementById('form-register') as HTMLFormElement;
    imgPreview = document.getElementById('imgPreview') as HTMLImageElement;
    Geolocation.getLocation().then(x => { newUserForm.lat.value = x.latitude.toString() });
    Geolocation.getLocation().then(x => { newUserForm.lng.value = x.longitude.toString() });

    newUserForm.avatar.addEventListener('change', () => {
        convertBase64(newUserForm.avatar.files[0]);
    });

    newUserForm.addEventListener('submit', register);
});