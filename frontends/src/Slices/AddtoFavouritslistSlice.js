import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    Add:localStorage.getItem('Movies')? JSON.parse(localStorage.getItem('Movies')) : [],
    total:localStorage.getItem('total')? JSON.parse(localStorage.getItem('total')) : 0,
}

const addtoFavouriteSlice = createSlice({
    name:"Favourites",
    initialState:initialState,
    reducers:{
        addFavourite:(state,action)=>{
            const movie = action.payload
            const index = state.Add.findIndex((item) => item._id === movie._id)
            if(index >= 0){
                return
            }
            state.Add.push(movie)
            state.total++
            localStorage.setItem('Movies',JSON.stringify(state.Add))
            localStorage.setItem('total',JSON.stringify(state.total))
            toast.success("Movie added to Favourites")   
        },
        removeFavourite:(state,action)=>{
            const movie = action.payload
            const index = state.Add.findIndex((item) => item._id === movie._id)
            if(index >= 0){
                state.Add.splice(index,1)
                state.total--
                localStorage.setItem('Movies',JSON.stringify(state.Add))
                localStorage.setItem('total',JSON.stringify(state.total))   
                toast.success("Movie removed from Favourites")
            }
        }
    }
})



export const {addFavourite,removeFavourite} = addtoFavouriteSlice.actions

export default addtoFavouriteSlice.reducer