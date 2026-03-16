import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FetchAuditLogs, DownloadAuditLogCSV } from "../../Services/operations/AuditLog"
import { MdOutlineDownload, MdRefresh, MdClose } from "react-icons/md"
import { FiShield, FiCheckCircle, FiXCircle } from "react-icons/fi"

const ACTION_COLORS = {
    CREATE: "text-green-400 bg-green-400/10 border-green-400/25",
    UPDATE: "text-blue-400 bg-blue-400/10 border-blue-400/25",
    DELETE: "text-red-400 bg-red-400/10 border-red-400/25",
    VERIFY: "text-purple-400 bg-purple-400/10 border-purple-400/25",
    TOGGLE: "text-yellow-400 bg-yellow-400/10 border-yellow-400/25",
    LOGIN:  "text-caribgreen-100 bg-caribgreen-100/10 border-caribgreen-100/25",
    LOGOUT: "text-richblack-300 bg-richblack-300/10 border-richblack-300/25",
    EXPORT: "text-brown-50 bg-brown-50/10 border-brown-50/25",
}

const RESOURCES = ["", "Show", "BugReport", "Maintenance", "Genre", "SubGenre", "Theatre", "User", "AuditLog"]
const ACTIONS   = ["", "CREATE", "UPDATE", "DELETE", "VERIFY", "TOGGLE", "LOGIN", "LOGOUT", "EXPORT"]

