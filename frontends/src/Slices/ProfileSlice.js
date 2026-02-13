// ProfileSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  likes: 0,
  dislikes: 0,
  cooldownDate: localStorage.getItem("cooldownDate") || null, // ⬅️ CHANGED - Added cooldown
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  verification : localStorage.getItem("Verified") ? JSON.parse(localStorage.getItem("Verified")) : null,
  FormSubmitted:localStorage.getItem("Data_Submitted") || null
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState: initialState,
  reducers: {
    setloading: (state, value) => {
      state.loading = value.payload;
    },
    setlikes: (state, value) => {
      state.likes = value.payload;
    },
    setdislikes: (state, value) => {
      state.dislikes = value.payload;
    },
    setuser: (state, value) => {
      const safeUser = {
        // userName: value.payload.userName,
        usertype: value.payload.usertype,
         _id: value.payload._id?.toString()
      };
      state.user = safeUser;
      localStorage.setItem("user", JSON.stringify(safeUser));
    },  
    setverification : (state,value) =>{
      state.verification = value.payload
    },
    setCooldownDate: (state, action) => { // ⬅️ CHANGED - Added cooldown setter
      state.cooldownDate = action.payload;
      if (action.payload) {
        localStorage.setItem("cooldownDate", action.payload);
      } else {
        localStorage.removeItem("cooldownDate");
      }
    },
    loadUserFromLocalStorage: (state) => {
      const storedUser = localStorage.getItem("user");
      const storedCooldown = localStorage.getItem("cooldownDate"); // ⬅️ CHANGED - Load cooldown

      if (storedUser) {
        try {
          state.user = JSON.parse(storedUser);
        } catch (error) {
          console.error("Error parsing user from localStorage", error);
          localStorage.removeItem("user");
        }
      }

       if (storedCooldown) {
    try {
      state.cooldownDate = JSON.parse(storedCooldown); // <-- Parse properly
    } catch (error) {
      console.error("Error parsing cooldownDate from localStorage", error);
      localStorage.removeItem("cooldownDate");
    }
  }
    },
    setsubmit:(state,action)=>{
      localStorage.setItem("Data Submitted",true)
    }

  }
});

export const {
  setuser,
  setloading,
  setlikes,
  setdislikes,
  loadUserFromLocalStorage,
  setverification,
  setCooldownDate // ⬅️ CHANGED - Export cooldown setter
} = ProfileSlice.actions;

export default ProfileSlice.reducer;
