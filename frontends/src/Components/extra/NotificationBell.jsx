import { useEffect, useState } from 'react'
import { FaBell, FaCheck } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { apiConnector } from '../../Services/apiConnector'
import { NotificationApi } from '../../Services/Apis/UserApi'
import { addNotification, markAllNotificationsRead, markNotificationRead, setNotifications } from '../../Slices/notificationSlice'
import { connectSocket, getSocket } from '../../Services/socket'

const NotificationBell = () => {
  const dispatch = useDispatch()
  const { token } = useSelector(state => state.auth)
  const { items, unreadCount } = useSelector(state => state.notifications)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!token) return undefined
    apiConnector('GET', NotificationApi.list, null, { Authorization: `Bearer ${token}` })
      .then(response => { if (response.data.success) dispatch(setNotifications(response.data)) })
      .catch(() => {})
    const socket = connectSocket()
    const onNotification = notification => dispatch(addNotification(notification))
    socket?.on('notification:new', onNotification)
    return () => { getSocket()?.off('notification:new', onNotification) }
  }, [dispatch, token])

  const readOne = async (notification) => {
    if (!notification.readAt) {
      dispatch(markNotificationRead(notification._id))
      await apiConnector('PATCH', NotificationApi.markRead(notification._id), null, { Authorization: `Bearer ${token}` }).catch(() => {})
    }
    if (notification.link) window.location.href = notification.link
  }

  const readAll = async () => {
    dispatch(markAllNotificationsRead())
    await apiConnector('PATCH', NotificationApi.markAllRead, null, { Authorization: `Bearer ${token}` }).catch(() => {})
  }

  if (!token) return null
  return <div className="relative">
    <button aria-label="Notifications" title="Notifications" onClick={() => setOpen(value => !value)} className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-richblack-700 transition-colors">
      <FaBell className="text-lg text-richblack-100" />
      {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-4 h-4 px-1 rounded-full bg-yellow-400 text-richblack-900 text-[10px] font-bold flex items-center justify-center">{unreadCount > 99 ? '99+' : unreadCount}</span>}
    </button>
    {open && <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-full mt-2 z-50 w-80 max-h-[28rem] overflow-hidden glass-card rounded-xl border border-richblack-600 shadow-2xl">
        <div className="px-4 py-3 border-b border-richblack-600 flex items-center justify-between"><h3 className="text-white font-semibold">Notifications</h3>{unreadCount > 0 && <button onClick={readAll} className="text-xs text-yellow-300 hover:text-yellow-200 flex items-center gap-1"><FaCheck /> Mark all read</button>}</div>
        <div className="max-h-96 overflow-y-auto">{items.length === 0 ? <p className="p-6 text-center text-sm text-richblack-300">You’re all caught up.</p> : items.map(notification => <button key={notification._id} onClick={() => readOne(notification)} className={`w-full text-left px-4 py-3 border-b border-richblack-700 hover:bg-richblack-700/70 ${notification.readAt ? '' : 'bg-yellow-400/5'}`}><div className="flex gap-2"><span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notification.readAt ? 'bg-richblack-500' : 'bg-yellow-300'}`} /><span><strong className="block text-sm text-white">{notification.title}</strong><span className="block text-xs text-richblack-300 mt-1">{notification.message}</span><span className="block text-[10px] text-richblack-500 mt-1">{new Date(notification.createdAt).toLocaleString()}</span></span></div></button>)}</div>
      </div>
    </>}
  </div>
}

export default NotificationBell
