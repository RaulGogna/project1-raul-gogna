import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";
import { Auth } from "./classes/auth.class";
import { Geolocation } from "./classes/geolocation.class";
import { User } from "./classes/user.class";
import Cropper from 'cropperjs';

let newUserForm: HTMLFormElement = null;
let imgPreview: HTMLImageElement = null;
let message: string = '';
let cropper: Cropper = null;

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
        setTimeout(initCropper, 1000);
    });
}

function initCropper(): Cropper{
    cropper = new Cropper(imgPreview, {
        aspectRatio: 1,
        viewMode: 2,
        zoomable: true,
        cropBoxMovable: true,
        crop: function (e) {
            console.log(e.detail.x);
            console.log(e.detail.y);
        }
    });
    return cropper;
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

    document.getElementById('crop_button').addEventListener('click', (event: any) => {
        if(!cropper){
            message = "Preparate para morir! Debes seleccionar una imagen antes";
            showError('error', 'Has cometido un error!', message, true);
        }
        else {
            imgPreview.src = cropper.getCroppedCanvas().toDataURL('image/jpeg');
            cropper.destroy();
        }
    });

    newUserForm.addEventListener('submit', register);
});