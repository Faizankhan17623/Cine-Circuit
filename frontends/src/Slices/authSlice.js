import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "",
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
  isLoggedIn:   localStorage.getItem("token") ? true : false,
  loading: false,
  image: localStorage.getItem("userImage") ? localStorage.getItem("userImage") : null,
  // Signup form between /SignUp and /OTP. Kept in memory only, never in router state/history.
  signupData: null
};

const authSlice = createSlice({
    name: "auth",
    initialState:initialState,
    reducers:{
        setUser(state,value){
            state.user = value.payload
        },
        setLoading(state,value){
            state.loading = value.payload
        },
        setToken(state,value){
            state.token = value.payload
        },
        setLogin(state,value){
            state.isLoggedIn = value.payload
        },
        setUserImage(state,value){
            state.image = value.payload
        },
        setSignupData(state,value){
            state.signupData = value.payload
        }
    }
})

export const {setUser,setLoading,setToken,setLogin,setUserImage,setSignupData} = authSlice.actions
export default authSlice.reducer