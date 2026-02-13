import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaCheckCircle, FaTimesCircle, FaUsers, FaUserCheck, FaUserTimes, FaTheaterMasks, FaFilm } from 'react-icons/fa'
import Loader from '../extra/Loading'
import toast from 'react-hot-toast'
import {
  GetAllVerifiedUsers,
  GetAllUnverifiedUsers,
  GetAllVerifiedOrganizers,
  GetAllUnverifiedOrganizers,
  GetAllVerifiedTheatres,
  GetAllUnverifiedTheatres,
} from '../../Services/operations/Admin'

const TABS = [
  { key: 'users', label: 'Users', icon: FaUsers },
  { key: 'organizers', label: 'Organizers', icon: FaFilm },
  { key: 'theatres', label: 'Theatres', icon: FaTheaterMasks },
]

const Users = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [activeTab, setActiveTab] = useState('users')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const [users, setUsers] = useState([])
  const [organizers, setOrganizers] = useState([])
  const [theatres, setTheatres] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!token) return
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [vUsers, uUsers, vOrgs, uOrgs, vTheatres, uTheatres] = await Promise.all([
          dispatch(GetAllVerifiedUsers(token, navigate)),
          dispatch(GetAllUnverifiedUsers(token, navigate)),
          dispatch(GetAllVerifiedOrganizers(token, navigate)),
          dispatch(GetAllUnverifiedOrganizers(token, navigate)),
          dispatch(GetAllVerifiedTheatres(token, navigate)),
          dispatch(GetAllUnverifiedTheatres(token, navigate)),
        ])

        const markVerified = (arr, v) => (arr || []).map((u) => ({ ...u, _verified: v }))

        const uUserIds = new Set((vUsers?.data || []).map((u) => u._id))
        const mergedUsers = [
          ...markVerified(vUsers?.data, true),
          ...(uUsers?.data || []).filter((u) => !uUserIds.has(u._id)).map((u) => ({ ...u, _verified: false })),
        ]

        const vOrgIds = new Set((vOrgs?.data || []).map((u) => u._id))
        const mergedOrgs = [
          ...markVerified(vOrgs?.data, true),
          ...(uOrgs?.data || []).filter((u) => !vOrgIds.has(u._id)).map((u) => ({ ...u, _verified: false })),
        ]

        const vTheatreIds = new Set((vTheatres?.data || []).map((u) => u._id))
        const mergedTheatres = [
          ...markVerified(vTheatres?.data, true),
          ...(uTheatres?.data || []).filter((u) => !vTheatreIds.has(u._id)).map((u) => ({ ...u, _verified: false })),
        ]

        setUsers(mergedUsers)
        setOrganizers(mergedOrgs)
        setTheatres(mergedTheatres)
      } catch (error) {
        console.error(error)
        toast.error('Error fetching data')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [token])

  const getActiveData = () => {
    if (activeTab === 'users') return users
    if (activeTab === 'organizers') return organizers
    return theatres
  }

  const filtered = getActiveData().filter((u) => {
    const matchSearch =
      !search ||
      u.userName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'verified' && u.verified) ||
      (filter === 'unverified' && !u.verified)
    return matchSearch && matchFilter
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getLastLogin = (lastlogin) => {
    if (!lastlogin || lastlogin.length === 0) return 'Never'
    return lastlogin[lastlogin.length - 1]
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, filter, search])

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  const stats = {
    total: getActiveData().length,
    verified: getActiveData().filter((u) => u.verified).length,
    unverified: getActiveData().filter((u) => !u.verified).length,
  }

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 text-white overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FaUsers className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              All Users Overview
            </h1>
            <p className="text-gray-500 text-sm">
              View all users, organizers, and theatres with their verification status
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-[#12122a] p-1.5 rounded-xl border border-gray-700/30 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="text-xs" />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                activeTab === tab.key ? 'bg-white/20' : 'bg-gray-700/50'
              }`}>
                {tab.key === 'users' ? users.length : tab.key === 'organizers' ? organizers.length : theatres.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Total</p>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition">
              <FaUsers className="text-purple-400 text-sm" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-gray-600 text-xs mt-1">All {activeTab}</p>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-xl p-5 border border-green-500/20 hover:border-green-500/30 transition group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-green-400 text-xs uppercase tracking-wider font-medium">Verified</p>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition">
              <FaUserCheck className="text-green-400 text-sm" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400">{stats.verified}</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="flex-1 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500/60 rounded-full transition-all duration-500"
                style={{ width: stats.total > 0 ? `${(stats.verified / stats.total) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-gray-500 text-xs">{stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}%</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-xl p-5 border border-red-500/20 hover:border-red-500/30 transition group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-red-400 text-xs uppercase tracking-wider font-medium">Unverified</p>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition">
              <FaUserTimes className="text-red-400 text-sm" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-400">{stats.unverified}</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="flex-1 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500/60 rounded-full transition-all duration-500"
                style={{ width: stats.total > 0 ? `${(stats.unverified / stats.total) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-gray-500 text-xs">{stats.total > 0 ? Math.round((stats.unverified / stats.total) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition text-sm"
            >
              &times;
            </button>
          )}
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition cursor-pointer"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-gray-500 text-xs">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#161628] rounded-xl border border-gray-700/40 overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50 bg-[#12122a]/60">
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider w-12">#</th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">User</th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">Email</th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">Phone</th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">Created</th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center">
                        <FaUsers className="text-gray-600 text-2xl" />
                      </div>
                      <p className="text-gray-500 font-medium">No {activeTab} found</p>
                      <p className="text-gray-600 text-xs">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((user, idx) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-700/20 hover:bg-white/[0.03] transition"
                  >
                    <td className="p-4 text-gray-600 text-xs font-medium">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.userName}
                            className="w-9 h-9 rounded-full object-cover border border-gray-600/50"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                            {user.userName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        <span className="font-medium text-white">{user.userName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4 text-gray-400">
                      {user.countrycode} {user.number}
                    </td>
                    <td className="p-4">
                      {user.verified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/25">
                          <FaCheckCircle className="text-[10px]" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/25">
                          <FaTimesCircle className="text-[10px]" /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{user.createdAt || 'N/A'}</td>
                    <td className="p-4 text-gray-500 text-xs">{getLastLogin(user.lastlogin)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-1">
          <span className="text-sm text-gray-500">
            Showing <span className="text-gray-300 font-medium">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="text-gray-300 font-medium">{filtered.length}</span>
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 bg-[#1a1a2e] border border-gray-700/50 rounded-lg text-sm disabled:opacity-30 hover:border-purple-500/50 transition font-medium"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page
              if (totalPages <= 5) {
                page = i + 1
              } else if (currentPage <= 3) {
                page = i + 1
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i
              } else {
                page = currentPage - 2 + i
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm border transition font-medium ${
                    currentPage === page
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-[#1a1a2e] border-gray-700/50 hover:border-purple-500/50 text-gray-400'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 bg-[#1a1a2e] border border-gray-700/50 rounded-lg text-sm disabled:opacity-30 hover:border-purple-500/50 transition font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
