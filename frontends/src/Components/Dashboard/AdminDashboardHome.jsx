import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { GetAdminStats } from '../../Services/operations/Admin'
import {
  MdPeople, MdVerified, MdPendingActions, MdBugReport,
  MdMovie, MdConstruction, MdArrowForward, MdTrendingUp, MdToday
} from 'react-icons/md'
import { FaUserTie, FaTheaterMasks } from 'react-icons/fa'

// Static colour maps — Tailwind must see full class strings to include them
const colours = {
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'hover:border-blue-400/50'   },
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'hover:border-yellow-400/50' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'hover:border-purple-400/50' },
  green:  { text: 'text-green-400',  bg: 'bg-green-400/10',  border: 'hover:border-green-400/50'  },
  red:    { text: 'text-red-400',    bg: 'bg-red-400/10',    border: 'hover:border-red-400/40'    },
  orange: { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'hover:border-orange-400/40' },
}

const StatCard = ({ icon: Icon, label, value, sub, color, to }) => {
  const c = colours[color] || colours.blue
  return (
    <Link to={to || '#'} className="block">
      <div className={`bg-richblack-800 rounded-xl p-5 border border-richblack-700 ${c.border} transition-all duration-200 hover:scale-[1.01]`}>
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 pr-2">
            <p className="text-richblack-400 text-xs mb-1 truncate">{label}</p>
            <p className={`text-2xl font-bold tabular-nums ${c.text}`}>{value ?? '—'}</p>
            {sub && <p className="text-richblack-400 text-xs mt-1 truncate">{sub}</p>}
          </div>
          <div className={`p-2.5 rounded-lg flex-shrink-0 ${c.bg}`}>
            <Icon className={`text-xl ${c.text}`} />
          </div>
        </div>
      </div>
    </Link>
  )
}

const QuickAction = ({ icon: Icon, label, to, color }) => {
  const c = colours[color] || colours.blue
  return (
    <Link to={to}>
      <div className={`flex items-center gap-3 p-3 rounded-lg bg-richblack-800 border border-richblack-700 ${c.border} hover:bg-richblack-700 transition-all duration-200`}>
        <div className={`p-2 rounded-md flex-shrink-0 ${c.bg}`}>
          <Icon className={`text-base ${c.text}`} />
        </div>
        <span className="text-sm text-richblack-100 flex-1 min-w-0 truncate">{label}</span>
        <MdArrowForward className="text-richblack-500 text-sm flex-shrink-0" />
      </div>
    </Link>
  )
}

