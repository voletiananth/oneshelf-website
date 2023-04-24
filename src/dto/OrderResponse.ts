import {Pantry} from "../models/Pantry";
import {SlotTime} from "./SlotDayResponse";
import {CartItem} from "../models/Cart";

export interface OrderResponse{
    id: number;
    orderNo: string;
    pantry: Pantry;
    orderDate: string;
    slotTime: SlotTime;
    products: CartItem[];
}
