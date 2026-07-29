import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { MdContentCopy, MdRefresh, MdPeople, MdCheckCircle, MdHourglassEmpty } from "react-icons/md"
import { FaGift, FaWhatsapp } from "react-icons/fa"
import { getMyReferral } from "../../Services/operations/Referral"

const StatCard = ({ icon, label, value }) => (
    <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-4">
        <div className="flex items-center gap-2 text-richblack-300 text-xs uppercase tracking-wider font-semibold">
            {icon}
            {label}
        </div>
        <p className="text-2xl font-bold text-white mt-2">{value}</p>
    </div>
)

const Referrals = () => {
    const { token } = useSelector((state) => state.auth)

    const [details, setDetails] = useState(null)
    const [loading, setLoading] = useState(false)

    const loadReferrals = async () => {
        setLoading(true)
        const result = await getMyReferral(token)
        if (result.success) setDetails(result.data)
        else toast.error(result.message)
        setLoading(false)
    }

    useEffect(() => {
        loadReferrals()
    }, [])

    const inviteLink = details
        ? `${window.location.origin}/SignUp?ref=${details.referralCode}`
        : ""

    const copy = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success(`${label} copied`)
        } catch {
            toast.error("Could not copy to clipboard")
        }
    }

    const shareOnWhatsapp = () => {
        const message = `Book movie tickets on Cine Circuit with my code ${details.referralCode} and get ₹${details.refereeReward} in your wallet after your first booking: ${inviteLink}`
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener")
    }

    const fmt = (dateStr) => {
        if (!dateStr) return "—"
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
        })
    }

    return (
        <div className="min-h-screen bg-richblack-900 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <FaGift className="text-2xl text-yellow-100" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Refer &amp; Earn</h1>
                        <p className="text-sm text-richblack-300">
                            {details
                                ? `You get ₹${details.referrerReward}, your friend gets ₹${details.refereeReward} — credited after their first booking`
                                : "Invite friends and earn wallet credit"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={loadReferrals}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-richblack-800 border border-richblack-700 text-richblack-100 text-sm hover:bg-richblack-700 transition-colors"
                >
                    <MdRefresh /> Refresh
                </button>
            </div>

            {loading && !details && (
                <p className="text-richblack-300">Loading your referral details...</p>
            )}

            {details && (
                <>
                    {/* Code + share */}
                    <div className="bg-gradient-to-r from-richblack-800 to-richblack-700 border border-richblack-600 rounded-xl p-6 mb-6">
                        <p className="text-xs uppercase tracking-wider text-richblack-300 font-semibold mb-2">Your referral code</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-3xl font-bold tracking-[0.2em] text-yellow-100">{details.referralCode}</span>
                            <button
                                onClick={() => copy(details.referralCode, "Code")}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-100 text-richblack-900 text-sm font-semibold hover:bg-yellow-50 transition-colors"
                            >
                                <MdContentCopy /> Copy code
                            </button>
                            <button
                                onClick={() => copy(inviteLink, "Invite link")}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-richblack-900 border border-richblack-600 text-richblack-50 text-sm hover:bg-richblack-800 transition-colors"
                            >
                                <MdContentCopy /> Copy invite link
                            </button>
                            <button
                                onClick={shareOnWhatsapp}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-colors"
                            >
                                <FaWhatsapp /> Share
                            </button>
                        </div>
                        <p className="text-xs text-richblack-400 mt-3 break-all">{inviteLink}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard icon={<MdPeople className="text-blue-400" />} label="Invited" value={details.stats.total} />
                        <StatCard icon={<MdHourglassEmpty className="text-yellow-400" />} label="Pending" value={details.stats.pending} />
                        <StatCard icon={<MdCheckCircle className="text-green-400" />} label="Completed" value={details.stats.completed} />
                        <StatCard icon={<FaGift className="text-yellow-100" />} label="Earned" value={`₹${details.stats.totalEarned}`} />
                    </div>

                    {/* Invite list */}
                    <div className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-richblack-700">
                            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Your invites</h2>
                        </div>

                        {details.referrals.length === 0 ? (
                            <p className="px-5 py-8 text-center text-richblack-300 text-sm">
                                No one has signed up with your code yet — share it to start earning.
                            </p>
                        ) : (
                            <ul className="divide-y divide-richblack-700">
                                {details.referrals.map((referral) => (
                                    <li key={referral._id} className="flex items-center justify-between gap-4 px-5 py-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {referral.user?.image && (
                                                <img src={referral.user.image} alt="" className="w-9 h-9 rounded-full" />
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-white text-sm font-medium truncate">
                                                    {referral.user?.userName || "Deleted user"}
                                                </p>
                                                <p className="text-xs text-richblack-400">Joined {fmt(referral.joinedAt)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            {referral.status === "completed" ? (
                                                <>
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-green-400/10 border-green-400/25 text-green-400">
                                                        <MdCheckCircle /> Rewarded
                                                    </span>
                                                    <p className="text-xs text-richblack-400 mt-1">+₹{referral.reward}</p>
                                                </>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-yellow-400/10 border-yellow-400/25 text-yellow-400">
                                                    <MdHourglassEmpty /> Awaiting first booking
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Referrals
