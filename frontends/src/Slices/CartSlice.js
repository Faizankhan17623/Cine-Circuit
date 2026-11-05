import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const readJSON = (key, fallback) => {
    try {
        const v = JSON.parse(localStorage.getItem(key))
        return v ?? fallback
    } catch {
        return fallback
    }
}

const initialState = {
    cart:Array.isArray(readJSON("cart", [])) ? readJSON("cart", []) : [],
    total:Number(readJSON("cartTotal", 0)) || 0,
    totalItems:Number(readJSON("cartTotalItems", 0)) || 0,
}


const cartSlice = createSlice({
    name:"Cart",
    initialState:initialState,
    reducers:{
        Addtocart:(state,action)=>{
            const ticket = action.payload
            const index  = state.cart.findIndex((item) => item._id === ticket._id)
            if(index !== -1){
                toast.error("Ticket already added to cart")
                return
            }
            
            state.cart.push(ticket)
            state.totalItems++
            state.total += ticket.price

            localStorage.setItem("cart",JSON.stringify(state.cart))
            localStorage.setItem("cartTotal",JSON.stringify(state.total))
            localStorage.setItem("cartTotalItems",JSON.stringify(state.totalItems))
            toast.success("Ticket added to cart")
        },
        removefromcart:(state,action)=>{
            const ticket = action.payload
            const index  = state.cart.findIndex((item) => item._id === ticket._id)
            if(index >= 0){
                state.totalItems--
                state.total -= state.cart[index].price
                state.cart.splice(index,1)
                
                localStorage.setItem("cart",JSON.stringify(state.cart))
                localStorage.setItem("cartTotal",JSON.stringify(state.total))
                localStorage.setItem("cartTotalItems",JSON.stringify(state.totalItems))
                toast.success("Ticket removed from cart")
            }
        },
        resetcart:(state)=>{
            state.cart = []
            state.total = 0
            state.totalItems = 0
            localStorage.removeItem("cart")
            localStorage.removeItem("cartTotal")
            localStorage.removeItem("cartTotalItems")
        },

    }
})


export const {Addtocart,removefromcart,resetcart} = cartSlice.actions

export default cartSlice.reducer