import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { CalculateTotalSale, GetTheatreDetails, FetchAllTicketsDetails } from '../../Services/operations/Theatre'
import {
  MdAttachMoney, MdMovie, MdArrowForward, MdLocalActivity, MdAccessTime, MdEventSeat
} from 'react-icons/md'
import { IoTicketSharp } from 'react-icons/io5'
import { FaTheaterMasks } from 'react-icons/fa'
import { FaTicketSimple } from 'react-icons/fa6'

const colours = {
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'hover:border-yellow-400/40' },
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'hover:border-blue-400/40'   },
  green:  { text: 'text-green-400',  bg: 'bg-green-400/10',  border: 'hover:border-green-400/40'  },
  purple: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'hover:border-purple-400/40' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'hover:border-orange-400/40' },
  red:    { text: 'text-red-400',    bg: 'bg-red-400/10',    border: 'hover:border-red-400/40'    },
}

const StatCard = ({ icon: Icon, label, value, sub, color }) => {
  const c = colours[color] || colours.yellow
  return (
    <div className={`bg-richblack-800 rounded-xl p-5 border border-richblack-700 ${c.border} transition-all duration-200`}>
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

const quickActions = [
  { icon: FaTheaterMasks, label: 'Theatre Details',     to: '/Dashboard/Theatre-Details',      color: 'yellow' },
  { icon: MdAttachMoney,  label: 'Total Sales',          to: '/Dashboard/Total-Sales',          color: 'green'  },
  { icon: MdLocalActivity,label: 'Allotted Shows',       to: '/Dashboard/Alloted-Shows',        color: 'blue'   },
  { icon: IoTicketSharp,  label: 'All Tickets',          to: '/Dashboard/All-Tickets',          color: 'purple' },
  { icon: FaTicketSimple, label: 'Distribute Tickets',   to: '/Dashboard/Distribute-Tickets',   color: 'orange' },
  { icon: MdAccessTime,   label: 'Update Ticket Times',  to: '/Dashboard/Update-Ticket-Time',   color: 'red'    },
]

const TheatrerDashboardHome = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((s) => s.auth)
  const { user }  = useSelector((s) => s.profile)

  const [totalSale,     setTotalSale]     = useState(0)
  const [theatreDetails,setTheatreDetails]= useState(null)
  const [ticketData,    setTicketData]    = useState(null)
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    if (!token) return
    const load = async () => {
      const [saleRes, theatreRes, ticketRes] = await Promise.all([
        dispatch(CalculateTotalSale(token)),
        dispatch(GetTheatreDetails(token)),
        dispatch(FetchAllTicketsDetails(token)),
      ])
      if (saleRes?.success)    setTotalSale(saleRes.data?.totalAmount || 0)
      if (theatreRes?.success) setTheatreDetails(theatreRes.data?.TheatreDetails || null)
      if (ticketRes?.success)  setTicketData(ticketRes.data?.data || null)
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
  const shows              = ticketData?.shows || []
  const totalTicketsReceived = ticketData?.totalTicketsReceived || 0
  const totalShows           = ticketData?.totalShows || 0

  return (
    <div className="p-5 text-white space-y-7 max-w-6xl">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-richblack-400 text-sm">{greeting},</p>
          <h1 className="text-2xl font-bold text-white mt-0.5">
            {user?.firstName || 'Theatre'}{' '}
            <span className="text-yellow-200">Dashboard</span>
          </h1>
          <p className="text-richblack-400 text-xs mt-1">
            {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {theatreDetails && (
          <div className="bg-richblack-800 border border-richblack-700 rounded-xl px-4 py-3 text-right flex-shrink-0">
            <p className="text-xs text-richblack-400">Theatre</p>
            <p className="text-sm font-semibold text-yellow-200 truncate max-w-[160px]">{theatreDetails.Theatrename || 'Your Theatre'}</p>
            {theatreDetails.locationname && (
              <p className="text-xs text-richblack-400 mt-0.5 truncate max-w-[160px]">{theatreDetails.locationname}</p>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${
              theatreDetails.Verified
                ? 'bg-green-400/10 text-green-400 border-green-400/20'
                : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
            }`}>
              {theatreDetails.Verified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        )}
      </div>

      {/* ── Stats grid ────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Overview</h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard
            icon={MdAttachMoney}
            label="Total Revenue"
            value={totalSale > 0 ? `₹${totalSale.toLocaleString('en-IN')}` : '₹0'}
            color="yellow"
          />
          <StatCard icon={MdMovie}       label="Shows Allotted"    value={totalShows}          color="blue"   />
          <StatCard icon={FaTicketSimple}label="Tickets Received"  value={totalTicketsReceived} color="green"  />
          <StatCard
            icon={FaTheaterMasks}
            label="Screen Formats"
            value={theatreDetails?.theatreformat?.length || '—'}
            sub={theatreDetails?.Theatrename || ''}
            color="purple"
          />
        </div>
      </div>

      {/* ── Shows table + quick actions ───────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Allotted shows */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider">Allotted Shows</h2>
            <Link to="/Dashboard/Alloted-Shows" className="text-xs text-yellow-200 hover:text-yellow-100 flex items-center gap-1">
              View all <MdArrowForward />
            </Link>
          </div>
          <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
            {shows.length > 0 ? (
              <div className="divide-y divide-richblack-700">
                {shows.slice(0, 5).map((item) => (
                  <div key={item.showIndex} className="flex items-start justify-between px-4 py-3 hover:bg-richblack-700/50 transition-colors gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium truncate">
                        {item.showDetails?.title || 'Untitled Show'}
                      </p>
                      <p className="text-xs text-richblack-400 mt-0.5 truncate">
                        {item.showDetails?.movieStatus && (
                          <span className={`mr-2 ${
                            item.showDetails.movieStatus === 'Released' ? 'text-green-400' :
                            item.showDetails.movieStatus === 'Upcoming' ? 'text-blue-400'  : 'text-richblack-400'
                          }`}>
                            {item.showDetails.movieStatus}
                          </span>
                        )}
                        {item.showDetails?.releasedate && `Release: ${item.showDetails.releasedate}`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-richblack-400">Tickets</p>
                      <p className="text-sm font-semibold text-yellow-200 tabular-nums">
                        {item.ticketDetails?.ticketsReceived ?? 0}
                      </p>
                      {item.ticketDetails?.ticketPrice > 0 && (
                        <p className="text-xs text-richblack-400">₹{item.ticketDetails.ticketPrice}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <MdMovie className="text-3xl text-richblack-600 mx-auto mb-2" />
                <p className="text-richblack-400 text-sm">No shows allotted yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="space-y-1.5">
            {quickActions.map(({ icon: Icon, label, to, color }) => {
              const c = colours[color] || colours.yellow
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

      {/* ── Occupancy rates ──────────────────────────── */}
      {shows.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">
            <MdEventSeat className="inline mr-1 text-sm" />
            Theatre Occupancy
          </h2>
          <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
            <div className="divide-y divide-richblack-700">
              {shows.map((item) => {
                const received  = item.ticketDetails?.ticketsReceived || 0
                const remaining = item.ticketDetails?.TicketsRemaining ?? received
                const sold      = received - remaining
                const pct       = received > 0 ? Math.round((sold / received) * 100) : 0
                const barColor  = pct >= 80 ? 'bg-red-400' : pct >= 50 ? 'bg-yellow-400' : 'bg-green-400'
                return (
                  <div key={item.showIndex} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <p className="text-sm text-white font-medium truncate flex-1">
                        {item.showDetails?.title || 'Untitled Show'}
                      </p>
                      <span className={`text-xs font-semibold tabular-nums flex-shrink-0 ${
                        pct >= 80 ? 'text-red-400' : pct >= 50 ? 'text-yellow-400' : 'text-green-400'
                      }`}>{pct}%</span>
                    </div>
                    <div className="w-full bg-richblack-700 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between mt-1 text-[11px] text-richblack-500">
                      <span>{sold} sold</span>
                      <span>{remaining} remaining / {received} total</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── No-theatre alert ─────────────────────────── */}
      {!theatreDetails && (
        <div className="p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/20">
          <p className="text-yellow-200 text-sm font-medium">Theatre not set up yet</p>
          <p className="text-richblack-400 text-xs mt-1">Go to Theatre Details to complete your setup.</p>
          <Link to="/Dashboard/Theatre-Details" className="inline-flex items-center gap-1 text-xs text-yellow-200 hover:text-yellow-100 mt-2">
            Set up theatre <MdArrowForward />
          </Link>
        </div>
      )}

    </div>
  )
}

export default TheatrerDashboardHome
