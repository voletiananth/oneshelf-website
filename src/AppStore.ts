import {configureStore, createAsyncThunk, createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {Pantry} from "./models/Pantry";
import {AppState,} from "./models/AppState";
import {Category} from "./models/Category";
import axios from "axios";
import Endpoints from "./Endpoints";
import {Cart} from "./models/Cart";
import {OrderResponse} from "./dto/OrderResponse";



function saveToPantryLocalStore(state: AppState) {

    if (state.pantry !== undefined) {
        const localState = JSON.stringify(state.pantry);
        localStorage.setItem('pantry', localState);
    }

    if (state.cart !== undefined) {
        const localCart = JSON.stringify(state.cart);
        localStorage.setItem('cart', localCart);
    }

    localStorage.setItem('orders', JSON.stringify(state.orders));




}



function loadFromPantryLocalStore():AppState | undefined {

  const localState = localStorage.getItem('pantry');
  const localCart = localStorage.getItem('cart');
    const localOrders = localStorage.getItem('orders');

  if (localState !== null) {

    return {orders: localOrders ? JSON.parse(localOrders) : [], pantry: JSON.parse(localState), categories: [], cart: localCart ? JSON.parse(localCart) : undefined};

  }

  return undefined;

}

const fetchCart = createAsyncThunk('cart/fetchCart', async ({pantryId,cartId}:{pantryId:number,cartId:number}) => {
    const json = JSON.stringify({pantryId: pantryId, cartId: cartId});

    const response = await axios.post<Cart>(Endpoints.get_Cart(), json, {
        headers: {
            'Content-Type': 'application/json',
            'Allow-Cross-Origin': '*'
        }
    })
    return response.data;
});


function ExtraReducers() {
    return {
        [fetchCart.fulfilled.type]: (state: Draft<AppState>, action: PayloadAction<Cart>) => {
            return {...state, cart: action.payload};
        }
    }
}

const initialState: AppState = {
    pantry: undefined,
    categories: [],
    cart: undefined,
    orders: []

}

const appSlice = createSlice({
      name: 'app', initialState:initialState, reducers: {
    addPantry: (state:Draft<AppState>, action:PayloadAction<Pantry>) => {
      return  {...state, pantry: action.payload};
    },

    addCategories: (state:Draft<AppState>, action:PayloadAction<Category[]>) => {
        return  {...state, categories: action.payload};
    },
            removeCart: (state:Draft<AppState>) => {
            localStorage.removeItem('cart');
            return {...state, cart: undefined};
        },

        addOrder: (state:Draft<AppState>, action:PayloadAction<OrderResponse>) => {
            return {...state, orders: [...state.orders, action.payload]};
        }


  },
    extraReducers: ExtraReducers()
}
);


 const {addPantry,addCategories,removeCart,addOrder} = appSlice.actions;
const appReducer = appSlice.reducer;
const appStore = configureStore({
    reducer: appReducer,
    preloadedState: loadFromPantryLocalStore()
}
);
//
appStore.subscribe(() =>  saveToPantryLocalStore(appStore.getState()));




export {appStore, addPantry,addCategories,fetchCart,removeCart,addOrder};
