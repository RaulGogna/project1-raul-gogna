import { ICategory } from './icategory';
import { IPhoto } from './iphoto';
import { IUser } from './iuser';

export interface IProduct {
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
}
