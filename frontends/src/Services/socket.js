import { io } from 'socket.io-client'

let socket = null

function getToken() {
    const raw = localStorage.getItem('token')
    if (!raw) return null
    try {
        return JSON.parse(raw)
    } catch {
        return raw
    }
}

export function connectSocket() {
    const token = getToken()
    if (!token) return null

    if (socket && socket.connected) return socket

    if (!socket) {
        socket = io(import.meta.env.VITE_MAIN_BACKEND_URL, {
            auth: { token },
            withCredentials: true,
            autoConnect: false
        })
    } else {
        socket.auth = { token }
    }

    socket.connect()
    return socket
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}

export function getSocket() {
    return socket
}
