
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import Cropper from 'cropperjs';

import { Auth } from './classes/auth.class';
import { Category } from './classes/category.class';
import { Http } from './classes/http.class';
import { Product } from './classes/product.class';
import { SERVER } from './constants';
import { CategoriesResponse } from './interfaces/responses';


let imagePreview: HTMLImageElement = null;
let productForm: HTMLFormElement = null;
let categories: HTMLElement = null;
let message: string = '';
let cropper: Cropper = null;

Auth.checkToken().catch(() => location.assign('login.html'));

function showError(textIcon: string, title: string, textContext: string, ok: true): Promise<SweetAlertResult<any>> {
    return Swal.fire({
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

async function getCategories(): Promise<void> {
    const data = await Http.get<CategoriesResponse>(`${SERVER}/categories`);
    data.categories.forEach(p => insertCategories(new Category(p)));
}

function insertCategories({ id, name }: Category) {

    let option = document.createElement('option');
    option.setAttribute('value', id);
    option.innerText = name;
    categories.appendChild(option);
}

function convertBase64(file: File): void {
    const reader = new FileReader();

    if (file) { // File has been selected (convert to Base64)
        reader.readAsDataURL(file);
    }

    reader.addEventListener('load', () => { //Converted into Base64 event (async)
        imagePreview.src = reader.result as string;
        setTimeout(initCropper, 1000);
    });
}

function initCropper(): Cropper {
    cropper = new Cropper(imagePreview, {
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

async function validarFormulario(e: Event): Promise<void> {
    e.preventDefault();
    let title = (productForm.title as any).value;
    let description = productForm.description.value;
    let price = +productForm.price.value;
    let category = +productForm.category.value;
    let mainPhoto = imagePreview.src;

    if (!title || !description || !price || !category || !productForm.image.value) {
        message = 'All fields are mandatory!';
        showError('error', 'Oops...', message, true);
    } else {
        try {
            let prod: Product = new Product({ title, description, price, category, mainPhoto });
            await prod.post();
            message = 'Product added correctly!';
            showError('success', 'OuuuuYeah!', message, true)
                .then(() => location.assign('index.html'));
        }
        catch (error) {
            showError('error', 'Oops...', error, true);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    imagePreview = document.getElementById('imgPreview') as HTMLImageElement;
    productForm = document.getElementById('newProduct') as HTMLFormElement;
    categories = document.getElementById('category');

    getCategories();

    productForm.image.addEventListener('change', () => {

        convertBase64(productForm.image.files[0]);
    });
    
    document.getElementById('crop_button').addEventListener('click', (event: any) => {
        if (!cropper) {
            message = "Preparate para morir! Debes seleccionar una imagen antes";
            showError('error', 'Has cometido un error!', message, true);
        } else {
            imagePreview.src = cropper.getCroppedCanvas().toDataURL('image/jpeg');
            cropper.destroy();
        }
    });
    productForm.addEventListener('submit', validarFormulario);

    document.getElementById('logout').addEventListener('click', e => {
        Auth.logout();
        location.assign('login.html');
    });
});