import {Product} from './classes/product.class';
import '../styles.css';

let productsContainer: HTMLDivElement = null;
let products: Product[] = null;
let search: HTMLInputElement = null;

async function getAll(): Promise<void> {
    products = await Product.getAll();
    showProducts(products);
}

function showProducts(products: Product[]) {
    while(productsContainer.firstChild){
        productsContainer.firstChild.remove();
    }
    products.forEach(p => productsContainer.appendChild(p.toHtml()));
}

window.addEventListener('DOMContentLoaded', () => {
    productsContainer = document.getElementById('productsContainer') as HTMLDivElement;
    search = document.getElementById('search') as HTMLInputElement;
    getAll();
    // eslint-disable-next-line no-unused-vars
    search.addEventListener('keyup', () => {
        let filterProducts = products.filter(p => p.title.includes(search.value) || p.description.includes(search.value));
        showProducts(filterProducts);
    });
});