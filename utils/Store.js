import Cookies from "js-cookie";
import { createContext, useReducer } from "react";

export const Store = createContext();

export const setLocalStorage = (name, value) => {
    if (typeof window !== 'undefined')
      localStorage.setItem(name, JSON.stringify(value));
 };
 
 export const getLocalStorage = (name) => {
    if (typeof window !== 'undefined') 
       return JSON.parse(localStorage.getItem(name));
 };

 export const removeLocalStorage = (name) => {
    if (typeof window !== 'undefined') 
       return localStorage.removeItem(name);
 };

const initialState = {

    

    cart:{
        cartItems: getLocalStorage('cartItems') ? getLocalStorage('cartItems') : [],
        
        shippingAddress: Cookies.get('shippingAddress') ? JSON.parse(Cookies.get('shippingAddress')) : {},
        paymentMethod: Cookies.get('paymentMethod') ? Cookies.get('paymentMethod') : '',
    },

    user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
    
}



const reducer = (state, action) => {

    switch(action.type){

        case 'ADD_TO_CART':{
            const newItem = action.payload;
            const itemExist = state.cart.cartItems.find(item => item._id === newItem._id);
            const cartItems = itemExist ? state.cart.cartItems.map(item => {
                if(item._id === newItem._id){
                    item.quantity += newItem.quantity
                }
                return item
            })
             : [...state.cart.cartItems, newItem]

            setLocalStorage('cartItems', cartItems)
            return{...state, cart:{...state.cart, cartItems}}

        }

        case 'CART_CLEAR':
            removeLocalStorage('cartItems')
            return {...state, cart:{...state.cart, cartItems:[]}}

            
        case 'UPDATE_ITEM_QUANTITY':{
            const {id, quantity} = action.payload;
           
            const cartItems = state.cart.cartItems.map(item => {
                if(item._id === id){
                    item.quantity = quantity
                }
                return item
            });
            setLocalStorage('cartItems', cartItems)
            return{...state, cart:{...state.cart, cartItems}}

        }
        case 'REMOVE_CART_ITEM':{
            const {id} = action.payload;
           
            const cartItems = state.cart.cartItems.filter(item => item._id !== id);
            setLocalStorage('cartItems', cartItems)
            return{...state, cart:{...state.cart, cartItems}}

        }

        case 'SAVE_SHIPPING_ADDRESS':
            return {...state, cart:{...state.cart, shippingAddress: action.payload}}
        
        case 'SAVE_PAYMENT_METHOD':
            return {...state, cart:{...state.cart, paymentMethod: action.payload}}    

        case 'USER_LOGIN':
            return {...state, user:action.payload};

        
        case 'USER_LOGOUT':
            return {...state, user:null, cart:{cartItems:[]}};    
        
        default:
             return state       
    }
}


export const StoreProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = {state, dispatch};

    return <Store.Provider value={value}>{props.children}</Store.Provider>
}

