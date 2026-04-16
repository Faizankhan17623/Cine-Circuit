import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { GetOrganizerTicketReport } from '../../Services/operations/orgainezer'
import {
  IoTicketSharp
} from 'react-icons/io5'
import {
  MdAttachMoney, MdMovie, MdArrowForward, MdSell, MdInventory,
  MdBarChart, MdTheaters, MdSchedule, MdCalendarToday, MdRefresh
} from 'react-icons/md'
import { FaTheaterMasks } from 'react-icons/fa'
import { FaTicketSimple } from 'react-icons/fa6'
// ─── small reusable pieces ───────────────────────────────────────────────────

const statColours = {
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-400/10'   },
  green:  { text: 'text-green-400',  bg: 'bg-green-400/10'  },
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-400/10' },
}

const StatCard = ({ icon: Icon, label, value, sub, color }) => {
  const c = statColours[color] || statColours.blue
  return (
    <div className="bg-richblack-800 rounded-xl p-5 border border-richblack-700">
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

const Badge = ({ label, color }) => {
  const colors = {
    green: 'bg-green-400/10 text-green-400 border-green-400/20',
    blue: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    yellow: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    red: 'bg-red-400/10 text-red-400 border-red-400/20',
    gray: 'bg-richblack-600/50 text-richblack-400 border-richblack-600/30',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[color] || colors.gray}`}>
      {label}
    </span>
  )
}

const EmptyState = ({ message }) => (
  <div className="py-12 text-center">
    <IoTicketSharp className="text-4xl text-richblack-600 mx-auto mb-3" />
    <p className="text-richblack-400 text-sm">{message}</p>
  </div>
)

// ─── percent bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ sold, total }) => {
  const pct = total > 0 ? Math.round((sold / total) * 100) : 0
  const color = pct >= 80 ? 'bg-green-400' : pct >= 40 ? 'bg-yellow-400' : 'bg-richblack-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-richblack-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-richblack-400 w-8 text-right">{pct}%</span>
    </div>
  )
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'creation', label: 'Ticket Creation', icon: IoTicketSharp },
  { id: 'sales', label: 'Sales Report', icon: MdSell },
  { id: 'theatre', label: 'Theatre Allotments', icon: FaTheaterMasks },
  { id: 'daily', label: 'Daily Breakdown', icon: MdCalendarToday },
]

// ─── TAB 1: Ticket Creation ────────────────────────────────────────────────
const TicketCreationTab = ({ batches }) => {
  if (!batches || batches.length === 0) return <EmptyState message="No ticket batches created yet." />

  return (
    <div className="space-y-4">
      {batches.map((b) => (
        <div key={b.ticketId} className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
          {/* Show header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-richblack-700">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-semibold">{b.showTitle}</p>
                <Badge
                  label={b.showStatus}
                  color={b.showStatus === 'Released' ? 'green' : b.showStatus === 'Upcoming' ? 'blue' : 'gray'}
                />
                {b.verified && <Badge label="Verified" color="green" />}
              </div>
              <p className="text-richblack-400 text-xs mt-0.5">
                {b.ticketType} · ₹{b.pricePerTicket} per ticket
                {b.releaseDate && ` · Release: ${b.releaseDate}`}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-richblack-400">Created</p>
              <p className="text-xs text-richblack-300">{b.createdAt || '—'}</p>
            </div>
          </div>

          {/* Ticket stats */}
          <div className="grid grid-cols-3 divide-x divide-richblack-700">
            <div className="px-5 py-4 text-center">
              <p className="text-richblack-400 text-xs mb-1">Total Created</p>
              <p className="text-2xl font-bold text-blue-400">{b.totalCreated.toLocaleString('en-IN')}</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-richblack-400 text-xs mb-1">Remaining</p>
              <p className="text-2xl font-bold text-yellow-400">{b.remaining.toLocaleString('en-IN')}</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-richblack-400 text-xs mb-1">Sold</p>
              <p className="text-2xl font-bold text-green-400">{b.sold.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Sold progress */}
          <div className="px-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-richblack-400">Sold progress</p>
              <p className="text-xs text-richblack-400">{b.sold}/{b.totalCreated} tickets</p>
            </div>
            <ProgressBar sold={b.sold} total={b.totalCreated} />
          </div>

          {/* Allotment info */}
          {b.allotedAt && (
            <div className="px-5 py-3 border-t border-richblack-700 bg-richblack-800/50 flex items-center gap-2">
              <MdSchedule className="text-richblack-400 text-sm" />
              <p className="text-xs text-richblack-400">
                Allotted to {b.totalTheatresAlloted} theatre{b.totalTheatresAlloted !== 1 ? 's' : ''} at {b.allotedAt}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── TAB 2: Sales Report ──────────────────────────────────────────────────
const SalesReportTab = ({ batches }) => {
  const [expanded, setExpanded] = useState(null)

  const showsWithSales = batches.filter(b => b.purchaseCount > 0)

  if (showsWithSales.length === 0) {
    return <EmptyState message="No sales recorded yet. Sales will appear once viewers purchase tickets." />
  }

  return (
    <div className="space-y-4">
      {batches.map((b) => (
        <div key={b.ticketId} className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">

          {/* Header */}
          <button
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-richblack-700/40 transition-colors text-left"
            onClick={() => setExpanded(expanded === b.ticketId ? null : b.ticketId)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-semibold">{b.showTitle}</p>
                <Badge
                  label={b.showStatus}
                  color={b.showStatus === 'Released' ? 'green' : b.showStatus === 'Upcoming' ? 'blue' : 'gray'}
                />
              </div>
              {b.purchaseCount === 0
                ? <p className="text-richblack-500 text-xs mt-0.5">No sales yet</p>
                : <p className="text-richblack-400 text-xs mt-0.5">{b.purchaseCount} purchase{b.purchaseCount !== 1 ? 's' : ''} · {b.sold} tickets sold</p>
              }
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-xl font-bold text-green-400">
                {b.revenue > 0 ? `₹${b.revenue.toLocaleString('en-IN')}` : '₹0'}
              </p>
              <p className="text-xs text-richblack-400">revenue</p>
            </div>
          </button>

          {/* Expanded: timing breakdown */}
          {expanded === b.ticketId && b.purchaseCount > 0 && (
            <div className="border-t border-richblack-700">

              {/* Per show-date & time breakdown */}
              {b.timingBreakdown && b.timingBreakdown.length > 0 && (
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold text-richblack-300 uppercase tracking-wider mb-3">
                    By Show Date &amp; Time
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-richblack-400 text-xs border-b border-richblack-700">
                          <th className="text-left py-2 pr-4">Show Date</th>
                          <th className="text-left py-2 pr-4">Show Time</th>
                          <th className="text-right py-2 pr-4">Tickets Sold</th>
                          <th className="text-right py-2">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-richblack-700/50">
                        {b.timingBreakdown.map((row, i) => (
                          <tr key={i} className="hover:bg-richblack-700/30 transition-colors">
                            <td className="py-2.5 pr-4 text-richblack-200">{row.date}</td>
                            <td className="py-2.5 pr-4 text-richblack-200">{row.time}</td>
                            <td className="py-2.5 pr-4 text-right">
                              <span className="text-blue-400 font-medium">{row.tickets}</span>
                            </td>
                            <td className="py-2.5 text-right">
                              <span className="text-green-400 font-medium">₹{row.revenue.toLocaleString('en-IN')}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Daily purchase breakdown */}
              {b.dailySales && b.dailySales.length > 0 && (
                <div className="px-5 py-4 border-t border-richblack-700">
                  <p className="text-xs font-semibold text-richblack-300 uppercase tracking-wider mb-3">
                    By Purchase Date
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-richblack-400 text-xs border-b border-richblack-700">
                          <th className="text-left py-2 pr-4">Date</th>
                          <th className="text-right py-2 pr-4">Purchases</th>
                          <th className="text-right py-2 pr-4">Tickets</th>
                          <th className="text-right py-2">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-richblack-700/50">
                        {b.dailySales.map((day, i) => (
                          <tr key={i} className="hover:bg-richblack-700/30 transition-colors">
                            <td className="py-2.5 pr-4 text-richblack-200">{day.date}</td>
                            <td className="py-2.5 pr-4 text-right text-richblack-300">{day.purchases}</td>
                            <td className="py-2.5 pr-4 text-right">
                              <span className="text-blue-400 font-medium">{day.tickets}</span>
                            </td>
                            <td className="py-2.5 text-right">
                              <span className="text-green-400 font-medium">₹{day.revenue.toLocaleString('en-IN')}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── TAB 3: Theatre Allotments ────────────────────────────────────────────
const TheatreAllotmentTab = ({ batches }) => {
  const batchesWithAllotments = batches.filter(b => b.theatreAllotments?.length > 0)

  if (batchesWithAllotments.length === 0) {
    return <EmptyState message="No theatres allotted yet. Allot tickets to theatres from the Tickets section." />
  }

  return (
    <div className="space-y-5">
      {batchesWithAllotments.map((b) => (
        <div key={b.ticketId} className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-richblack-700">
            <p className="text-white font-semibold">{b.showTitle}</p>
            <p className="text-richblack-400 text-xs mt-0.5">
              {b.theatreAllotments.length} theatre{b.theatreAllotments.length !== 1 ? 's' : ''} allotted
              {b.allotedAt && ` · Allotted at ${b.allotedAt}`}
            </p>
          </div>
          <div className="divide-y divide-richblack-700">
            {b.theatreAllotments.map((ta, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-richblack-700/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-400/10">
                    <FaTheaterMasks className="text-purple-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{ta.theatreName}</p>
                    {ta.location && <p className="text-xs text-richblack-400">{ta.location}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold text-lg">{ta.ticketsAlloted.toLocaleString('en-IN')}</p>
                  <p className="text-richblack-400 text-xs">tickets allotted</p>
                </div>
              </div>
            ))}
          </div>
          {/* Allotment total vs created */}
          <div className="px-5 py-3 bg-richblack-700/30 border-t border-richblack-700">
            <div className="flex items-center justify-between text-xs text-richblack-400">
              <span>Total allotted</span>
              <span className="font-semibold text-yellow-300">
                {b.theatreAllotments.reduce((sum, ta) => sum + ta.ticketsAlloted, 0).toLocaleString('en-IN')}
                {' '}<span className="text-richblack-500">/ {b.totalCreated.toLocaleString('en-IN')} created</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── TAB 4: Daily Breakdown ───────────────────────────────────────────────
const DailyBreakdownTab = ({ overallDailySales }) => {
  if (!overallDailySales || overallDailySales.length === 0) {
    return <EmptyState message="No daily sales data yet." />
  }

  return (
    <div className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-richblack-700">
        <p className="text-white font-semibold">All Shows — Daily Sales</p>
        <p className="text-richblack-400 text-xs mt-0.5">Aggregated across all your shows</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-richblack-700/40">
            <tr className="text-richblack-400 text-xs">
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-right px-5 py-3">Purchases</th>
              <th className="text-right px-5 py-3">Tickets Sold</th>
              <th className="text-right px-5 py-3">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-richblack-700/50">
            {overallDailySales.map((day, i) => (
              <tr key={i} className="hover:bg-richblack-700/30 transition-colors">
                <td className="px-5 py-3 text-richblack-200 font-medium">{day.date}</td>
                <td className="px-5 py-3 text-right text-richblack-300">{day.purchases}</td>
                <td className="px-5 py-3 text-right">
                  <span className="text-blue-400 font-semibold">{day.tickets}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-green-400 font-semibold">₹{day.revenue.toLocaleString('en-IN')}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-richblack-700/40 border-t-2 border-richblack-600">
            <tr className="text-sm font-bold">
              <td className="px-5 py-3 text-white">Total</td>
              <td className="px-5 py-3 text-right text-richblack-300">
                {overallDailySales.reduce((s, d) => s + d.purchases, 0)}
              </td>
              <td className="px-5 py-3 text-right text-blue-400">
                {overallDailySales.reduce((s, d) => s + d.tickets, 0)}
              </td>
              <td className="px-5 py-3 text-right text-green-400">
                ₹{overallDailySales.reduce((s, d) => s + d.revenue, 0).toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────
const OrganizerTicketReport = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('creation')

  const fetchData = async () => {
    setLoading(true)
    const result = await dispatch(GetOrganizerTicketReport(token))
    if (result?.success) setData(result.data)
    setLoading(false)
  }

  useEffect(() => {
    if (token) fetchData()
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-yellow-200 border-t-transparent rounded-full animate-spin" />
          <p className="text-richblack-400 text-sm">Loading ticket report...</p>
        </div>
      </div>
    )
  }

  const totals = data?.totals || {}
  const batches = data?.ticketBatches || []
  const overallDailySales = data?.overallDailySales || []

  return (
    <div className="p-6 text-white space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Ticket &amp; <span className="text-yellow-200">Sales Report</span>
          </h1>
          <p className="text-richblack-400 text-sm mt-0.5">
            Full breakdown of ticket creation, sales, and theatre allotments across all your shows
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-richblack-700 hover:bg-richblack-600 text-richblack-200 text-sm transition-colors border border-richblack-600"
        >
          <MdRefresh className="text-base" /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={IoTicketSharp} label="Total Created" value={totals.totalCreated?.toLocaleString('en-IN')} color="blue" />
        <StatCard icon={MdSell} label="Total Sold" value={totals.totalSold?.toLocaleString('en-IN')} sub={`${totals.totalPurchases || 0} transactions`} color="green" />
        <StatCard icon={MdInventory} label="Remaining" value={totals.totalRemaining?.toLocaleString('en-IN')} color="yellow" />
        <StatCard
          icon={MdAttachMoney}
          label="Total Revenue"
          value={totals.totalRevenue > 0 ? `₹${totals.totalRevenue.toLocaleString('en-IN')}` : '₹0'}
          color="purple"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-richblack-700">
        <div className="flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === id
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-transparent text-richblack-400 hover:text-richblack-200'
              }`}
            >
              <Icon className="text-base" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'creation' && <TicketCreationTab batches={batches} />}
        {activeTab === 'sales' && <SalesReportTab batches={batches} />}
        {activeTab === 'theatre' && <TheatreAllotmentTab batches={batches} />}
        {activeTab === 'daily' && <DailyBreakdownTab overallDailySales={overallDailySales} />}
      </div>

    </div>
  )
}

export default OrganizerTicketReport
