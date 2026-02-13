import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  attempts: 0,
  status: "pending",
  editUntil: "",
  roleProfile: "",
  experienceprofile:"",
  rejectedData: null,
  lockeduntill:null
};

const orgainezerSlice = createSlice({
  name: "orgainezer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAttempts: (state, action) => {
      state.attempts = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setEditUntil: (state, action) => {
      state.editUntil = action.payload;
    },
    setRoleProfile: (state, action) => {
      state.roleProfile = action.payload;
    },
    setRoleExperience: (state, action) => {
      state.experienceprofile = action.payload;
    },
    setRejectedData: (state, action) => {
      state.rejectedData = action.payload;
    },
    setLockedUntill: (state, action) => {
      state.lockeduntill = action.payload;
    },
  },
});

export const {
  setLoading,
  setAttempts,
  setStatus,
  setEditUntil,
  setRoleProfile,
  setRoleExperience,
  setRejectedData,
  setLockedUntill
} = orgainezerSlice.actions;

export default orgainezerSlice.reducer;