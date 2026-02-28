import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MdBugReport, MdClose, MdUpload, MdDelete } from "react-icons/md"
import { FiAlertTriangle } from "react-icons/fi"
import { SubmitBugReport } from "../../Services/operations/BugReport"

const BugReportModal = ({ open, onClose }) => {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([])
    const [videos, setVideos] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [videoPreviews, setVideoPreviews] = useState([])
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(null)

    const imageRef = useRef()
    const videoRef = useRef()

    if (!token || !user || !open) return null

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        if (images.length + files.length > 5) {
            return
        }
        setImages((prev) => [...prev, ...files])
        const previews = files.map((f) => URL.createObjectURL(f))
        setImagePreviews((prev) => [...prev, ...previews])
    }

    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files)
        if (videos.length + files.length > 2) {
            return
        }
        setVideos((prev) => [...prev, ...files])
        const previews = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))
        setVideoPreviews((prev) => [...prev, ...previews])
    }

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const removeVideo = (index) => {
        setVideos((prev) => prev.filter((_, i) => i !== index))
        setVideoPreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const handleClose = () => {
        setTitle("")
        setDescription("")
        setImages([])
        setVideos([])
        setImagePreviews([])
        setVideoPreviews([])
        setSubmitted(null)
        onClose()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !description.trim()) return

        const formData = new FormData()
        formData.append("title", title.trim())
        formData.append("description", description.trim())
        images.forEach((img) => formData.append("images", img))
        videos.forEach((vid) => formData.append("videos", vid))

        setLoading(true)
        const result = await dispatch(SubmitBugReport(formData, token, (data) => {
            setSubmitted(data)
        }))
        setLoading(false)
    }

    return (
        <div
            className="fixed inset-0 z-[9991] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
                    <div className="w-full max-w-lg bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] bg-gradient-to-r from-red-900/30 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-red-600/20 border border-red-600/30 rounded-lg flex items-center justify-center">
                                    <MdBugReport className="text-red-500 text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-base">Report a Bug</h2>
                                    <p className="text-[#666] text-xs">Help us improve Cine Circuit</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-[#666] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                            >
                                <MdClose className="text-xl" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
                            {submitted ? (
                                /* Success State */
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">✅</span>
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-2">Report Submitted!</h3>
                                    <p className="text-[#999] text-sm mb-4">We've received your bug report and sent a confirmation to your email.</p>
                                    <div className="bg-[#1e1e1e] border border-dashed border-red-600/40 rounded-xl p-4 mb-5">
                                        <p className="text-[#666] text-xs uppercase tracking-widest mb-1">Your Bug ID</p>
                                        <p className="text-red-500 font-mono font-bold text-xl tracking-wider">{submitted.bugId}</p>
                                    </div>
                                    <p className="text-[#777] text-xs">You can track it in <strong className="text-[#aaa]">My Bug Reports</strong> in your dashboard.</p>
                                    <button
                                        onClick={handleClose}
                                        className="mt-5 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                /* Form */
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-[#aaa] text-xs uppercase tracking-widest mb-2">
                                            Bug Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Payment fails on checkout"
                                            maxLength={120}
                                            required
                                            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] focus:border-red-600/50 text-white text-sm rounded-lg px-4 py-3 outline-none transition-colors placeholder-[#555]"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-[#aaa] text-xs uppercase tracking-widest mb-2">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe what happened, what you expected, and how to reproduce it..."
                                            rows={4}
                                            maxLength={2000}
                                            required
                                            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] focus:border-red-600/50 text-white text-sm rounded-lg px-4 py-3 outline-none transition-colors placeholder-[#555] resize-none"
                                        />
                                        <p className="text-[#555] text-xs mt-1 text-right">{description.length}/2000</p>
                                    </div>

                                    {/* Images */}
                                    <div>
                                        <label className="block text-[#aaa] text-xs uppercase tracking-widest mb-2">
                                            Screenshots <span className="text-[#555]">(up to 5)</span>
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            ref={imageRef}
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        {imagePreviews.length < 5 && (
                                            <button
                                                type="button"
                                                onClick={() => imageRef.current.click()}
                                                className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#3a3a3a] hover:border-red-600/40 text-[#666] hover:text-[#aaa] rounded-lg text-sm transition-colors w-full justify-center"
                                            >
                                                <MdUpload className="text-lg" />
                                                Add Screenshots
                                            </button>
                                        )}
                                        {imagePreviews.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {imagePreviews.map((src, i) => (
                                                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#2a2a2a]">
                                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(i)}
                                                            className="absolute top-0.5 right-0.5 bg-black/70 rounded-full p-0.5 text-red-400 hover:text-red-300"
                                                        >
                                                            <MdDelete className="text-xs" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Videos */}
                                    <div>
                                        <label className="block text-[#aaa] text-xs uppercase tracking-widest mb-2">
                                            Videos <span className="text-[#555]">(up to 2)</span>
                                        </label>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            multiple
                                            ref={videoRef}
                                            onChange={handleVideoChange}
                                            className="hidden"
                                        />
                                        {videoPreviews.length < 2 && (
                                            <button
                                                type="button"
                                                onClick={() => videoRef.current.click()}
                                                className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#3a3a3a] hover:border-red-600/40 text-[#666] hover:text-[#aaa] rounded-lg text-sm transition-colors w-full justify-center"
                                            >
                                                <MdUpload className="text-lg" />
                                                Add Video
                                            </button>
                                        )}
                                        {videoPreviews.length > 0 && (
                                            <div className="flex flex-col gap-2 mt-2">
                                                {videoPreviews.map((vid, i) => (
                                                    <div key={i} className="flex items-center justify-between bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg px-3 py-2">
                                                        <span className="text-[#aaa] text-xs truncate max-w-[260px]">{vid.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVideo(i)}
                                                            className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0"
                                                        >
                                                            <MdDelete className="text-base" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info note */}
                                    <div className="flex items-start gap-2 bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2.5">
                                        <FiAlertTriangle className="text-red-500/70 text-sm flex-shrink-0 mt-0.5" />
                                        <p className="text-[#777] text-xs leading-relaxed">
                                            Your report will be reviewed by our admin team. You'll receive an email confirmation and a notification when it's resolved.
                                        </p>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={loading || !title.trim() || !description.trim()}
                                        className="w-full py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-all duration-200"
                                    >
                                        {loading ? "Submitting..." : "Submit Bug Report"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
        </div>
    )
}

export default BugReportModal
