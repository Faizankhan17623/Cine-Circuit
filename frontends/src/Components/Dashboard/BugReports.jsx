import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MdBugReport, MdClose, MdRefresh, MdImage, MdVideocam, MdOpenInNew } from "react-icons/md"
import { FiAlertCircle, FiClock, FiCheckCircle } from "react-icons/fi"
import { FetchAllBugReports, ChangeBugStatus } from "../../Services/operations/BugReport"

const STATUS_CONFIG = {
    open: { label: "Open", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/25", icon: FiAlertCircle },
    "in-progress": { label: "In Progress", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/25", icon: FiClock },
    resolved: { label: "Resolved", color: "text-green-400", bg: "bg-green-400/10 border-green-400/25", icon: FiCheckCircle },
}

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open
    const Icon = cfg.icon
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
            <Icon className="text-xs" />
            {cfg.label}
        </span>
    )
}

const BugReports = () => {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)

    const [reports, setReports] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1)
    const [filterStatus, setFilterStatus] = useState("")
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [newStatus, setNewStatus] = useState("")
    const [adminNote, setAdminNote] = useState("")
    const [updating, setUpdating] = useState(false)
    const [mediaModal, setMediaModal] = useState(null)

    const loadReports = async () => {
        setLoading(true)
        const result = await dispatch(FetchAllBugReports(token, filterStatus, page))
        if (result.success) {
            setReports(result.data)
            setTotal(result.total)
            setTotalPages(result.totalPages)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadReports()
    }, [filterStatus, page])

    const openDetail = (report) => {
        setSelected(report)
        setNewStatus(report.status)
        setAdminNote(report.adminNote || "")
    }

    const closeDetail = () => {
        setSelected(null)
        setNewStatus("")
        setAdminNote("")
    }

    const handleUpdateStatus = async () => {
        if (!selected || !newStatus) return
        setUpdating(true)
        const result = await dispatch(ChangeBugStatus(selected._id, newStatus, adminNote, token, (updated) => {
            setReports((prev) => prev.map((r) => (r._id === updated._id ? updated : r)))
            setSelected(updated)
        }))
        setUpdating(false)
    }

    const usertypeLabel = (type) => {
        const map = { Viewer: "Viewer", Organizer: "Organizer", Theatrer: "Theatre", Administrator: "Admin" }
        return map[type] || type
    }

    return (
        <div className="w-full h-full p-4 md:p-6 lg:p-8 text-white overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/30">
                        <MdBugReport className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Bug Reports</h1>
                        <p className="text-[#666] text-xs">{total} total report{total !== 1 ? "s" : ""}</p>
                    </div>
                </div>
                <button
                    onClick={loadReports}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] border border-[#2a2a2a] hover:border-red-600/30 text-[#aaa] hover:text-white rounded-lg text-sm transition-all duration-200 disabled:opacity-50"
                >
                    <MdRefresh className={`text-base ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {[
                    { value: "", label: "All" },
                    { value: "open", label: "Open" },
                    { value: "in-progress", label: "In Progress" },
                    { value: "resolved", label: "Resolved" },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => { setFilterStatus(tab.value); setPage(1) }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            filterStatus === tab.value
                                ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                                : "bg-[#1e1e1e] border border-[#2a2a2a] text-[#888] hover:text-white hover:border-red-600/30"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Reports list */}
            {loading ? (
                <div className="flex items-center justify-center py-16 text-[#555]">
                    <MdRefresh className="animate-spin text-2xl mr-2" /> Loading...
                </div>
            ) : reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#555]">
                    <MdBugReport className="text-5xl mb-3 opacity-30" />
                    <p className="text-sm">No bug reports found</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {reports.map((report) => (
                        <div
                            key={report._id}
                            onClick={() => openDetail(report)}
                            className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-red-600/25 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-[#1e1e1e]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-red-500 font-mono text-xs font-bold">{report.bugId}</span>
                                        <StatusBadge status={report.status} />
                                        <span className="text-[#444] text-xs">{usertypeLabel(report.reportedBy?.usertype)}</span>
                                    </div>
                                    <h3 className="text-white font-semibold text-sm truncate">{report.title}</h3>
                                    <p className="text-[#777] text-xs mt-1 line-clamp-2">{report.description}</p>
                                    <div className="flex items-center gap-3 mt-2 text-[#555] text-xs flex-wrap">
                                        <span>By <span className="text-[#888]">{report.reportedBy?.userName}</span></span>
                                        <span>{new Date(report.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                        {report.images?.length > 0 && (
                                            <span className="flex items-center gap-1 text-[#666]">
                                                <MdImage className="text-xs" /> {report.images.length}
                                            </span>
                                        )}
                                        {report.videos?.length > 0 && (
                                            <span className="flex items-center gap-1 text-[#666]">
                                                <MdVideocam className="text-xs" /> {report.videos.length}
                                            </span>
                                        )}
                                    </div>
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

            {/* Detail Modal */}
            {selected && (
                <div
                    className="fixed inset-0 z-[9992] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) closeDetail() }}
                >
                    <div className="w-full max-w-2xl bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-red-500 font-mono font-bold text-sm">{selected.bugId}</span>
                                <StatusBadge status={selected.status} />
                            </div>
                            <button onClick={closeDetail} className="text-[#666] hover:text-white transition-colors p-1">
                                <MdClose className="text-xl" />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
                            {/* Title & reporter */}
                            <div>
                                <h2 className="text-white font-bold text-lg leading-snug">{selected.title}</h2>
                                <p className="text-[#666] text-xs mt-1">
                                    Reported by <span className="text-[#aaa]">{selected.reportedBy?.userName}</span>
                                    {" · "}<span className="text-[#777]">{selected.reportedBy?.email}</span>
                                    {" · "}<span className="text-[#555]">{usertypeLabel(selected.reportedBy?.usertype)}</span>
                                    {" · "}{new Date(selected.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                </p>
                            </div>

                            {/* Description */}
                            <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-4">
                                <p className="text-[#555] text-xs uppercase tracking-widest mb-2">Description</p>
                                <p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                            </div>

                            {/* Images */}
                            {selected.images?.length > 0 && (
                                <div>
                                    <p className="text-[#555] text-xs uppercase tracking-widest mb-2">Screenshots ({selected.images.length})</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selected.images.map((url, i) => (
                                            <div key={i} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`screenshot-${i + 1}`}
                                                    className="w-24 h-24 object-cover rounded-lg border border-[#2a2a2a] cursor-pointer"
                                                    onClick={() => setMediaModal({ type: "image", url })}
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer"
                                                    onClick={() => setMediaModal({ type: "image", url })}>
                                                    <MdOpenInNew className="text-white text-lg" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Videos */}
                            {selected.videos?.length > 0 && (
                                <div>
                                    <p className="text-[#555] text-xs uppercase tracking-widest mb-2">Videos ({selected.videos.length})</p>
                                    <div className="flex flex-col gap-2">
                                        {selected.videos.map((url, i) => (
                                            <video
                                                key={i}
                                                src={url}
                                                controls
                                                className="w-full rounded-lg border border-[#2a2a2a] max-h-48 bg-black"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Admin note (existing) */}
                            {selected.adminNote && (
                                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                                    <p className="text-green-400 text-xs uppercase tracking-widest mb-2">Previous Admin Note</p>
                                    <p className="text-[#ccc] text-sm leading-relaxed">{selected.adminNote}</p>
                                </div>
                            )}

                            {/* Update Status */}
                            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex flex-col gap-3">
                                <p className="text-[#aaa] text-xs uppercase tracking-widest">Update Status</p>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="bg-[#111] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-red-600/40 transition-colors"
                                >
                                    <option value="open">Open</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Admin note (optional — will be included in the resolution email)"
                                    rows={3}
                                    maxLength={500}
                                    className="bg-[#111] border border-[#2a2a2a] focus:border-red-600/40 text-white text-sm rounded-lg px-3 py-2.5 outline-none resize-none placeholder-[#444] transition-colors"
                                />
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={updating || newStatus === selected.status && adminNote === (selected.adminNote || "")}
                                    className="py-2.5 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-all duration-200"
                                >
                                    {updating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Media full-screen viewer */}
            {mediaModal && (
                <div
                    className="fixed inset-0 z-[9995] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setMediaModal(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white"
                        onClick={() => setMediaModal(null)}
                    >
                        <MdClose className="text-3xl" />
                    </button>
                    <img
                        src={mediaModal.url}
                        alt="screenshot"
                        className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    )
}

export default BugReports
