import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    castList: [],
    loading: false,
    selectedCast: null,
    error: null,
}

const castSlice = createSlice({
    name: "cast",
    initialState: initialState,
    reducers: {
        setCastList: (state, action) => {
            state.castList = action.payload
        },
        addCast: (state, action) => {
            state.castList.push(action.payload)
        },
        updateCast: (state, action) => {
            const { id, name, images } = action.payload
            const index = state.castList.findIndex(cast => cast._id === id)
            if (index !== -1) {
                if (name) state.castList[index].name = name
                if (images) state.castList[index].images = images
            }
        },
        removeCast: (state, action) => {
            state.castList = state.castList.filter(cast => cast._id !== action.payload)
        },
        setSelectedCast: (state, action) => {
            state.selectedCast = action.payload
        },
        setCastLoading: (state, action) => {
            state.loading = action.payload
        },
        setCastError: (state, action) => {
            state.error = action.payload
        },
    }
})

export const {
    setCastList,
    addCast,
    updateCast,
    removeCast,
    setSelectedCast,
    setCastLoading,
    setCastError
} = castSlice.actions

export default castSlice.reducer
