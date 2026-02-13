import { createSlice } from "@reduxjs/toolkit";
const intinialState = {
    theatre:[],
    loading:false,
    image:"",
    user:null
}

const TheatreSlice = createSlice({
    name:"Theatre",
    initialState:intinialState,
    reducers:{
        setTheatre:(state,value)=>{
            state.theatre = value.payload
        },
        setLoading:(state,value)=>{
            state.loading = value.payload
        },
        setImage:(state,value)=>{
            state.image = value.payload
        },
        setUser:(state,value)=>{
            state.user = value.payload
        }
    }
})

export const {setTheatre,setLoading,setImage,setUser} = TheatreSlice.actions
export default TheatreSlice.reducer