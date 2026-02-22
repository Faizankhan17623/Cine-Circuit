import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isActive: false,
    message: "",
    endTime: null,
}

const maintenanceSlice = createSlice({
    name: "maintenance",
    initialState,
    reducers: {
        setMaintenance(state, action) {
            state.isActive = action.payload.isActive
            state.message = action.payload.message
            state.endTime = action.payload.endTime
        },
        clearMaintenance(state) {
            state.isActive = false
            state.message = ""
            state.endTime = null
        }
    }
})

export const { setMaintenance, clearMaintenance } = maintenanceSlice.actions
export default maintenanceSlice.reducer
