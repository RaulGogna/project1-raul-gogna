import * as mapboxgl from 'mapbox-gl';
import { Auth } from "./classes/auth.class";
import { User } from "./classes/user.class";
import { MAPBOX_TOKEN } from "./constants";

let profile: HTMLDivElement = null;
let mapDiv: HTMLDivElement = null;
let map: mapboxgl.Map = null;
let marker: mapboxgl.Marker = null;
const token: string = MAPBOX_TOKEN;
let userProfile: User = null;

async function getProfile(): Promise<User>{
    const idUser: number = + new URLSearchParams(location.search).get('id');
    try{
        userProfile = await User.getProfile(idUser);
        if(userProfile) profile.appendChild(userProfile.toHtml());
        return userProfile;
    } catch(error){
        const respJson = await error.json();
        throw new Error(respJson.message || respJson.error);
    }
}

function createMap(userProfile: User): mapboxgl.Map {
    return new mapboxgl.Map({
        accessToken: token,
        container: mapDiv,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [userProfile.lng, userProfile.lat],
        zoom: 12,
    });
}

async function getLocation(){
    userProfile = await getProfile();
    map = createMap(userProfile);
    marker = createMarker('red', userProfile);
}
function createMarker(color: string, user: User): mapboxgl.Marker {
    return new mapboxgl.Marker({ color })
        .setLngLat(new mapboxgl.LngLat(userProfile.lng, userProfile.lat))
        .addTo(map);
}

window.addEventListener('DOMContentLoaded', () => {
    profile = document.getElementById('profile') as HTMLDivElement;
    mapDiv = document.getElementById('map') as HTMLDivElement;
    getLocation();

    document.getElementById('logout').addEventListener('click', e => {
        Auth.logout();
        location.assign('login.html');
    });
});