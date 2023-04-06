import {Pantry} from "./Pantry";
import {Category} from "./Category";

export interface AppState{
    pantry?: Pantry;
    categories: Category[];
}
