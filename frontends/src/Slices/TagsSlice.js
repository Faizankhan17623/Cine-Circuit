import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tags: [],
    loading: false,
    error: null,
}

const tagsSlice = createSlice({
    name: "tags",
    initialState: initialState,
    reducers: {
        setTags: (state, action) => {
            state.tags = action.payload
        },
        addTag: (state, action) => {
            state.tags.push(action.payload)
        },
        updateTag: (state, action) => {
            const { id, name } = action.payload
            const index = state.tags.findIndex(tag => tag._id === id)
            if (index !== -1) {
                state.tags[index].name = name
            }
        },
        removeTag: (state, action) => {
            state.tags = state.tags.filter(tag => tag._id !== action.payload)
        },
        setTagsLoading: (state, action) => {
            state.loading = action.payload
        },
        setTagsError: (state, action) => {
            state.error = action.payload
        },
    }
})

export const { setTags, addTag, updateTag, removeTag, setTagsLoading, setTagsError } = tagsSlice.actions
export default tagsSlice.reducer
