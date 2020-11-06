import { ICategory } from './icategory';
import { IProduct } from './iproduct';
import { IUser } from './iuser';

export interface ProductsResponse {
    products: IProduct[];
}

export interface ProductResponse {
    product: IProduct;
}

export interface TokenResponse {
    accessToken: string;
}

export interface PhotoResponse {
    photo: string;
}

export interface UserResponse {
    user: IUser;
}

export interface CategoriesResponse {
    categories: ICategory[];
}
