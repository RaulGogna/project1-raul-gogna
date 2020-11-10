import { Auth } from "./classes/auth.class";
import { User } from "./classes/user.class";

let profileForm: HTMLFormElement = null;
let errorInfo1: HTMLElement = null;
let okInfo1: HTMLElement = null;

let photoForm: HTMLFormElement = null;
let imgPreview: HTMLImageElement = null; //Quitar d-none en convertBase64
let photoPreview: HTMLImageElement = null;
let errorInfo2: HTMLElement = null;
let okInfo2: HTMLElement = null;

let psswForm: HTMLFormElement = null;
let errorInfo3: HTMLElement = null;
let okInfo3: HTMLElement = null;


function convertBase64(file: File): void {
    const reader = new FileReader();

    if (file) { // File has been selected (convert to Base64)
        reader.readAsDataURL(file);
    }

    reader.addEventListener('load', () => { //Converted into Base64 event (async)
        imgPreview.src = reader.result as string;
        imgPreview.classList.remove('d-none');
    });
}

function showMessage(element: HTMLElement, mssg: string) {
    element.innerText = mssg;
    setTimeout(() => element.innerText = null, 3000);
}

async function saveProfile(e: Event): Promise<void> {
    e.preventDefault();
    let email: string = profileForm.email.value;
    let name: string = profileForm.nameUser.value;

    if(!email || !name){
        showMessage(errorInfo1, 'All fields are mandatory!');
    } else {
        try{
            await User.saveProfile(name, email);
            showMessage(okInfo1, 'User info updated sucessfully!');
            profileForm.reset();
        } catch(error){
            throw new Error(error);
            
        }
    }
}

async function saveAvatar(e: Event): Promise<void>{
    e.preventDefault();
    const image = photoForm.image.value;
    if(!image) showMessage(errorInfo2, 'The image field is empty');
    else{
        try{
            const data = await User.saveAvatar(imgPreview.src);
            showMessage(okInfo2, 'Avatar updated successfully!');
            imgPreview.classList.add('d-none');
            photoForm.photoPreview.value = data;
        } catch(error){
            throw new Error(error);
        }
    }
}

async function getMePhoto(): Promise<string>{
    return await (await User.getProfile()).photo;
}

async function savePassword(e: Event): Promise<void>{
    e.preventDefault();
    const password: string = psswForm.password.value;
    const password2: string = psswForm.password2.value;

    if(password !== password2 ){
        showMessage(errorInfo3, 'Passwords don\'t match!');
    }
    else if(!password || !password2){
        showMessage(errorInfo3, 'There are fields empties');
    } else{
        try{
            await User.savePassword(password);
            showMessage(okInfo3, 'Password updated!');
        } catch(error){
            throw new Error(error);        
        }
    }
}

window.addEventListener('DOMContentLoaded', async () => {

    profileForm = document.getElementById('form-profile') as HTMLFormElement;
    errorInfo1 = document.getElementById('errorInfo1') as HTMLElement;
    okInfo1 = document.getElementById('okInfo1') as HTMLElement;

    profileForm.addEventListener('submit', saveProfile);

    photoForm = document.getElementById('form-photo') as HTMLFormElement;
    imgPreview = document.getElementById('imgPreview') as HTMLImageElement;
    photoPreview = document.getElementById('photo') as HTMLImageElement;
    errorInfo2 = document.getElementById('errorInfo2') as HTMLElement;
    okInfo2 = document.getElementById('okInfo2') as HTMLElement;

    photoPreview.src = await getMePhoto();

    photoForm.image.addEventListener('change', () =>{
        convertBase64(photoForm.image.files[0]);
    });
    
    photoForm.addEventListener('submit', saveAvatar);

    psswForm = document.getElementById('form-password') as HTMLFormElement;
    errorInfo3 = document.getElementById('errorInfo3') as HTMLElement;
    okInfo3 = document.getElementById('okInfo3') as HTMLElement;

    psswForm.addEventListener('submit', savePassword);

    document.getElementById('logout').addEventListener('click', e => {
        Auth.logout();
        location.assign('login.html');
    });
});