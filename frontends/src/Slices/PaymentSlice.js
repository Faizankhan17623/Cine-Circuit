import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    loading:false
}

const PaymentSlice = createSlice({
    name:"payment",
    initialState,
    reducers:{
        setUser(state,value){
            state.user = value.payload
        },
        setLoading(state,value){
            state.loading = value.payload
        }
    }
})



export const {setUser,setLoading} = PaymentSlice.actions
export default  PaymentSlice.reducers