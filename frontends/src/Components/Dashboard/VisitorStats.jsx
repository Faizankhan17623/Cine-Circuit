import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MdPeople, MdRefresh, MdTrendingUp, MdToday, MdPersonAdd, MdCalendarMonth } from "react-icons/md"
import { FetchVisitorStats } from "../../Services/operations/VisitorStats"

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon className="text-xl text-white" />
        </div>
        <div>
            <p className="text-[#555] text-xs">{label}</p>
            <p className="text-white text-xl font-bold tabular-nums">{value ?? 0}</p>
        </div>
    </div>
)

const VisitorStats = () => {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)

    const [summary, setSummary] = useState(null)
    const [visitors, setVisitors] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const loadStats = async () => {
        setLoading(true)
        const result = await dispatch(FetchVisitorStats(token, page))
        if (result.success) {
            setSummary(result.data.summary)
            setVisitors(result.data.visitors)
            setTotal(result.data.pagination.total)
            setTotalPages(result.data.pagination.totalPages)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadStats()
    }, [page])

    const formatDate = (dateStr) => {
        if (!dateStr) return "—"
        return new Date(dateStr).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
    }

    return (
        <div className="w-full h-full p-4 md:p-6 lg:p-8 text-white overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/30">
                        <MdPeople className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Visitor Stats</h1>
                        <p className="text-[#666] text-xs">{total} unique IP{total !== 1 ? "s" : ""} recorded</p>
                    </div>
                </div>
                <button
                    onClick={loadStats}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] border border-[#2a2a2a] hover:border-blue-600/30 text-[#aaa] hover:text-white rounded-lg text-sm transition-all duration-200 disabled:opacity-50"
                >
                    <MdRefresh className={`text-base ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Summary cards */}
            {summary && (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
                    <StatCard icon={MdPeople}       label="Total Unique Visitors" value={summary.totalUnique}    color="bg-blue-600" />
                    <StatCard icon={MdTrendingUp}   label="Total Page Visits"     value={summary.totalVisits}    color="bg-purple-600" />
                    <StatCard icon={MdToday}        label="Visitors Today"        value={summary.visitorsToday}  color="bg-green-600" />
                    <StatCard icon={MdPersonAdd}    label="New Visitors Today"    value={summary.newVisitorsToday} color="bg-orange-600" />
                </div>
            )}

            {/* Extra range stats */}
            {summary && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3">
                        <MdCalendarMonth className="text-blue-400 text-xl flex-shrink-0" />
                        <div>
                            <p className="text-[#555] text-xs">Last 7 Days</p>
                            <p className="text-white text-lg font-bold tabular-nums">{summary.visitors7Days}</p>
                        </div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3">
                        <MdCalendarMonth className="text-purple-400 text-xl flex-shrink-0" />
                        <div>
                            <p className="text-[#555] text-xs">Last 30 Days</p>
                            <p className="text-white text-lg font-bold tabular-nums">{summary.visitors30Days}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Visitors table */}
            <div className="mb-4">
                <h2 className="text-[#555] text-xs uppercase tracking-widest mb-3">Top Visitors by Visit Count</h2>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-[#555]">
                    <MdRefresh className="animate-spin text-2xl mr-2" /> Loading...
                </div>
            ) : visitors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#555]">
                    <MdPeople className="text-5xl mb-3 opacity-30" />
                    <p className="text-sm">No visitor data yet</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {visitors.map((v, index) => (
                        <div
                            key={v._id}
                            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="text-[#444] text-xs font-mono w-6 flex-shrink-0">
                                    {(page - 1) * 20 + index + 1}
                                </span>
                                <span className="text-[#aaa] text-sm font-mono truncate">{v.ip}</span>
                            </div>
                            <div className="flex items-center gap-6 flex-shrink-0 text-right">
                                <div>
                                    <p className="text-[#555] text-xs">Visits</p>
                                    <p className="text-blue-400 font-bold tabular-nums">{v.visitCount}</p>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[#555] text-xs">First Seen</p>
                                    <p className="text-[#777] text-xs">{formatDate(v.createdAt)}</p>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-[#555] text-xs">Last Seen</p>
                                    <p className="text-[#777] text-xs">{formatDate(v.lastVisited)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 bg-[#1e1e1e] border border-[#2a2a2a] text-[#888] hover:text-white rounded-lg text-xs disabled:opacity-40 transition-colors"
                    >
                        Prev
                    </button>
                    <span className="text-[#666] text-xs">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 bg-[#1e1e1e] border border-[#2a2a2a] text-[#888] hover:text-white rounded-lg text-xs disabled:opacity-40 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}

        </div>
    )
}

export default VisitorStats
