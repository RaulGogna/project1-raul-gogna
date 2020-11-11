import * as moment from "moment";
import { SERVER } from "../constants";
import { ICategory } from "../interfaces/icategory";
import { IPhoto } from "../interfaces/iphoto";
import { IProduct } from "../interfaces/iproduct";
import { IUser } from "../interfaces/iuser";
import { ProductResponse, ProductsResponse } from "../interfaces/responses";
import { Http } from "./http.class";
const productTemplate: (prod: IProduct) => string = require('../../templates/product.handlebars');

export class Product implements IProduct {
    id?: number;
    title: string;
    description: string;
    price: number;
    mainPhoto: string;
    owner?: IUser;
    numVisits?: number;
    category: number | ICategory;
    mine?: boolean;
    photos?: IPhoto;
    datePublished?: string;
    distance?: number;

    constructor(prodJson: IProduct) { // Receives JSON object
        Object.assign(this, prodJson);
    }

    static async getAll(): Promise<Product[]> {
        const data = await Http.get<ProductsResponse>(`${SERVER}/products`);
        return data.products.map(pJson => new Product(pJson));
    }

    static async get(id: number): Promise<Product> {
        const data = await Http.get<ProductResponse>(`${SERVER}/products/${id}`);
        return new Product(data.product);
    }

    async post(): Promise<Product> {
        const data = await Http.post<ProductResponse>(`${SERVER}/products`, this);
        return new Product(data.product);
    }

    async delete(): Promise<void> {
        await Http.delete<void>(`${SERVER}/products/${this.id}`);
    }

    toHtml(): HTMLDivElement {
        //Add newCard
        let newCard = document.createElement('div');
        newCard.setAttribute('class', 'card shadow');
        //Add img
        let prodHtml = productTemplate({
            ...this,
            mainPhoto: this.mainPhoto,
            datePublished: moment(this.datePublished).fromNow()
        });
        newCard.innerHTML = prodHtml;

        if (this.mine) {
            newCard.querySelector('button').addEventListener('click', async () => {
                await this.delete();
                newCard.remove();
            });
        }
        return newCard;
    }
}