const ActionBadge = ({ action }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${ACTION_COLORS[action] || "text-richblack-100 bg-richblack-700 border-richblack-600"}`}>
        {action}
    </span>
)

const StatusBadge = ({ status }) => (
    status === "SUCCESS"
        ? <span className="inline-flex items-center gap-1 text-xs text-green-400"><FiCheckCircle /> SUCCESS</span>
        : <span className="inline-flex items-center gap-1 text-xs text-red-400"><FiXCircle /> FAILED</span>
)

const AuditLogs = () => {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)

    const [logs, setLogs] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(null)

    const [filters, setFilters] = useState({
        action: "", resource: "", status: "", dateFrom: "", dateTo: ""
    })

    const loadLogs = async () => {
        setLoading(true)
        const result = await dispatch(FetchAuditLogs(token, filters, page))
        if (result.success) {
            setLogs(result.data)
            setTotal(result.total)
            setTotalPages(result.totalPages)
        }
        setLoading(false)
    }

    useEffect(() => { loadLogs() }, [filters, page])

    const handleFilterChange = (key, value) => {
        setPage(1)
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleExport = () => dispatch(DownloadAuditLogCSV(token, filters))

    const formatDate = (dateStr) => {
        const d = new Date(dateStr)
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            + " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    }

    return (
        <div className="p-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                        <FiShield className="text-xl text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Activity Audit Log</h1>
                        <p className="text-sm text-richblack-300">{total} total records</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={loadLogs}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-richblack-700 hover:bg-richblack-600 transition-colors"
                    >
                        <MdRefresh className={`text-lg text-richblack-100 ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <MdOutlineDownload className="text-base" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
                <select
                    value={filters.action}
                    onChange={e => handleFilterChange("action", e.target.value)}
                    className="bg-richblack-800 border border-richblack-600 text-richblack-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                    <option value="">All Actions</option>
                    {ACTIONS.filter(Boolean).map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                <select
                    value={filters.resource}
                    onChange={e => handleFilterChange("resource", e.target.value)}
                    className="bg-richblack-800 border border-richblack-600 text-richblack-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                    <option value="">All Resources</option>
                    {RESOURCES.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <select
                    value={filters.status}
                    onChange={e => handleFilterChange("status", e.target.value)}
                    className="bg-richblack-800 border border-richblack-600 text-richblack-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                    <option value="">All Statuses</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="FAILED">FAILED</option>
                </select>

                <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={e => handleFilterChange("dateFrom", e.target.value)}
                    className="bg-richblack-800 border border-richblack-600 text-richblack-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                    placeholder="From"
                />
                <input
                    type="date"
                    value={filters.dateTo}
                    onChange={e => handleFilterChange("dateTo", e.target.value)}
                    className="bg-richblack-800 border border-richblack-600 text-richblack-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                    placeholder="To"
                />
            </div>

            {/* Table */}
            <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-richblack-700 bg-richblack-900/50">
                                <th className="text-left px-4 py-3 text-richblack-300 font-semibold">Timestamp</th>
                                <th className="text-left px-4 py-3 text-richblack-300 font-semibold">User</th>
                                <th className="text-left px-4 py-3 text-richblack-300 font-semibold">Action</th>
                                <th className="text-left px-4 py-3 text-richblack-300 font-semibold">Resource</th>
                                <th className="text-left px-4 py-3 text-richblack-300 font-semibold">Endpoint</th>
                                <th className="text-left px-4 py-3 text-richblack-300 font-semibold">IP</th>
                                <th className="text-left px-4 py-3 text-richblack-300 font-semibold">Status</th>
                                <th className="text-left px-4 py-3 text-richblack-300 font-semibold">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-richblack-400">Loading logs...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-richblack-400">No audit logs found</td>
                                </tr>
                            ) : logs.map((log, i) => (
                                <tr
                                    key={log._id}
                                    className={`border-b border-richblack-700/50 hover:bg-richblack-700/30 transition-colors ${i % 2 === 0 ? "" : "bg-richblack-900/20"}`}
                                >
                                    <td className="px-4 py-3 text-richblack-200 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                                    <td className="px-4 py-3">
                                        <p className="text-white text-xs font-medium">{log.userEmail}</p>
                                        <p className="text-richblack-400 text-xs">{log.userType}</p>
                                    </td>
                                    <td className="px-4 py-3"><ActionBadge action={log.action} /></td>
                                    <td className="px-4 py-3 text-richblack-200">{log.resource}</td>
                                    <td className="px-4 py-3 text-richblack-400 text-xs font-mono truncate max-w-[160px]">{log.endpoint}</td>
                                    <td className="px-4 py-3 text-richblack-400 text-xs font-mono">{log.ipAddress}</td>
                                    <td className="px-4 py-3"><StatusBadge status={log.status} /></td>
                                    <td className="px-4 py-3">
                                        {(log.changes?.before || log.changes?.after) && (
                                            <button
                                                onClick={() => setSelected(log)}
                                                className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                                            >
                                                View diff
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-richblack-700">
                        <p className="text-sm text-richblack-400">Page {page} of {totalPages}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 text-sm bg-richblack-700 text-richblack-100 rounded-lg disabled:opacity-40 hover:bg-richblack-600 transition-colors"
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 text-sm bg-richblack-700 text-richblack-100 rounded-lg disabled:opacity-40 hover:bg-richblack-600 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal — before/after diff */}
            {selected && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setSelected(null)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-richblack-800 border border-richblack-600 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-5 border-b border-richblack-700">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Change Details</h2>
                                    <p className="text-sm text-richblack-400 mt-0.5">{selected.resource} — {selected.action}</p>
                                </div>
                                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-richblack-700 transition-colors">
                                    <MdClose className="text-richblack-300" />
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-3 text-xs text-richblack-300">
                                    <div><span className="font-semibold text-richblack-100">User:</span> {selected.userEmail}</div>
                                    <div><span className="font-semibold text-richblack-100">Role:</span> {selected.userType}</div>
                                    <div><span className="font-semibold text-richblack-100">IP:</span> {selected.ipAddress}</div>
                                    <div><span className="font-semibold text-richblack-100">Time:</span> {formatDate(selected.createdAt)}</div>
                                    {selected.resourceId && (
                                        <div className="col-span-2"><span className="font-semibold text-richblack-100">Resource ID:</span> {selected.resourceId}</div>
                                    )}
                                </div>

                                {selected.changes?.before && (
                                    <div>
                                        <p className="text-xs font-semibold text-red-400 mb-1.5">Before</p>
                                        <pre className="bg-richblack-900 rounded-lg p-3 text-xs text-richblack-200 overflow-x-auto">
                                            {JSON.stringify(selected.changes.before, null, 2)}
                                        </pre>
                                    </div>
                                )}
                                {selected.changes?.after && (
                                    <div>
                                        <p className="text-xs font-semibold text-green-400 mb-1.5">After</p>
                                        <pre className="bg-richblack-900 rounded-lg p-3 text-xs text-richblack-200 overflow-x-auto">
                                            {JSON.stringify(selected.changes.after, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default AuditLogs
