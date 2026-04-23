import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MdBugReport, MdClose, MdImage, MdVideocam, MdRefresh } from "react-icons/md"
import { FiAlertCircle, FiClock, FiCheckCircle } from "react-icons/fi"
import { FetchMyBugReports } from "../../Services/operations/BugReport"

const STATUS_CONFIG = {
    open:          { label: "Open",        color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/25", icon: FiAlertCircle },
    "in-progress": { label: "In Progress", color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/25",   icon: FiClock },
    resolved:      { label: "Resolved",    color: "text-green-400",  bg: "bg-green-400/10 border-green-400/25",  icon: FiCheckCircle },
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

const MyBugReports = () => {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)

    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [mediaModal, setMediaModal] = useState(null) // { type: 'image'|'video', url }
    const [filterStatus, setFilterStatus] = useState("")

    const loadReports = async () => {
        setLoading(true)
        const result = await dispatch(FetchMyBugReports(token))
        if (result.success) setReports(result.data)
        setLoading(false)
    }

    useEffect(() => {
        loadReports()
    }, [])

    const filtered = filterStatus
        ? reports.filter((r) => r.status === filterStatus)
        : reports

    const fmt = (dateStr) => {
        if (!dateStr) return "—"
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
        })
    }

    return (
        <div className="min-h-screen bg-richblack-900 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                        <MdBugReport className="text-red-400 text-xl" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-xl leading-tight">My Bug Reports</h1>
                        <p className="text-richblack-400 text-sm">{reports.length} report{reports.length !== 1 ? "s" : ""} submitted</p>
                    </div>
                </div>
                <button
                    onClick={loadReports}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-richblack-700 border border-richblack-600 text-richblack-300 hover:text-white hover:border-richblack-500 transition-all text-sm disabled:opacity-50"
                >
                    <MdRefresh className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-5 flex-wrap">
                {["", "open", "in-progress", "resolved"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            filterStatus === s
                                ? "bg-yellow-400/15 border-yellow-400/40 text-yellow-300"
                                : "bg-richblack-800 border-richblack-600 text-richblack-400 hover:text-white"
                        }`}
                    >
                        {s === "" ? "All" : STATUS_CONFIG[s]?.label}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 rounded-xl bg-richblack-800 animate-pulse border border-richblack-700" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <MdBugReport className="text-5xl text-richblack-600 mb-3" />
                    <p className="text-richblack-400 text-sm font-medium">
                        {filterStatus ? `No "${STATUS_CONFIG[filterStatus]?.label}" reports` : "You haven't submitted any bug reports yet"}
                    </p>
                    <p className="text-richblack-600 text-xs mt-1">Use the bug report button to report an issue</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((report) => (
                        <button
                            key={report._id}
                            onClick={() => setSelected(report)}
                            className="w-full text-left bg-richblack-800 border border-richblack-700 rounded-xl p-4 hover:border-richblack-500 hover:bg-richblack-700/60 transition-all group"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-richblack-500 text-xs font-mono">{report.bugId}</span>
                                        <StatusBadge status={report.status} />
                                        {report.status === "resolved" && report.adminNote && (
                                            <span className="text-xs text-green-400/70 italic">Admin note available</span>
                                        )}
                                    </div>
                                    <p className="text-white font-semibold text-sm truncate group-hover:text-yellow-200 transition-colors">
                                        {report.title}
                                    </p>
                                    <p className="text-richblack-400 text-xs mt-1 line-clamp-1">{report.description}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-richblack-500 text-xs">{fmt(report.createdAt)}</p>
                                    {report.status === "resolved" && report.resolvedAt && (
                                        <p className="text-green-500/70 text-xs mt-0.5">Resolved {fmt(report.resolvedAt)}</p>
                                    )}
                                    <div className="flex items-center gap-1.5 justify-end mt-1.5">
                                        {report.images?.length > 0 && (
                                            <span className="flex items-center gap-0.5 text-richblack-500 text-xs">
                                                <MdImage className="text-xs" />{report.images.length}
                                            </span>
                                        )}
                                        {report.videos?.length > 0 && (
                                            <span className="flex items-center gap-0.5 text-richblack-500 text-xs">
                                                <MdVideocam className="text-xs" />{report.videos.length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Detail modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="bg-richblack-800 border border-richblack-600 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">

                        {/* Modal header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-richblack-700 shrink-0">
                            <div className="flex items-center gap-2 min-w-0">
                                <MdBugReport className="text-red-400 text-lg shrink-0" />
                                <span className="text-white font-bold text-sm truncate">{selected.title}</span>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="text-richblack-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-richblack-700 shrink-0"
                            >
                                <MdClose />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-richblack-600 scrollbar-track-transparent">

                            {/* Meta */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-richblack-500 text-xs font-mono bg-richblack-700 px-2 py-1 rounded-lg">{selected.bugId}</span>
                                <StatusBadge status={selected.status} />
                                <span className="text-richblack-500 text-xs">Submitted {fmt(selected.createdAt)}</span>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="text-richblack-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Description</p>
                                <p className="text-richblack-100 text-sm leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                            </div>

                            {/* Admin note */}
                            {selected.adminNote && (
                                <div className="bg-green-500/10 border border-green-500/25 rounded-xl p-3">
                                    <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1">Admin Note</p>
                                    <p className="text-green-200 text-sm leading-relaxed">{selected.adminNote}</p>
                                    {selected.resolvedAt && (
                                        <p className="text-green-500/60 text-xs mt-2">Resolved on {fmt(selected.resolvedAt)}</p>
                                    )}
                                </div>
                            )}

                            {/* Resolution notice (no note but resolved) */}
                            {selected.status === "resolved" && !selected.adminNote && (
                                <div className="bg-green-500/10 border border-green-500/25 rounded-xl p-3 flex items-center gap-2">
                                    <FiCheckCircle className="text-green-400 shrink-0" />
                                    <p className="text-green-300 text-sm">
                                        This report has been resolved.
                                        {selected.resolvedAt && ` Resolved on ${fmt(selected.resolvedAt)}.`}
                                    </p>
                                </div>
                            )}

                            {/* In-progress notice */}
                            {selected.status === "in-progress" && (
                                <div className="bg-blue-500/10 border border-blue-500/25 rounded-xl p-3 flex items-center gap-2">
                                    <FiClock className="text-blue-400 shrink-0" />
                                    <p className="text-blue-300 text-sm">Our team is currently working on this issue.</p>
                                </div>
                            )}

                            {/* Images */}
                            {selected.images?.length > 0 && (
                                <div>
                                    <p className="text-richblack-400 text-xs font-semibold uppercase tracking-wider mb-2">
                                        Attached Images ({selected.images.length})
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {selected.images.map((url, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setMediaModal({ type: "image", url })}
                                                className="aspect-square rounded-lg overflow-hidden border border-richblack-600 hover:border-yellow-400/50 transition-colors"
                                            >
                                                <img src={url} alt={`bug-img-${i}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Videos */}
                            {selected.videos?.length > 0 && (
                                <div>
                                    <p className="text-richblack-400 text-xs font-semibold uppercase tracking-wider mb-2">
                                        Attached Videos ({selected.videos.length})
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {selected.videos.map((url, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setMediaModal({ type: "video", url })}
                                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-richblack-700 border border-richblack-600 hover:border-yellow-400/50 transition-colors text-left"
                                            >
                                                <MdVideocam className="text-blue-400 text-lg shrink-0" />
                                                <span className="text-richblack-200 text-xs truncate">Video {i + 1}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Media lightbox */}
            {mediaModal && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 px-4"
                    onClick={() => setMediaModal(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
                        onClick={() => setMediaModal(null)}
                    >
                        <MdClose />
                    </button>
                    {mediaModal.type === "image" ? (
                        <img
                            src={mediaModal.url}
                            alt="bug media"
                            className="max-w-full max-h-[85vh] rounded-xl object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <video
                            src={mediaModal.url}
                            controls
                            autoPlay
                            className="max-w-full max-h-[85vh] rounded-xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default MyBugReports
