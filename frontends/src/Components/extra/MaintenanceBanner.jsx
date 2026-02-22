import { useSelector } from "react-redux"

const MaintenanceBanner = () => {
    const { isActive, message, endTime } = useSelector((state) => state.maintenance)

    if (!isActive) return null

    const endLabel = endTime
        ? new Date(endTime).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              dateStyle: "medium",
              timeStyle: "short",
          })
        : null

    const ticker = endLabel
        ? `${message}  •  Expected back online: ${endLabel}  •  We apologize for the inconvenience.`
        : `${message}  •  We apologize for the inconvenience. Please check back soon.`

    // Duplicate text so the scroll feels seamless
    const tickerText = `${ticker}     \u00A0\u00A0\u00A0\u00A0\u00A0     ${ticker}`

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[9998] overflow-hidden"
            style={{ background: "linear-gradient(90deg, #b20710 0%, #e50914 50%, #b20710 100%)" }}
        >
            <div className="flex items-center h-8">
                <div className="shrink-0 bg-black bg-opacity-30 px-3 h-full flex items-center">
                    <span className="text-white text-xs font-bold tracking-widest uppercase whitespace-nowrap">
                        ⚙ Maintenance
                    </span>
                </div>
                <div className="overflow-hidden flex-1">
                    <div
                        className="whitespace-nowrap text-white text-xs font-medium"
                        style={{
                            display: "inline-block",
                            animation: "maintenance-scroll 30s linear infinite",
                            paddingLeft: "100%",
                        }}
                    >
                        {tickerText}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes maintenance-scroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    )
}

export default MaintenanceBanner
