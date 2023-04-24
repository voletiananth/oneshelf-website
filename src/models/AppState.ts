import {Pantry} from "./Pantry";
import {Category} from "./Category";
import {Cart} from "./Cart";
import {OrderResponse} from "../dto/OrderResponse";

export interface AppState{
    pantry?: Pantry;
    categories: Category[];
    cart?: Cart
    orders: OrderResponse[]
}
