import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { GetOrganizerStats } from '../../Services/operations/orgainezer'
import {
  MdMovie, MdVerified, MdArrowForward, MdUpload, MdLocalActivity, MdBarChart
} from 'react-icons/md'
import { IoTicketSharp } from 'react-icons/io5'
import { FaTheaterMasks, FaFilm } from 'react-icons/fa'

// Static colour maps so Tailwind includes these classes at build time
const cardColours = {
  yellow: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'hover:border-yellow-400/40',
  },
  green: {
    text: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'hover:border-green-400/40',
  },
  blue: {
    text: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'hover:border-blue-400/40',
  },
  purple: {
    text: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'hover:border-purple-400/40',
  },
  orange: {
    text: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'hover:border-orange-400/40',
  },
  red: {
    text: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'hover:border-red-400/40',
  },
}

const StatCard = ({ icon: Icon, label, value, sub, color }) => {
  const c = cardColours[color] || cardColours.yellow
  return (
    <div className={`bg-richblack-800 rounded-xl p-5 border border-richblack-700 ${c.border} transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-richblack-400 text-xs mb-1 truncate">{label}</p>
          <p className={`text-2xl font-bold ${c.text} tabular-nums`}>{value ?? 0}</p>
          {sub && <p className="text-richblack-400 text-xs mt-1 truncate">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg flex-shrink-0 ${c.bg}`}>
          <Icon className={`text-xl ${c.text}`} />
        </div>
      </div>
    </div>
  )
}

const StatusBadge = ({ status }) => {
  const map = {
    Upcoming: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    Released: 'bg-green-400/10 text-green-400 border-green-400/20',
    Expired:  'bg-richblack-600/50 text-richblack-400 border-richblack-600/30',
    Blocked:  'bg-red-400/10 text-red-400 border-red-400/20',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${map[status] || 'bg-richblack-600 text-richblack-300 border-richblack-600'}`}>
      {status}
    </span>
  )
}

const actions = [
  { icon: FaFilm,        label: 'Create New Show',       to: '/Dashboard/Shows/Create',    color: 'yellow' },
  { icon: MdUpload,      label: 'Upload Show Trailer',    to: '/Dashboard/Shows/Upload',    color: 'blue'   },
  { icon: IoTicketSharp, label: 'Create Tickets',         to: '/Dashboard/Tickets/Create',  color: 'green'  },
  { icon: FaTheaterMasks,label: 'Allot Theatre',          to: '/Dashboard/Tickets/Update',  color: 'purple' },
  { icon: MdMovie,       label: 'Manage All Shows',       to: '/Dashboard/Manage-Events',   color: 'orange' },
  { icon: MdBarChart,    label: 'Ticket & Sales Report',  to: '/Dashboard/Ticket-Report',   color: 'red'    },
]

const OrganizerDashboardHome = () => {
  const dispatch = useDispatch()
  const { token }  = useSelector((s) => s.auth)
  const { user }   = useSelector((s) => s.profile)

  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    const load = async () => {
      const res = await dispatch(GetOrganizerStats(token))
      if (res?.success) setStats(res.data)
      setLoading(false)
    }
    load()
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-yellow-200 border-t-transparent rounded-full animate-spin" />
          <p className="text-richblack-400 text-sm">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  const now      = new Date()
  const hour     = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const shows   = stats?.shows
  const tickets = stats?.tickets

  return (
    <div className="p-5 text-white space-y-7 max-w-6xl">

      {/* ── Header ─────────────────────────────────────── */}
      <div>
        <p className="text-richblack-400 text-sm">{greeting},</p>
        <h1 className="text-2xl font-bold text-white mt-0.5">
          {user?.firstName || 'Organizer'}{' '}
          <span className="text-yellow-200">Dashboard</span>
        </h1>
        <p className="text-richblack-400 text-xs mt-1">
          {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── Show stats ────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Your Shows</h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard icon={MdMovie}        label="Total Shows"    value={shows?.total}    color="yellow" />
          <StatCard icon={MdVerified}     label="Verified"       value={shows?.verified} sub={`${(shows?.total||0)-(shows?.verified||0)} pending`} color="green" />
          <StatCard icon={MdUpload}       label="Uploaded"       value={shows?.uploaded} color="blue" />
          <StatCard icon={MdLocalActivity}label="Released"       value={shows?.released} sub={`${shows?.upcoming||0} upcoming`} color="purple" />
        </div>
      </div>

      {/* ── Ticket stats ──────────────────────────────── */}
      <div>
        <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Ticket Summary</h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard icon={IoTicketSharp}  label="Ticket Batches"      value={tickets?.totalTicketBatches}    color="yellow" />
          <StatCard icon={FaTheaterMasks} label="Theatres Allotted"   value={tickets?.totalTheatresAllotted} color="blue"   />
          <StatCard icon={IoTicketSharp}  label="Tickets Created"     value={tickets?.totalTicketsCreated}   color="green"  />
          <StatCard
            icon={IoTicketSharp}
            label="Tickets Sold"
            value={tickets?.ticketsSold}
            sub={`${tickets?.totalTicketsRemaining||0} remaining`}
            color="purple"
          />
        </div>
      </div>

      {/* ── Recent shows + Quick actions ─────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Recent shows */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider">Recent Shows</h2>
            <Link to="/Dashboard/Manage-Events" className="text-xs text-yellow-200 hover:text-yellow-100 flex items-center gap-1">
              View all <MdArrowForward />
            </Link>
          </div>
          <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
            {shows?.recentShows?.length > 0 ? (
              <div className="divide-y divide-richblack-700">
                {shows.recentShows.map((show) => (
                  <div key={show._id} className="flex items-center justify-between px-4 py-3 hover:bg-richblack-700/50 transition-colors gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FaFilm className="text-richblack-500 text-sm flex-shrink-0" />
                      <p className="text-sm text-white truncate">{show.title}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {show.VerifiedByTheAdmin
                        ? <span className="text-xs text-green-400 flex items-center gap-1 whitespace-nowrap"><MdVerified /> Verified</span>
                        : <span className="text-xs text-yellow-400 whitespace-nowrap">Pending</span>
                      }
                      <StatusBadge status={show.movieStatus} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <MdMovie className="text-3xl text-richblack-600 mx-auto mb-2" />
                <p className="text-richblack-400 text-sm">No shows created yet</p>
                <Link to="/Dashboard/Shows/Create" className="text-xs text-yellow-200 hover:underline mt-1 block">
                  Create your first show
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="space-y-1.5">
            {actions.map(({ icon: Icon, label, to, color }) => {
              const c = cardColours[color] || cardColours.yellow
              return (
                <Link key={to} to={to}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg bg-richblack-800 border border-richblack-700 ${c.border} hover:bg-richblack-700 transition-all duration-200`}>
                    <div className={`p-1.5 rounded-md flex-shrink-0 ${c.bg}`}>
                      <Icon className={`text-sm ${c.text}`} />
                    </div>
                    <span className="text-sm text-richblack-100 flex-1 min-w-0 truncate">{label}</span>
                    <MdArrowForward className="text-richblack-500 text-sm flex-shrink-0" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Get-started alert ─────────────────────────── */}
      {shows?.total === 0 && (
        <div className="p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/20">
          <p className="text-yellow-200 text-sm font-medium">Get started by creating your first show</p>
          <p className="text-richblack-400 text-xs mt-1">
            Go to Create Show to upload your movie details, cast, and trailer.
          </p>
          <Link to="/Dashboard/Shows/Create" className="inline-flex items-center gap-1 text-xs text-yellow-200 hover:text-yellow-100 mt-2">
            Create Show <MdArrowForward />
          </Link>
        </div>
      )}

    </div>
  )
}

export default OrganizerDashboardHome
