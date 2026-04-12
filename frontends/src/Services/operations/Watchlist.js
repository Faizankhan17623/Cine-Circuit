import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { WatchlistApi } from "../Apis/UserApi"
import { addToWatchlist, removeFromWatchlist, setWatchlist } from "../../Slices/watchlistSlice"

const { AddToWatchlist, RemoveFromWatchlist, MyWatchlist } = WatchlistApi

export function fetchMyWatchlist(token) {
    return async (dispatch) => {
        try {
            const response = await apiConnector("GET", MyWatchlist, null, {
                Authorization: `Bearer ${token}`,
            })
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch watchlist")
            }
            dispatch(setWatchlist(response.data.data))
            return { success: true, data: response.data.data }
        } catch (error) {
            console.error("fetchMyWatchlist error:", error)
            return { success: false, data: [] }
        }
    }
}

export function addMovieToWatchlist(movieId, movie, token) {
    return async (dispatch) => {
        try {
            const response = await apiConnector("POST", AddToWatchlist, { movieId }, {
                Authorization: `Bearer ${token}`,
            })
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to add to watchlist")
            }
            dispatch(addToWatchlist(movie))
            toast.success("Added to Watchlist")
            return { success: true }
        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to add to watchlist"
            if (msg === "Movie already in watchlist") {
                toast.error("Already in your Watchlist")
            } else {
                toast.error(msg)
            }
            return { success: false }
        }
    }
}

export function removeMovieFromWatchlist(movieId, token) {
    return async (dispatch) => {
        try {
            const response = await apiConnector("DELETE", RemoveFromWatchlist, { movieId }, {
                Authorization: `Bearer ${token}`,
            })
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to remove from watchlist")
            }
            dispatch(removeFromWatchlist(movieId))
            toast.success("Removed from Watchlist")
            return { success: true }
        } catch (error) {
            console.error("removeMovieFromWatchlist error:", error)
            toast.error(error?.response?.data?.message || "Failed to remove from watchlist")
            return { success: false }
        }
    }
}
