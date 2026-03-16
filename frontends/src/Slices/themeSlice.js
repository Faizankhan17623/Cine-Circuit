import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem('theme') || 'dark'

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme: savedTheme
    },
    reducers: {
        toggleTheme(state) {
            state.theme = state.theme === 'dark' ? 'dim' : 'dark'
            localStorage.setItem('theme', state.theme)
        },
        setTheme(state, action) {
            state.theme = action.payload
            localStorage.setItem('theme', action.payload)
        }
    }
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