const AdminDashboardHome = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((s) => s.auth)
  const { user }  = useSelector((s) => s.profile)

  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    const load = async () => {
      const res = await dispatch(GetAdminStats(token))
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

  return (
    <div className="p-5 text-white space-y-7 max-w-6xl">

      {/* ── Header ─────────────────────────────────────── */}
      <div>
        <p className="text-richblack-400 text-sm">{greeting},</p>
        <h1 className="text-2xl font-bold text-white mt-0.5">
          {user?.firstName || 'Admin'}{' '}
          <span className="text-yellow-200">Dashboard</span>
        </h1>
        <p className="text-richblack-400 text-xs mt-1">
          {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── Platform overview ─────────────────────────── */}
      <div>
        <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Platform Overview</h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard icon={MdPeople}      label="Total Viewers"  value={stats?.users?.totalViewers ?? 0}    color="blue"   to="/Dashboard/users" />
          <StatCard
            icon={FaUserTie}
            label="Organizers"
            value={stats?.users?.totalOrganizers ?? 0}
            sub={`${stats?.users?.verifiedOrganizers ?? 0} verified · ${stats?.users?.pendingOrgRequests ?? 0} pending`}
            color="yellow"
            to="/Dashboard/Verifications"
          />
          <StatCard
            icon={FaTheaterMasks}
            label="Theatres"
            value={stats?.users?.totalTheatrers ?? 0}
            sub={`${stats?.users?.verifiedTheatrers ?? 0} verified · ${stats?.users?.pendingTheatreRequests ?? 0} requests`}
            color="purple"
            to="/Dashboard/VerifyTheatre"
          />
          <StatCard
            icon={MdMovie}
            label="Total Shows"
            value={stats?.shows?.total ?? 0}
            sub={`${stats?.shows?.verified ?? 0} verified · ${stats?.shows?.unverified ?? 0} pending`}
            color="green"
            to="/Dashboard/VerifyShows"
          />
        </div>
      </div>

      {/* ── Bug reports + Quick actions ───────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Bug reports summary */}
        <div>
          <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Bug Reports</h2>
          <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-richblack-300 text-sm">Total Reports</span>
              <span className="text-white font-semibold tabular-nums">{stats?.bugs?.total ?? 0}</span>
            </div>
            <div className="w-full h-px bg-richblack-700" />
            {[
              { label: 'Open',        value: stats?.bugs?.open,       dot: 'bg-red-400',    text: 'text-red-400'    },
              { label: 'In Progress', value: stats?.bugs?.inProgress, dot: 'bg-yellow-400', text: 'text-yellow-400' },
              { label: 'Resolved',    value: stats?.bugs?.resolved,   dot: 'bg-green-400',  text: 'text-green-400'  },
            ].map(({ label, value, dot, text }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                  <span className="text-richblack-300 text-sm">{label}</span>
                </div>
                <span className={`font-semibold tabular-nums ${text}`}>{value ?? 0}</span>
              </div>
            ))}
            {(stats?.bugs?.open ?? 0) > 0 && (
              <Link to="/Dashboard/Bug-Reports">
                <div className="mt-1 flex items-center gap-1 text-xs text-yellow-200 hover:text-yellow-100 transition-colors">
                  <span>View open reports</span>
                  <MdArrowForward />
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="space-y-1.5">
            <QuickAction icon={MdVerified}     label="Verify Organizers"     to="/Dashboard/Verifications" color="yellow" />
            <QuickAction icon={MdMovie}        label="Review Pending Shows"  to="/Dashboard/VerifyShows"   color="green"  />
            <QuickAction icon={FaTheaterMasks} label="Manage Theatres"       to="/Dashboard/VerifyTheatre" color="purple" />
            <QuickAction icon={MdBugReport}    label="Bug Reports"           to="/Dashboard/Bug-Reports"   color="red"    />
            <QuickAction icon={MdConstruction} label="Maintenance Mode"      to="/Dashboard/Maintenance"   color="orange" />
            <QuickAction icon={MdPendingActions}label="Audit Logs"           to="/Dashboard/Audit-Logs"    color="blue"   />
          </div>
        </div>
      </div>

      {/* ── Visitor Stats ─────────────────────────────── */}
      {stats?.visitors && (
        <div>
          <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Site Traffic</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <StatCard icon={MdPeople}     label="Total Unique Visitors" value={stats.visitors.totalUnique}     color="blue"   to="/Dashboard/Visitor-Stats" />
            <StatCard icon={MdTrendingUp} label="Total Page Visits"     value={stats.visitors.totalVisits}     color="purple" to="/Dashboard/Visitor-Stats" />
            <StatCard icon={MdToday}      label="Visitors Today"        value={stats.visitors.visitorsToday}   color="green"  to="/Dashboard/Visitor-Stats" />
            <StatCard icon={MdPeople}     label="New Visitors Today"    value={stats.visitors.newVisitorsToday} color="orange" to="/Dashboard/Visitor-Stats" />
          </div>
        </div>
      )}

      {/* ── Pending alerts ────────────────────────────── */}
      {((stats?.users?.pendingOrgRequests ?? 0) > 0 || (stats?.shows?.unverified ?? 0) > 0) && (
        <div>
          <h2 className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3">Needs Attention</h2>
          <div className="space-y-2">
            {(stats?.users?.pendingOrgRequests ?? 0) > 0 && (
              <Link to="/Dashboard/Verifications">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/20 hover:border-yellow-400/40 transition-all">
                  <FaUserTie className="text-yellow-400 text-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {stats.users.pendingOrgRequests} organizer{stats.users.pendingOrgRequests > 1 ? 's' : ''} waiting for verification
                    </p>
                    <p className="text-xs text-richblack-400 mt-0.5">Review and approve or reject applications</p>
                  </div>
                  <MdArrowForward className="text-yellow-400 flex-shrink-0" />
                </div>
              </Link>
            )}
            {(stats?.shows?.unverified ?? 0) > 0 && (
              <Link to="/Dashboard/VerifyShows">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-400/5 border border-green-400/20 hover:border-green-400/40 transition-all">
                  <MdMovie className="text-green-400 text-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {stats.shows.unverified} show{stats.shows.unverified > 1 ? 's' : ''} pending verification
                    </p>
                    <p className="text-xs text-richblack-400 mt-0.5">Review submitted shows before they go live</p>
                  </div>
                  <MdArrowForward className="text-green-400 flex-shrink-0" />
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDashboardHome
