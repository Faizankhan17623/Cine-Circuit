import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { GetUserDashStats, GetWalletAndLoyalty } from '../../Services/operations/User'
import {
  MdMovie, MdArrowForward, MdLocalActivity, MdBugReport,
  MdFavorite, MdChatBubble, MdConfirmationNumber, MdSettings,
  MdLogin, MdCalendarToday, MdAccountBalanceWallet
} from 'react-icons/md'
import { IoTicketSharp } from 'react-icons/io5'
import { FaHeart, FaBookmark, FaFilm } from 'react-icons/fa'
import { RiVipCrownFill, RiCoinFill } from 'react-icons/ri'

const colours = {
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'hover:border-yellow-400/40' },
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'hover:border-blue-400/40'   },
  green:  { text: 'text-green-400',  bg: 'bg-green-400/10',  border: 'hover:border-green-400/40'  },
  purple: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'hover:border-purple-400/40' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'hover:border-orange-400/40' },
  red:    { text: 'text-red-400',    bg: 'bg-red-400/10',    border: 'hover:border-red-400/40'    },
  pink:   { text: 'text-pink-400',   bg: 'bg-pink-400/10',   border: 'hover:border-pink-400/40'   },
}

const StatCard = ({ icon: Icon, label, value, sub, color }) => {
  const c = colours[color] || colours.yellow
  return (
    <div className={`glass-card rounded-xl p-5 ${c.border} transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-richblack-400 text-xs mb-1 truncate">{label}</p>
          <p className={`text-2xl font-bold tabular-nums ${c.text}`}>{value ?? 0}</p>
          {sub && <p className="text-richblack-400 text-xs mt-1 truncate">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg flex-shrink-0 ${c.bg}`}>
          <Icon className={`text-xl ${c.text}`} />
        </div>
      </div>
    </div>
  )
}

