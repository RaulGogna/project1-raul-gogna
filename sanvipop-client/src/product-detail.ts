import * as mapboxgl from 'mapbox-gl';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Auth } from "./classes/auth.class";
import { Product } from "./classes/product.class";
import { MAPBOX_TOKEN } from "./constants";

let container: HTMLDivElement = null;
let mapDiv: HTMLDivElement = null;
let map: mapboxgl.Map = null;
let marker: mapboxgl.Marker = null;
const token: string = MAPBOX_TOKEN;
let product: Product = null;

function showError(textIcon: string, title: string, contexText: string, ok: true) {
    Swal.fire({
        icon: textIcon as SweetAlertIcon,
        titleText: title,
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

async function getProduct(): Promise<Product> {
    const idProduct: number = + new URLSearchParams(location.search).get('id');
    if (!idProduct) location.assign('index.html');
    try {
        const product: Product = await Product.get(idProduct);
        if (product) {
            container.appendChild(product.toHtml());
        }
        return product;
    } catch (error) {
        const respJson = await error.json();
        showError('error', 'Oops...', respJson.message || respJson.error, true);
    }
}

function createMap(product: Product): mapboxgl.Map {
    return new mapboxgl.Map({
        accessToken: token,
        container: mapDiv,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [product.owner.lng, product.owner.lat],
        zoom: 12,
    });
}

async function getLocation() {
    product = await getProduct();
    map = createMap(product);
    marker = createMarker('red', product);
}
function createMarker(color: string, product: Product): mapboxgl.Marker {
    return new mapboxgl.Marker({ color })
        .setLngLat(new mapboxgl.LngLat(product.owner.lng, product.owner.lat))
        .addTo(map);
}

window.addEventListener('DOMContentLoaded', () => {
    container = document.getElementById('productContainer') as HTMLDivElement;
    mapDiv = document.getElementById('map') as HTMLDivElement;

    getLocation();
    document.getElementById('logout').addEventListener('click', e => {
        Auth.logout();
        location.assign('login.html');
    });
});