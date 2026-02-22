import { useSelector } from "react-redux"
import { ACCOUNT_TYPE } from "../../utils/constants"

const MaintenancePopup = () => {
    const { isActive, message, endTime } = useSelector((state) => state.maintenance)
    const { user } = useSelector((state) => state.profile)

    // Don't block admins — they need access to turn it off
    if (!isActive || user?.usertype === ACCOUNT_TYPE.ADMIN) return null

    const endLabel = endTime
        ? new Date(endTime).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              dateStyle: "full",
              timeStyle: "short",
          })
        : null

    return (
        <div className="fixed inset-0 z-[9997] flex items-center justify-center"
             style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}>
            <div
                className="max-w-md w-full mx-4 rounded-2xl overflow-hidden shadow-2xl"
                style={{
                    background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "0 0 60px rgba(229,9,20,0.15), 0 20px 60px rgba(0,0,0,0.6)",
                }}
            >
                {/* Header stripe */}
                <div style={{ background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)" }}
                     className="px-8 py-5 text-center">
                    <p className="text-white font-black text-xl tracking-[3px] uppercase m-0">
                        Cine Circuit
                    </p>
                    <p className="text-white text-opacity-80 text-xs tracking-[4px] uppercase mt-1 m-0">
                        Your Gateway to Cinema
                    </p>
                </div>

                {/* Icon */}
                <div className="flex justify-center pt-8 pb-2">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                        style={{
                            background: "linear-gradient(135deg, rgba(229,9,20,0.15), rgba(229,9,20,0.05))",
                            border: "2px solid rgba(229,9,20,0.35)",
                        }}
                    >
                        ⚙️
                    </div>
                </div>

                {/* Body */}
                <div className="px-8 pb-6 text-center">
                    <h2 className="text-white text-xl font-bold mt-4 mb-2">
                        Scheduled Maintenance
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                        We're upgrading our systems for a better experience
                    </p>

                    <div
                        className="rounded-xl px-5 py-4 mb-4 text-left"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(229,9,20,0.2)",
                        }}
                    >
                        <p className="text-sm leading-relaxed m-0" style={{ color: "rgba(255,255,255,0.75)" }}>
                            {message}
                        </p>
                    </div>

                    {endLabel && (
                        <div
                            className="rounded-xl px-5 py-4 text-center"
                            style={{
                                background: "rgba(229,9,20,0.08)",
                                border: "1px dashed rgba(229,9,20,0.3)",
                            }}
                        >
                            <p className="text-xs uppercase tracking-widest font-semibold mb-1 m-0"
                               style={{ color: "rgba(255,255,255,0.4)" }}>
                                Expected back online
                            </p>
                            <p className="text-base font-bold m-0" style={{ color: "#e50914" }}>
                                {endLabel}
                            </p>
                        </div>
                    )}

                    <p className="text-xs mt-5 m-0" style={{ color: "rgba(255,255,255,0.3)" }}>
                        We apologize for the inconvenience. Thank you for your patience.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default MaintenancePopup