const QuickAction = ({ icon: Icon, label, to, color, desc }) => {
  const c = colours[color] || colours.yellow
  return (
    <Link to={to}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl glass-card ${c.border} hover:bg-richblack-700/30 transition-all duration-200`}>
        <div className={`p-2 rounded-lg flex-shrink-0 ${c.bg}`}>
          <Icon className={`text-base ${c.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate">{label}</p>
          {desc && <p className="text-xs text-richblack-400 mt-0.5 truncate">{desc}</p>}
        </div>
        <MdArrowForward className="text-richblack-500 text-sm flex-shrink-0" />
      </div>
    </Link>
  )
}

const StatusDot = ({ status }) => {
  const map = {
    success: 'bg-green-400 text-green-400',
    failure: 'bg-red-400 text-red-400',
    created: 'bg-yellow-400 text-yellow-400',
  }
  const cls = map[status] || 'bg-richblack-500 text-richblack-400'
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-opacity-10 border border-current/20 ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cls.split(' ')[0]}`} />
      {status}
    </span>
  )
}

const UserDashboardHome = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, image } = useSelector((s) => s.auth)
  const { user }         = useSelector((s) => s.profile)

  const [stats,   setStats]   = useState(null)
  const [wallet,  setWallet]  = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    const load = async () => {
      const res = await dispatch(GetUserDashStats(token, navigate))
      if (res?.success) setStats(res.data)
      setLoading(false)
    }
    load()

    const loadWallet = async () => {
      const res = await dispatch(GetWalletAndLoyalty(token))
      if (res?.success) setWallet(res.data)
    }
    loadWallet()
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-yellow-200 border-t-transparent rounded-full animate-spin" />
          <p className="text-richblack-400 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  const now      = new Date()
  const hour     = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const displayName = user?.userName || user?.firstName || 'there'

  return (
    <div className="p-5 text-white space-y-7 max-w-6xl">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-richblack-400 text-sm">{greeting},</p>
          <h1 className="text-2xl font-bold text-white mt-0.5">
            {displayName}{' '}
            <span className="text-yellow-200">Dashboard</span>
          </h1>
          <p className="text-richblack-400 text-xs mt-1">
            {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Avatar + member since */}
        <div className="flex items-center gap-3 glass-card rounded-xl px-4 py-3">
          <img
            src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400/40"
          />
          <div>
            <p className="text-sm font-semibold text-white truncate max-w-[140px]">{displayName}</p>
            {stats?.memberSince && (
              <p className="text-xs text-richblack-400 mt-0.5 flex items-center gap-1">
                <MdCalendarToday className="text-[10px]" />
                Member since {stats.memberSince.split(',')[1]?.trim() || stats.memberSince}
              </p>
            )}
            {stats?.lastLogin && (
              <p className="text-xs text-richblack-500 mt-0.5 flex items-center gap-1">
                <MdLogin className="text-[10px]" />
                Last login: {stats.lastLogin}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div>
        <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Your Activity</h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="animate-fadeIn opacity-0"><StatCard icon={IoTicketSharp}      label="Tickets Bought"   value={stats?.ticketCount}       color="yellow" sub="total purchases" /></div>
          <div className="animate-fadeIn opacity-0 delay-100"><StatCard icon={FaBookmark}         label="Watchlist"        value={stats?.watchlistCount}    color="blue"   sub="saved movies"   /></div>
          <div className="animate-fadeIn opacity-0 delay-200"><StatCard icon={FaHeart}            label="Liked Movies"     value={stats?.likedMoviesCount}  color="pink"   sub="movies liked"   /></div>
          <div className="animate-fadeIn opacity-0 delay-300"><StatCard icon={MdChatBubble}       label="Comments"         value={stats?.commentsCount}     color="purple" sub="posted"         /></div>
        </div>
      </div>

      {/* ── Wallet & Loyalty row ── */}
      <div>
        <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Wallet & Rewards</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="animate-fadeIn opacity-0">
            <StatCard
              icon={MdAccountBalanceWallet}
              label="Wallet Balance"
              value={`₹${(wallet?.walletBalance ?? 0).toLocaleString('en-IN')}`}
              color="green"
              sub="available to spend"
            />
          </div>
          <div className="animate-fadeIn opacity-0 delay-100">
            <StatCard
              icon={RiCoinFill}
              label="Loyalty Points"
              value={wallet?.loyaltyPoints ?? 0}
              color="orange"
              sub={wallet?.redeemableValue ? `worth ₹${wallet.redeemableValue} in credit` : 'earn points on every booking'}
            />
          </div>
        </div>
      </div>

      {/* ── Recent Tickets + Quick Actions ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Recent tickets */}
        <div className="animate-fadeIn opacity-0 delay-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider">Recent Tickets</h2>
            <Link to="/Dashboard/Purchased-Tickets" className="text-xs text-yellow-200 hover:text-yellow-100 flex items-center gap-1">
              View all <MdArrowForward />
            </Link>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            {stats?.recentPayments?.length > 0 ? (
              <div className="divide-y divide-richblack-700">
                {stats.recentPayments.map((payment) => (
                  <div key={payment._id} className="flex items-center justify-between px-4 py-3 hover:bg-richblack-700/50 transition-colors gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {payment.showImage ? (
                        <img src={payment.showImage} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-richblack-600" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-richblack-700 flex items-center justify-center flex-shrink-0">
                          <FaFilm className="text-richblack-500 text-sm" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">{payment.showTitle}</p>
                        <p className="text-xs text-richblack-400 mt-0.5">
                          {payment.totalTickets} ticket{payment.totalTickets !== '1' ? 's' : ''} · {payment.showDate || payment.paymentDate || ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <p className="text-sm font-semibold text-yellow-200 tabular-nums">₹{payment.amount?.toLocaleString('en-IN')}</p>
                      <StatusDot status={payment.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <IoTicketSharp className="text-4xl text-richblack-600 mx-auto mb-3" />
                <p className="text-richblack-400 text-sm">No tickets purchased yet</p>
                <Link to="/" className="text-xs text-yellow-200 hover:underline mt-2 block">
                  Browse movies & book tickets
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="animate-fadeIn opacity-0 delay-200">
          <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <QuickAction icon={MdMovie}            label="Browse Movies"        desc="Discover new releases"        to="/"                                  color="yellow" />
            <QuickAction icon={IoTicketSharp}      label="My Tickets"           desc="View all your bookings"       to="/Dashboard/Purchased-Tickets"       color="green"  />
            <QuickAction icon={FaBookmark}         label="My Watchlist"         desc="Movies you want to watch"     to="/Dashboard/Wishlist"                color="blue"   />
            <QuickAction icon={MdLocalActivity}    label="Purchase History"     desc="Past transactions"            to="/Dashboard/Purchase-History"        color="purple" />
            <QuickAction icon={MdBugReport}        label="My Bug Reports"       desc="Issues you've reported"       to="/Dashboard/My-Bug-Reports"          color="red"    />
            <QuickAction icon={MdSettings}         label="Account Settings"     desc="Update your profile"          to="/Dashboard/Settings"                color="orange" />
          </div>
        </div>

      </div>

      {/* ── Engagement banner ── */}
      {(stats?.ticketCount === 0) && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-yellow-400/10 to-yellow-200/5 border border-yellow-400/20 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-xl flex-shrink-0">
              <RiVipCrownFill className="text-yellow-400 text-2xl" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Start your movie journey!</p>
              <p className="text-richblack-400 text-xs mt-0.5">
                Browse movies, find a show near you, and book your first ticket.
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-richblack-900 text-sm font-semibold hover:bg-yellow-300 transition-colors"
          >
            Browse Movies <MdArrowForward />
          </Link>
        </div>
      )}

      {/* ── Watchlist prompt ── */}
      {stats?.ticketCount > 0 && stats?.watchlistCount === 0 && (
        <div className="p-4 rounded-xl bg-blue-400/5 border border-blue-400/20 flex items-center gap-3">
          <FaBookmark className="text-blue-400 text-lg flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-white font-medium">Add movies to your watchlist</p>
            <p className="text-xs text-richblack-400 mt-0.5">Keep track of movies you want to see</p>
          </div>
          <Link to="/" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 flex-shrink-0">
            Explore <MdArrowForward />
          </Link>
        </div>
      )}

    </div>
  )
}

export default UserDashboardHome
