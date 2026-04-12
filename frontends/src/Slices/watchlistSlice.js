import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    movies: [],
    loaded: false,
}

const watchlistSlice = createSlice({
    name: "watchlist",
    initialState,
    reducers: {
        setWatchlist(state, action) {
            state.movies = action.payload
            state.loaded = true
        },
        addToWatchlist(state, action) {
            const movie = action.payload
            const exists = state.movies.some((m) => m._id === movie._id)
            if (!exists) {
                state.movies.push(movie)
            }
        },
        removeFromWatchlist(state, action) {
            const movieId = action.payload
            state.movies = state.movies.filter((m) => m._id !== movieId)
        },
        clearWatchlist(state) {
            state.movies = []
            state.loaded = false
        },
    },
})

export const { setWatchlist, addToWatchlist, removeFromWatchlist, clearWatchlist } = watchlistSlice.actions
export default watchlistSlice.reducer
