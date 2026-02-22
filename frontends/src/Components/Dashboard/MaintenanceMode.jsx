import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toggleMaintenance } from "../../Services/operations/Maintenance"
import { MdConstruction, MdOutlineEmail, MdOutlineSchedule, MdOutlineMessage } from "react-icons/md"
import { FiAlertTriangle, FiPower, FiCheckCircle } from "react-icons/fi"
import { RiShieldKeyholeLine } from "react-icons/ri"

const MaintenanceMode = () => {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)
    const { isActive, message: currentMessage, endTime: currentEndTime } = useSelector((state) => state.maintenance)

    const [message, setMessage] = useState(
        currentMessage || "We are currently performing scheduled maintenance to improve your experience. Please check back soon."
    )
    const [endTime, setEndTime] = useState(
        currentEndTime ? new Date(currentEndTime).toISOString().slice(0, 16) : ""
    )
    const [notifyUsers, setNotifyUsers] = useState(true)
    const [loading, setLoading] = useState(false)

    const handleToggle = async (activate) => {
        setLoading(true)
        const payload = {
            isActive: activate,
            message,
            endTime: endTime || null,
            notifyUsers: activate ? notifyUsers : false,
        }
        await dispatch(toggleMaintenance(payload, token))
        setLoading(false)
    }

    const formattedEnd = currentEndTime
        ? new Date(currentEndTime).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              dateStyle: "medium",
              timeStyle: "short",
          })
        : null

    return (
        <div className="w-full h-full p-4 md:p-6 lg:p-8 text-white overflow-y-auto">

            {/* ── Header ── */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <MdConstruction className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Maintenance Mode
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Control site-wide maintenance — users are blocked, admins are not
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Live Status Banner ── */}
            <div className={`rounded-2xl p-5 mb-8 border flex items-center justify-between transition-all duration-500 ${
                isActive
                    ? "bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/10"
                    : "bg-green-500/10 border-green-500/25"
            }`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isActive ? "bg-red-500/20" : "bg-green-500/15"
                    }`}>
                        {isActive
                            ? <FiAlertTriangle className="text-red-400 text-xl" />
                            : <FiCheckCircle className="text-green-400 text-xl" />
                        }
                    </div>
                    <div>
                        <p className={`text-lg font-bold ${isActive ? "text-red-400" : "text-green-400"}`}>
                            {isActive ? "Maintenance is ACTIVE" : "Site is Live"}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {isActive
                                ? formattedEnd
                                    ? `Expected back online: ${formattedEnd}`
                                    : "No end time set — deactivate manually"
                                : "All users can access the site normally"
                            }
                        </p>
                    </div>
                </div>

                {/* Pulsing dot */}
                <div className="flex items-center gap-2 pr-1">
                    <div className={`relative w-3 h-3`}>
                        <div className={`absolute inset-0 rounded-full ${isActive ? "bg-red-500" : "bg-green-500"} animate-ping opacity-60`} />
                        <div className={`w-3 h-3 rounded-full ${isActive ? "bg-red-500" : "bg-green-500"}`} />
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-widest ${isActive ? "text-red-400" : "text-green-400"}`}>
                        {isActive ? "Active" : "Live"}
                    </span>
                </div>
            </div>

            {/* ── Config Cards ── */}
            <div className="grid grid-cols-1 gap-5 mb-6">

                {/* Message */}
                <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl border border-gray-700/40 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <MdOutlineMessage className="text-blue-400 text-base" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Maintenance Message</p>
                            <p className="text-xs text-gray-500">Shown to all users in the popup and banner</p>
                        </div>
                    </div>
                    <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "white",
                        }}
                        placeholder="Describe what is happening during maintenance..."
                    />
                </div>

                {/* End Time + Notify row */}
                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl border border-gray-700/40 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <MdOutlineSchedule className="text-orange-400 text-base" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Expected End Time</p>
                                <p className="text-xs text-gray-500">Leave blank for indefinite</p>
                            </div>
                        </div>
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition focus:ring-1 focus:ring-orange-500/40"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "white",
                                colorScheme: "dark",
                            }}
                        />
                        {endTime && (
                            <button
                                onClick={() => setEndTime("")}
                                className="mt-2 text-xs text-gray-500 hover:text-red-400 transition"
                            >
                                ✕ Clear end time
                            </button>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl border border-gray-700/40 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <MdOutlineEmail className="text-purple-400 text-base" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Email Notification</p>
                                <p className="text-xs text-gray-500">Blast email to all users</p>
                            </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-0.5">
                                <input
                                    type="checkbox"
                                    id="notify"
                                    checked={notifyUsers}
                                    onChange={(e) => setNotifyUsers(e.target.checked)}
                                    className="sr-only"
                                />
                                <div
                                    onClick={() => setNotifyUsers(p => !p)}
                                    className={`w-11 h-6 rounded-full transition-all duration-300 cursor-pointer flex items-center px-0.5 ${
                                        notifyUsers ? "bg-purple-600" : "bg-gray-700"
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                                        notifyUsers ? "translate-x-5" : "translate-x-0"
                                    }`} />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300 font-medium group-hover:text-white transition">
                                    {notifyUsers ? "Will notify all users" : "Skip email blast"}
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    {notifyUsers
                                        ? "All registered users will receive an email"
                                        : "Activate silently without emailing users"
                                    }
                                </p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* ── Warning Note ── */}
            <div className="flex items-start gap-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-5 py-4 mb-8">
                <RiShieldKeyholeLine className="text-yellow-400 text-lg shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300/70 leading-relaxed">
                    <strong className="text-yellow-300">Admin note:</strong> Admins are never blocked by maintenance mode — you can always log in and deactivate it. Regular users will see a full-screen popup and a scrolling red banner.
                </p>
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex gap-4">
                <button
                    onClick={() => handleToggle(true)}
                    disabled={loading || isActive}
                    className={`flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg ${
                        isActive || loading
                            ? "opacity-40 cursor-not-allowed bg-gray-700 text-gray-400"
                            : "bg-gradient-to-r from-red-600 to-rose-700 text-white hover:from-red-500 hover:to-rose-600 shadow-red-500/20 hover:shadow-red-500/30 active:scale-95"
                    }`}
                >
                    <FiAlertTriangle className="text-base" />
                    {loading ? "Updating..." : "Activate Maintenance"}
                </button>

                <button
                    onClick={() => handleToggle(false)}
                    disabled={loading || !isActive}
                    className={`flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 border ${
                        !isActive || loading
                            ? "opacity-40 cursor-not-allowed border-gray-700 text-gray-500 bg-transparent"
                            : "border-green-500/40 text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:border-green-500/60 active:scale-95"
                    }`}
                >
                    <FiPower className="text-base" />
                    {loading ? "Updating..." : "Deactivate Maintenance"}
                </button>
            </div>

        </div>
    )
}

export default MaintenanceMode
