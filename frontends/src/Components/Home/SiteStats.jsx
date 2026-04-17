import { useEffect, useRef, useState } from "react"
import { apiConnector } from "../../Services/apiConnector"
import { PublicStatsApi } from "../../Services/Apis/UserApi"
import { MdPeople, MdMovie, MdTrendingUp, MdConfirmationNumber } from "react-icons/md"

function useCountUp(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!start || target === 0) return
        const startTime = performance.now()
        const step = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [target, start, duration])

    return count
}

const formatNum = (n) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M+"
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K+"
    return n.toString()
}

const StatItem = ({ icon: Icon, label, value, color, animate }) => {
    const count = useCountUp(value, 2000, animate)
    return (
        <div className="flex flex-col items-center gap-3 px-6 py-2">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg`}>
                <Icon className="text-white text-2xl" />
            </div>
            <p className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
                {animate ? formatNum(count) : "—"}
            </p>
            <p className="text-richblack-400 text-sm text-center leading-tight">{label}</p>
        </div>
    )
}

const SiteStats = () => {
    const [stats, setStats] = useState(null)
    const [animate, setAnimate] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiConnector("GET", PublicStatsApi.GetPublicStats)
                if (res.data.success) setStats(res.data.data)
            } catch (e) {
                // silently fail — section just won't show numbers
            }
        }
        fetchStats()
    }, [])

    useEffect(() => {
        if (!ref.current) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setAnimate(true) },
            { threshold: 0.3 }
        )
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    const items = [
        { icon: MdTrendingUp,       label: "Total Page Visits",    value: stats?.totalVisits  || 0, color: "bg-blue-600"   },
        { icon: MdPeople,           label: "Registered Users",     value: stats?.totalUsers   || 0, color: "bg-purple-600" },
        { icon: MdMovie,            label: "Verified Shows",       value: stats?.totalShows   || 0, color: "bg-yellow-500" },
        { icon: MdConfirmationNumber, label: "Tickets Booked",     value: stats?.totalTickets || 0, color: "bg-green-600"  },
    ]

    return (
        <div ref={ref} className="w-full bg-richblack-900 border-y border-richblack-700">
            {/* Top accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />

            <div className="max-w-5xl mx-auto px-6 py-14">
                {/* Heading */}
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-2">
                        Platform in Numbers
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Trusted by movie lovers across India
                    </h2>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x divide-richblack-700">
                    {items.map((item) => (
                        <StatItem key={item.label} {...item} animate={animate} />
                    ))}
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
        </div>
    )
}

export default SiteStats
