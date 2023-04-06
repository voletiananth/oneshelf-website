import {configureStore, createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {Pantry} from "./models/Pantry";
import {AppState,} from "./models/AppState";
import {Category} from "./models/Category";



function saveToPantryLocalStore(state: AppState) {

  const localState = JSON.stringify(state.pantry);

  localStorage.setItem('state', localState);

}



function loadFromPantryLocalStore():AppState | undefined {

  const localState = localStorage.getItem('state');

  if (localState) {

    return {pantry: JSON.parse(localState), categories: []}

  }

  return undefined;

}

const initialState: AppState = {
    pantry: undefined,
    categories: []
}

const appSlice = createSlice({
      name: 'app', initialState:initialState, reducers: {
    addPantry: (state:Draft<AppState>, action:PayloadAction<Pantry>) => {
      return  {...state, pantry: action.payload};
    },

    addCategories: (state:Draft<AppState>, action:PayloadAction<Category[]>) => {
        return  {...state, categories: action.payload};
    }
  }
}
);


 const {addPantry,addCategories} = appSlice.actions;
const appReducer = appSlice.reducer;
const appStore = configureStore({
    reducer: appReducer,
    preloadedState: loadFromPantryLocalStore()
}
);
//
appStore.subscribe(() =>  saveToPantryLocalStore(appStore.getState()));




export {appStore, addPantry,addCategories};
