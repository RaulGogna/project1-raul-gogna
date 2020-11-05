
import {SERVER} from './constants';
import {Http} from './classes/http.class';
import {Product} from './classes/product.class';
import {Category} from './classes/category.class';
import '../styles.css';
import { CategoriesResponse } from './interfaces/responses';

let imagePreview: HTMLImageElement = null;
let productForm: HTMLFormElement = null;
let categories: HTMLElement = null;

async function getCategories(): Promise<void> {
    const data = await Http.get<CategoriesResponse>(`${SERVER}/categories`);
    data.categories.forEach(p => insertCategories(new Category(p)));
}

function insertCategories({id, name}: Category){

    let option = document.createElement('option');
    option.setAttribute('value', id);
    option.innerText = name;
    categories.appendChild(option);
}

function convertBase64(file: File): void {
    let reader = new FileReader();

    if (file) { // File has been selected (convert to Base64)
        reader.readAsDataURL(file);
    }

    reader.addEventListener('load', () => { //Converted into Base64 event (async)
        imagePreview.src = reader.result as string;
    });
}


async function validarFormulario(e: Event): Promise<void> {
    e.preventDefault();
    let title =  (productForm.title as any).value;
    let description = productForm.description.value;
    let price = +productForm.price.value;
    let category = +productForm.category.value;
    let mainPhoto = imagePreview.src;
    // eslint-disable-next-line no-undef
    if (!title || !description || !price || !category || ! productForm.image.value) {
        productForm.errorMsg.classList.remove('hidden');
        setTimeout(() => productForm.errorMsg.classList.add('hidden'), 3000); 
    }else {
        try{
            // eslint-disable-next-line no-unused-vars
            let prod: Product = new Product({title, description, price, category, mainPhoto});
            await prod.post();
            location.assign('index.html');
        }
        catch(e){
            console.log(e);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    imagePreview = document.getElementById('imgPreview') as HTMLImageElement;
    productForm = document.getElementById('newProduct') as HTMLFormElement;
    categories = document.getElementById('category');

    getCategories();
    
    productForm.image.addEventListener('change', () =>{
        convertBase64(productForm.image.files[0]);
    });

    productForm.addEventListener('submit', validarFormulario);
});