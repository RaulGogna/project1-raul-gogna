import { ICategory } from "../interfaces/icategory";

export class Category implements ICategory {
    id: string;
    name: string;

    constructor(catJson: ICategory) { // Receives JSON object
        Object.assign(this, catJson);
    }
}