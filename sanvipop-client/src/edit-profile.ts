import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Auth } from './classes/auth.class';
import { User } from './classes/user.class';
import Cropper from 'cropperjs';

let profileForm: HTMLFormElement = null;
// let errorInfo1: HTMLElement = null;
// let okInfo1: HTMLElement = null;

let photoForm: HTMLFormElement = null;
let imgPreview: HTMLImageElement = null; //Quitar d-none en convertBase64
let photoPreview: HTMLImageElement = null;
// let errorInfo2: HTMLElement = null;
// let okInfo2: HTMLElement = null;

let psswForm: HTMLFormElement = null;
// let errorInfo3: HTMLElement = null;
// let okInfo3: HTMLElement = null;
let cropper: Cropper = null;
let message: string = '';

Auth.checkToken().catch(() => location.assign('login.html'));

function showError(textIcon: string, title: string, textContext: string, ok: true) {
    Swal.fire({
        icon: textIcon as SweetAlertIcon,
        titleText: title,
        text: textContext,
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
        imgPreview.classList.remove('d-none');
    });
}

function initCropper(): Cropper{
    cropper = new Cropper(imgPreview, {
        aspectRatio: 16 / 9,
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

async function saveProfile(e: Event): Promise<void> {
    e.preventDefault();
    let email: string = profileForm.email.value;
    let name: string = profileForm.nameUser.value;

    if (!email || !name) {
        message = 'All fields are mandatory!';
        showError('error', 'Oops...', message, true);
    } else {
        try {
            await User.saveProfile(name, email);
            message = 'User info updated sucessfully!';
            showError('success', 'OuuuuYeah!', message, true);
            profileForm.reset();
        } catch (error) {
            const respJson = await error.json();
            showError('error', 'Oops...', respJson.message || respJson.error, true);

        }
    }
}

async function saveAvatar(e: Event): Promise<void> {
    e.preventDefault();
    const image = photoForm.image.value;
    message = 'The image field is empty';
    if (!image) showError('error', 'Oops...', message, true);
    else {
        try {
            let photoAvatar = imgPreview.src;
            await User.saveAvatar(photoAvatar);
            message = 'Avatar updated successfully!';
            showError('success', 'OuuuuYeah!', message, true);
        } catch (error) {
            const respJson = await error.json();
            showError('error', 'Oops...', respJson.message.join(' - ') || respJson.error, true);
        }
    }
}

async function getMePhoto(): Promise<string> {
    return await (await User.getProfile()).photo;
}

async function savePassword(e: Event): Promise<void> {
    e.preventDefault();
    const password: string = psswForm.password.value;
    const password2: string = psswForm.password2.value;

    if (password !== password2) {
        message = 'Passwords don\'t match!';
        showError('warning', 'Oops...', message, true);
    }
    else if (!password || !password2) {
        message = 'There are fields empties';
        showError('error', 'Oops...', message, true);
    } else {
        try {
            await User.savePassword(password);
            message = 'Password updated!';
            showError('success', 'OuuuuYeah!', message, true);
            psswForm.reset();
        } catch (error) {
            const respJson = await error.json();
            showError('error', 'Oops...', respJson.message || respJson.error, true);
        }
    }
}

window.addEventListener('DOMContentLoaded', async () => {

    profileForm = document.getElementById('form-profile') as HTMLFormElement;
    profileForm.addEventListener('submit', saveProfile);

    photoForm = document.getElementById('form-photo') as HTMLFormElement;
    imgPreview = document.getElementById('imgPreview') as HTMLImageElement;
    photoPreview = document.getElementById('photo') as HTMLImageElement;
    photoPreview.src = await getMePhoto();

    photoForm.image.addEventListener('change', () => {
        convertBase64(photoForm.image.files[0]);
    });

    document.getElementById('crop_button').addEventListener('click', (event: any) => {
        if(!cropper){
            message = "Preparate para morir! Debes seleccionar una imagen antes";
            showError('error', 'Has cometido un error!', message, true);
        }
        else {
            photoPreview.src = cropper.getCroppedCanvas().toDataURL('image/jpeg');
            imgPreview.classList.add('d-none');
            cropper.destroy();
        }
    });
    photoForm.addEventListener('submit', saveAvatar);

    psswForm = document.getElementById('form-password') as HTMLFormElement;
    psswForm.addEventListener('submit', savePassword);

    document.getElementById('logout').addEventListener('click', () => {
        Auth.logout();
        location.assign('login.html');
    });
});