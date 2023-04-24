import {CartItem} from "../models/Cart";

export interface AddCartResponse {
    id: number,
    product: CartItem
}
