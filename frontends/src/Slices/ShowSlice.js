import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show: [],
    loading: false,
    allshows: [],
    // Admin verification states
    verifiedShows: [],
    unverifiedShows: [],
    adminAllShows: [],
    verifyingShowId: null,
}

const showSlice = createSlice({
    name: "Show",   
    initialState: initialState,
    reducers: {
        setShow: (state, value) => {
            state.show = value.payload
        },
        setlaoding: (state, value) => {
            state.loading = value.payload
        },
        setallShow: (state, value) => {
            state.allshows = value.payload
        },
        // Admin verification reducers
        setVerifiedShows: (state, value) => {
            state.verifiedShows = value.payload
        },
        setUnverifiedShows: (state, value) => {
            state.unverifiedShows = value.payload
        },
        setAdminAllShows: (state, value) => {
            state.adminAllShows = value.payload
        },
        setVerifyingShowId: (state, value) => {
            state.verifyingShowId = value.payload
        },
        // Move show from unverified to verified after verification
        moveToVerified: (state, action) => {
            const showId = action.payload
            const show = state.unverifiedShows.find(s => s._id === showId)
            if (show) {
                state.unverifiedShows = state.unverifiedShows.filter(s => s._id !== showId)
                state.verifiedShows = [...state.verifiedShows, { ...show, VerifiedByTheAdmin: true }]
            }
        },
        // Move show from verified to unverified after unverification
        moveToUnverified: (state, action) => {
            const showId = action.payload
            const show = state.verifiedShows.find(s => s._id === showId)
            if (show) {
                state.verifiedShows = state.verifiedShows.filter(s => s._id !== showId)
                state.unverifiedShows = [...state.unverifiedShows, { ...show, VerifiedByTheAdmin: false }]
            }
        },
    }
})

export const {
    setShow,
    setlaoding,
    setallShow,
    setVerifiedShows,
    setUnverifiedShows,
    setAdminAllShows,
    setVerifyingShowId,
    moveToVerified,
    moveToUnverified
} = showSlice.actions

export default showSlice.reducer
