import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], unreadCount: 0, loading: false },
  reducers: {
    setNotifications(state, action) {
      state.items = action.payload.items || []
      state.unreadCount = action.payload.unreadCount || 0
    },
    addNotification(state, action) {
      if (state.items.some(item => item._id === action.payload._id)) return
      state.items.unshift(action.payload)
      if (!action.payload.readAt) state.unreadCount += 1
    },
    markNotificationRead(state, action) {
      const item = state.items.find(notification => notification._id === action.payload)
      if (item && !item.readAt) { item.readAt = new Date().toISOString(); state.unreadCount = Math.max(0, state.unreadCount - 1) }
    },
    markAllNotificationsRead(state) {
      const now = new Date().toISOString()
      state.items.forEach(item => { item.readAt = item.readAt || now })
      state.unreadCount = 0
    },
    setNotificationLoading(state, action) { state.loading = action.payload }
  }
})

export const { setNotifications, addNotification, markNotificationRead, markAllNotificationsRead, setNotificationLoading } = notificationSlice.actions
export default notificationSlice.reducer
