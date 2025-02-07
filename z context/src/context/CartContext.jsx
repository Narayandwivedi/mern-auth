import { createContext , useState } from "react";

export const CartContext = createContext(null);

export const CartProvider = (props)=>{
    const [cartItem , setCartItem] = useState([]);
    return <CartContext.Provider value={{cartItem , setCartItem}}>{props.children}</CartContext.Provider>
}