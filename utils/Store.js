import Cookies from "js-cookie";
import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {

    cart:{
        cartItems: Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [],
    },

}



const reducer = (state, action) => {

    switch(action.type){

        case 'ADD_TO_CART':{
            const newItem = action.payload;
      
            const itemExist = state.cart.cartItems.find(item => item._id === newItem._id);

            const cartItems = itemExist ? state.cart.cartItems.map(item => item._id === itemExist._id ? newItem : item)
            : [...state.cart.cartItems, newItem];
            Cookies.set('cartItems', JSON.stringify(cartItems))
            return{...state, cart:{...state.cart, cartItems}}

        }

        default:
             return state       
    }
}


export const StoreProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = {state, dispatch};

    return <Store.Provider value={value}>{props.children}</Store.Provider>
}

