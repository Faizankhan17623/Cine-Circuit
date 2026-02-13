import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    cart:localStorage.getItem("cart") ? JSON.parse(localStorage.getItem('cart')) : [],
    total:localStorage.getItem("total") ? JSON.parse(localStorage.getItem('total')) : [],
    totalItems:localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem('totalItems')) : [],
}


const cartSlice = createSlice({
    name:"Cart",
    initialState:initialState,
    reducers:{
        Addtocart:(state,action)=>{
            const ticket = action.payload
            const index  = state.cart.findIndex((item) => item._id === ticket._id)
            if(index >=1){
                toast.error("Ticket already added to cart")
                return
            }
            
            state.cart.push(ticket)
            state.totalItems++
            state.total += ticket.price

            localStorage.setItem("cart",JSON.stringify(state.cart))
            localStorage.setItem("total",JSON.stringify(state.total))
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems))
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
                localStorage.setItem("total",JSON.stringify(state.total))
                localStorage.setItem("totalItems",JSON.stringify(state.totalItems))
                toast.success("Ticket removed from cart")
            }
        },
        resetcart:(state)=>{
            state.cart = []
            state.total = 0
            state.totalItems = 0
            localStorage.removeItem("cart")
            localStorage.removeItem("total")
            localStorage.removeItem("totalItems")
            toast.success("Cart reset successfully")
        },

    }
})


export const {Addtocart,removefromcart,resetcart} = cartSlice.actions

export default cartSlice.reducer