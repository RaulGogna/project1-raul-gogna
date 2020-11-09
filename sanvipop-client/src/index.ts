import {Product} from './classes/product.class';
import { Auth } from './classes/auth.class';

let productsContainer: HTMLDivElement = null;
let products: Product[] = [];
let search = '';

Auth.checkToken().catch(() => location.assign('login.html'));

async function loadProducts(): Promise<void> {
    products = await Product.getAll();
    showProducts(products);
}

function showProducts(products: Product[]): void {
    while(productsContainer.firstChild){
        productsContainer.firstChild.remove();
    }
    products.forEach(p => productsContainer.appendChild(p.toHtml()));
}

window.addEventListener('DOMContentLoaded', () => {
    productsContainer = document.getElementById('productsContainer') as HTMLDivElement;
    loadProducts();

    document.getElementById('logout').addEventListener('click', e => {
        Auth.logout();
        location.assign('login.html');
    });
    
    document.getElementById('search').addEventListener('keyup', e => {
        search = (e.target as HTMLInputElement).value;
        let filterProducts = products.filter(p => 
            p.title.includes(search.toLowerCase()) || 
            p.description.includes(search.toLowerCase()));
        showProducts(filterProducts);
    });
});