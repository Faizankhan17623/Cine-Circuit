import React, { useEffect, useState, useRef } from 'react'
import Loader from '../extra/Loading'
import { FaCheckCircle, FaTimesCircle, FaTrash, FaEye, FaSearch, FaFilter, FaUsers, FaClock, FaUserCheck, FaUserTimes } from 'react-icons/fa'
import {Orgainezerdetailing,VerifyOrgs,deleteorgs,deleteAllOrgs} from '../../Services/operations/Admin'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import Logout from '../extra/Logout';


const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400 border border-green-500/30',
  Approved: 'bg-green-500/20 text-green-400 border border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
  locked: 'bg-red-500/20 text-red-400 border border-red-500/30',
}

const UserManagement = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {token} = useSelector((state)=>state.auth)

  const [loading, setloading] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceTimer = useRef(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrg, setSelectedOrg] = useState([])
  const [roleDetail, setRoleDetail] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [showDetail, setShowDetail] = useState(false)
  const [orgdata,setOrgdata] = useState([])
  const [fullData, setFullData] = useState(null)
  const [reject,setReject] = useState("")
  const [rejectOrg, setRejectOrg] = useState(null)
  const [rejectDate, setRejectDate] = useState("")
  const [rejectTime, setRejectTime] = useState("")
  const [showImagePreview, setShowImagePreview] = useState(false)
 const [searchParams, setSearchParams] = useSearchParams();
 const [confirmationModal, setConfirmationModal] = useState(null);

 const [currentPage, setCurrentPage] = useState(1)
 const itemsPerPage = 8

 const tomorrow = new Date()
 tomorrow.setDate(tomorrow.getDate() + 1)
 const Min_Date = tomorrow.toISOString().split('T')[0]
 const maxDay = new Date()
 maxDay.setDate(maxDay.getDate() + 31)
 const Max_Date = maxDay.toISOString().split('T')[0]

 const ORgId = searchParams.get("id")

  useEffect(()=>{
    const ApiCall = async()=>{
        if (!token) return;
      setloading(true)
      try{
        const response = await dispatch(Orgainezerdetailing(token,navigate))
        // console.log(response)
        if (response?.success) {
          setOrgdata(response.data.organizersData)
          setFullData(response.data)
        }
      }catch(error){
        console.log(error)
        console.log(error.message)
        toast.error("There is an error while Fetching all the Orgainzer details")
      }finally{
        setloading(false)
      }
    }
    if(token)ApiCall()
  },[token,navigate,dispatch])


  const AcceptOrg = async (id)=>{
     if (!token) return;
      setloading(true)
    try{
      const response = await dispatch(VerifyOrgs(token,id,true,null,null,"approved",navigate))
       if (response?.success) {
         console.log(response)
         toast.success("Organizer approved successfully")
         setOrgdata(prev => prev.map(o => o.id === id ? {...o, status: 'Approved'} : o))
         setShowDetail(false)
       }
    }catch(error){
      console.log(error)
      console.log(error.message)
      toast.error("There is an error in the Verifying the organizers")
    }finally{
      setloading(false)
    }
  }

  const RejectOrg = async (id,editdate,edittime)=>{
    if (!token) return;
      setloading(true)
    try{
      const EditDate = (date)=>{
        const [year,month,day] = date.split("-")
        return `${day}/${month}/${year}`
      }

      const dates = EditDate(editdate)
      const editTime = edittime

      const response = await dispatch(VerifyOrgs(token, id, false, dates, editTime, "rejected", navigate))
       if (response?.success) {
         toast.success("Organizer rejected successfully")
         setOrgdata(prev => prev.map(o => o.id === id ? {...o, status: 'rejected'} : o))
         setReject("")
         setRejectOrg(null)
       }

    }catch(error){
      console.log(error)
      toast.error("There is an error in rejecting the organizer")
    }finally{
      setloading(false)
    }
  }



  const filteredData = orgdata.filter((o) => {
    const status = o.status?.toLowerCase()
    if (debouncedSearch) {
      return o.username?.toLowerCase().includes(debouncedSearch.toLowerCase()) || o.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
    }
    if (filterStatus === 'all') {
      return status === 'pending' || status === 'rejected'
    }
    return status === filterStatus
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

   const handleDelete = async (id) => {
         if (!token) return;
         setloading(true)
         try {
           const response = await dispatch(deleteorgs(token, id, navigate))
           if (response?.success) {
             setOrgdata(prev => prev.filter(o => o.id !== id))
             setShowDetail(false)
             setConfirmationModal(null)
           }
         } catch (error) {
           console.log(error)
           toast.error("Error deleting organizer")
         } finally {
           setloading(false)
         }
       }

       const openDeleteModal = (id) => {
  setConfirmationModal({
    text1: 'Are you sure?',
    text2: 'Do you want to delete this account?',
    btn1Text: 'Delete',
    btn2Text: 'Cancel',
    btn1Handler: () => handleDelete(id),
    btn2Handler: () => setConfirmationModal(null),
  })
}

  const handleDeleteAll = async () => {
    if (!token || selectedIds.length === 0) return
    setloading(true)
    try {
      const response = await dispatch(deleteAllOrgs(token, selectedIds, navigate))
      if (response?.success) {
        setOrgdata(prev => prev.filter(o => !selectedIds.includes(o.id)))
        setSelectedIds([])
        setConfirmationModal(null)
      }
    } catch (error) {
      console.log(error)
      toast.error("Error deleting organizers")
    } finally {
      setloading(false)
    }
  }

  const openDeleteAllModal = () => {
    setConfirmationModal({
      text1: 'Are you sure?',
      text2: `Do you want to delete ${selectedIds.length} organizer(s)?`,
      btn1Text: 'Delete All',
      btn2Text: 'Cancel',
      btn1Handler: () => handleDeleteAll(),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const toggleSelectId = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    const allIds = paginatedData.map(o => o.id)
    const allSelected = allIds.every(id => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !allIds.includes(id)))
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...allIds])])
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  const pendingCount = orgdata.filter((o) => o.status?.toLowerCase() === 'pending').length
  const approvedCount = orgdata.filter((o) => o.status?.toLowerCase() === 'approved').length
  const rejectedCount = orgdata.filter((o) => o.status?.toLowerCase() === 'rejected').length

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
              Organizer Management
            </h1>
            <p className="text-gray-500 text-sm">
              Verify, view, and manage organizer submissions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Total</p>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition">
              <FaUsers className="text-purple-400 text-sm" />
            </div>
          </div>
          <p className="text-3xl font-bold">{orgdata.length}</p>
          <p className="text-gray-600 text-xs mt-1">All organizers</p>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-xl p-5 border border-yellow-500/20 hover:border-yellow-500/30 transition group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-yellow-400 text-xs uppercase tracking-wider font-medium">Pending</p>
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition">
              <FaClock className="text-yellow-400 text-sm" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
          <p className="text-gray-600 text-xs mt-1">Awaiting review</p>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-xl p-5 border border-green-500/20 hover:border-green-500/30 transition group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-green-400 text-xs uppercase tracking-wider font-medium">Approved</p>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition">
              <FaUserCheck className="text-green-400 text-sm" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400">{approvedCount}</p>
          <p className="text-gray-600 text-xs mt-1">Active organizers</p>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-xl p-5 border border-red-500/20 hover:border-red-500/30 transition group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-red-400 text-xs uppercase tracking-wider font-medium">Rejected</p>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition">
              <FaUserTimes className="text-red-400 text-sm" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-400">{rejectedCount}</p>
          <p className="text-gray-600 text-xs mt-1">Rejected / locked</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
              if (debounceTimer.current) clearTimeout(debounceTimer.current)
              debounceTimer.current = setTimeout(() => {
                setDebouncedSearch(e.target.value)
              }, 300)
            }}
            className="w-full bg-[#1a1a2e] border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setDebouncedSearch(''); setCurrentPage(1) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition text-sm"
            >
              &times;
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }}
            className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition cursor-pointer"
          >
            <option value="all">Pending & Rejected</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="approved">Approved</option>
            <option value="locked">Locked</option>
          </select>
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={openDeleteAllModal}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-sm font-medium transition shadow-lg shadow-red-500/20"
          >
            <FaTrash />
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-gray-500 text-xs">
          {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} found
        </p>
        {selectedIds.length > 0 && (
          <p className="text-purple-400 text-xs font-medium">
            {selectedIds.length} selected
          </p>
        )}
      </div>

      {/* Table */}
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#161628] rounded-xl border border-gray-700/40 overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50 bg-[#12122a]/60">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every(o => selectedIds.includes(o.id))}
                    onChange={toggleSelectAll}
                    className="accent-purple-500 cursor-pointer w-4 h-4"
                  />
                </th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">Organizer</th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">Email</th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">Role</th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">Experience</th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">Created</th>
                <th className="p-4 text-left text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 text-center text-gray-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center">
                        <FaUsers className="text-gray-600 text-2xl" />
                      </div>
                      <p className="text-gray-500 font-medium">No organizers found</p>
                      <p className="text-gray-600 text-xs">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((org, idx) => (
                  <tr
                    key={org._id}
                    className={`border-b border-gray-700/20 hover:bg-white/[0.03] transition ${
                      selectedIds.includes(org.id) ? 'bg-purple-500/[0.05]' : ''
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(org.id)}
                        onChange={() => toggleSelectId(org.id)}
                        className="accent-purple-500 cursor-pointer w-4 h-4"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {org.image ? (
                          <img src={org.image} alt={org.username} className="w-9 h-9 rounded-full object-cover border border-gray-600/50" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                            {org.username?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        <span className="font-medium text-white">{org.username}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{org.email}</td>
                    <td className="p-4">
                      <span className="bg-gray-700/30 text-gray-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                        {org.Role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-xs">{org.ExperienceLevel}</td>
                    <td className="p-4 text-gray-500 text-xs">{org.createdAt}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[org.status]}`}
                      >
                        {org.status}
                      </span>
                    </td>
                     <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                          setShowDetail(true)
                          setSelectedOrg(org)
                          setSearchParams({ id: org.id});
                          if (fullData) {
                            let detail = null;
                            if (org.Role === 'Director' && org.ExperienceLevel === 'Fresher') {
                              detail = fullData.directorFresh?.find(d => d._id === org.DirectFresh);
                            } else if (org.Role === 'Director' && org.ExperienceLevel !== 'Fresher') {
                              detail = fullData.directorExperience?.find(d => d._id === org.DirectFresh);
                            } else if (org.Role === 'Producer' && org.ExperienceLevel === 'Fresher') {
                              detail = fullData.producerFresh?.find(d => d._id === org.DirectFresh);
                            } else if (org.Role === 'Producer' && org.ExperienceLevel !== 'Fresher') {
                              detail = fullData.producerExperience?.find(d => d._id === org.DirectFresh);
                            }
                            setRoleDetail(detail);
                          }
                            }}
                          title="View Details"
                          className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                        >
                          <FaEye />
                        </button>
                        {(org.status === 'pending' || org.status === 'rejected') && (
                          <>
                            <button
                              onClick={() => AcceptOrg(org.id)}
                              title="Approve"
                              className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition"
                            >
                              <FaCheckCircle />
                            </button>

                            <button
                              title="Reject"
                              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                               onClick={()=>{setReject(org._id); setRejectOrg(org); setRejectDate(""); setRejectTime("")}}
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openDeleteModal(org.id)}
                          title="Delete"
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </td>
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
            Showing <span className="text-gray-300 font-medium">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="text-gray-300 font-medium">{filteredData.length}</span>
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 bg-[#1a1a2e] border border-gray-700/50 rounded-lg text-sm disabled:opacity-30 hover:border-purple-500/50 transition font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedOrg && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12122a] border border-gray-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl shadow-black/50"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#7c3aed #1a1a2e',
            }}>
            {/* Header with close */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#12122a] z-10 pb-4 border-b border-gray-700/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FaEye className="text-purple-400 text-sm" />
                </div>
                <h2 className="text-xl font-bold">Organizer Details</h2>
              </div>
              <button
                onClick={() => {
                  setShowDetail(false)
                  setSearchParams({})
                }}
                className="text-gray-400 hover:text-white bg-gray-700/30 hover:bg-gray-700/60 w-8 h-8 rounded-full flex items-center justify-center text-lg transition"
              >
                &times;
              </button>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4 mb-6 p-5 bg-gradient-to-r from-[#1a1a2e] to-[#1e1e3a] rounded-xl border border-gray-700/30">
              {selectedOrg.image ? (
                <img
                  src={selectedOrg.image}
                  alt={selectedOrg.username}
                  onClick={() => setShowImagePreview(true)}
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/40 cursor-pointer hover:border-purple-400 hover:scale-105 transition-all shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {selectedOrg.username?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold">{selectedOrg.username}</h3>
                <p className="text-gray-400 text-sm">{selectedOrg.email}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[selectedOrg.status]}`}>
                    {selectedOrg.status}
                  </span>
                  <span className="bg-gray-700/40 text-gray-300 px-3 py-1 rounded-full text-xs">
                    {selectedOrg.Role} - {selectedOrg.ExperienceLevel}
                  </span>
                  <span className="text-xs text-gray-500">
                    Attempts: {selectedOrg.attempts}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">Personal Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Gender</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.gender || 'N/A'}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Phone</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.CountryCode} {selectedOrg.number}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Website</p>
                  {selectedOrg.website ? (
                    <a href={selectedOrg.website} target="_blank" rel="noreferrer" className="mt-1 text-sm text-blue-400 hover:underline block truncate font-medium">{selectedOrg.website}</a>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">N/A</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">Address</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Country</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.Country}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">State</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.state}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">City</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.City}</p>
                </div>
                <div className="col-span-2 md:col-span-3 bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Local Address</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.localaddress}</p>
                </div>
                {!selectedOrg.sameforlocalandpermanent && (
                  <div className="col-span-2 md:col-span-3 bg-[#1a1a2e]/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Permanent Address</p>
                    <p className="mt-1 text-sm font-medium">{selectedOrg.permanentaddress}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Info */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">Professional Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Role</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.Role}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Experience Level</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.ExperienceLevel}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Years of Experience</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.yearsexperience}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Total Projects</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.totalprojects}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Collaboration</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.Collaboration}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Comfortable</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.Comfortable}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Promotions</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.Promotions}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Support Needed</p>
                  <p className="mt-1 text-sm font-medium">{selectedOrg.Support?.needed === 'Yes' ? selectedOrg.Support.type : 'No'}</p>
                </div>
              </div>
              <div className="mt-4 bg-[#1a1a2e]/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wide">Main Reason</p>
                <p className="mt-1 text-sm leading-relaxed">{selectedOrg.MainReason}</p>
              </div>
              <div className="mt-3 bg-[#1a1a2e]/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wide">Short Bio</p>
                <p className="mt-1 text-sm text-gray-300 leading-relaxed">{selectedOrg.Shortbio}</p>
              </div>
            </div>

            {/* Genre & Audience */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">Genre & Audience</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Genre</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrg.Genre?.map((g, i) => (
                      <span key={i} className="bg-purple-500/15 text-purple-300 border border-purple-500/25 px-2.5 py-1 rounded-lg text-xs font-medium">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Sub Genre</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrg.SubGenre?.map((g, i) => (
                      <span key={i} className="bg-blue-500/15 text-blue-300 border border-blue-500/25 px-2.5 py-1 rounded-lg text-xs font-medium">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Target Audience</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrg.Audience?.map((a, i) => (
                      <span key={i} className="bg-green-500/15 text-green-300 border border-green-500/25 px-2.5 py-1 rounded-lg text-xs font-medium">{a}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Screening</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrg.Screening?.map((s, i) => (
                      <span key={i} className="bg-yellow-500/15 text-yellow-300 border border-yellow-500/25 px-2.5 py-1 rounded-lg text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            {selectedOrg.SocialMedia?.active === 'Yes' && selectedOrg.SocialMedia?.profiles?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">Social Media</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedOrg.SocialMedia.profiles.map((p, i) => (
                    <a key={i} href={p.link} target="_blank" rel="noreferrer"
                      className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-3 hover:border-blue-500/40 transition block group">
                      <p className="text-sm font-medium text-blue-400 group-hover:text-blue-300">{p.Platform}</p>
                      <p className="text-xs text-gray-400 mt-1">{p.followers} followers</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {selectedOrg.Certifications?.active === 'Yes' && selectedOrg.Certifications?.items?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">Certifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedOrg.Certifications.items.map((c, i) => (
                    <div key={i} className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{c.Name}</p>
                        <p className="text-xs text-gray-400 mt-1">{c.Date}</p>
                      </div>
                      {c.Certificate && (
                        <a href={c.Certificate} target="_blank" rel="noreferrer"
                          className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/25 px-3 py-1.5 rounded-lg hover:bg-purple-500/25 transition font-medium">
                          View
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notable Projects */}
            {selectedOrg.NotableProjects?.needed === 'Yes' && selectedOrg.NotableProjects?.items?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">
                  Notable Projects ({selectedOrg.NotableProjects.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrg.NotableProjects.items.map((p, i) => (
                    <div key={i} className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.Name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400">Budget: {p.Budget}</span>
                          <span className="text-xs text-gray-400">Role: {p.Role}</span>
                        </div>
                      </div>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noreferrer"
                          className="text-xs bg-blue-500/15 text-blue-300 border border-blue-500/25 px-3 py-1.5 rounded-lg hover:bg-blue-500/25 transition font-medium">
                          Link
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ongoing Projects */}
            {selectedOrg.ongoing?.active === 'Yes' && selectedOrg.ongoing?.items?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">
                  Ongoing Projects ({selectedOrg.ongoing.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrg.ongoing.items.map((p, i) => (
                    <div key={i} className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.ProjectName}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-gray-400">Start: {p.StartDate}</span>
                          <span className="text-xs text-gray-400">End: {p.EndDate}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.Released === 'Yes' ? 'bg-green-500/15 text-green-400 border border-green-500/25' : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25'}`}>
                            {p.Released === 'Yes' ? 'Released' : 'Not Released'}
                          </span>
                        </div>
                      </div>
                      {p.Script && (
                        <a href={p.Script} target="_blank" rel="noreferrer"
                          className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/25 px-3 py-1.5 rounded-lg hover:bg-purple-500/25 transition font-medium">
                          Script
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Planned Projects */}
            {selectedOrg.planned?.active === 'Yes' && selectedOrg.planned?.items?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">
                  Planned Projects ({selectedOrg.planned.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrg.planned.items.map((p, i) => (
                    <div key={i} className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-4">
                      <p className="text-sm font-medium">{p.ProjectName}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-gray-400">Start: {p.StartDate}</span>
                        <span className="text-xs text-gray-400">End: {p.EndDate}</span>
                        {p.ProjectStatus && (
                          <span className="text-xs bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 px-2 py-0.5 rounded-full font-medium">
                            {p.ProjectStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Distribution */}
            {selectedOrg.Distribution?.needed === 'Yes' && selectedOrg.Distribution?.projects?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">
                  Distribution ({selectedOrg.Distribution.projects.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrg.Distribution.projects.map((p, i) => (
                    <div key={i} className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-4">
                      <p className="text-sm font-medium">{p.ProjectName}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-gray-400">Budget: {p.Budget}</span>
                        <span className="text-xs text-gray-400">Role: {p.Role}</span>
                        <span className="text-xs text-gray-400">Release: {p.ReleaseDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Role-Specific Details */}
            {roleDetail && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">
                  {selectedOrg.Role} - {selectedOrg.ExperienceLevel} Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roleDetail.DirectorInspiration && (
                    <div className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-4">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Director Inspiration</p>
                      <p className="mt-1.5 text-sm leading-relaxed">{roleDetail.DirectorInspiration}</p>
                    </div>
                  )}
                  {roleDetail.EarlyChalenges && (
                    <div className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-4">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Early Challenges</p>
                      <p className="mt-1.5 text-sm leading-relaxed">{roleDetail.EarlyChalenges}</p>
                    </div>
                  )}
                  {roleDetail.ProjectPlanning && (
                    <div className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-4">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Project Planning</p>
                      <p className="mt-1.5 text-sm leading-relaxed">{roleDetail.ProjectPlanning}</p>
                    </div>
                  )}
                  {roleDetail.ProjectsDone && (
                    <div className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-4">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Projects Done</p>
                      <p className="mt-1.5 text-sm leading-relaxed">{roleDetail.ProjectsDone}</p>
                    </div>
                  )}
                  {roleDetail.PromotionMarketing && (
                    <div className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-4">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Promotion & Marketing</p>
                      <p className="mt-1.5 text-sm leading-relaxed">{roleDetail.PromotionMarketing}</p>
                    </div>
                  )}
                  {roleDetail.SceneVisualization && (
                    <div className="bg-[#1a1a2e] border border-gray-700/30 rounded-xl p-4">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Scene Visualization</p>
                      <p className="mt-1.5 text-sm leading-relaxed">{roleDetail.SceneVisualization}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-700/30 pb-2">Timestamps</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Created At</p>
                  <p className="mt-1 text-sm font-medium">{new Date(selectedOrg.createdAt).toLocaleString()}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Updated At</p>
                  <p className="mt-1 text-sm font-medium">{new Date(selectedOrg.updatedAt).toLocaleString()}</p>
                </div>
                {selectedOrg.editUntil && (
                  <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Edit Until</p>
                    <p className="mt-1 text-sm font-medium">{new Date(selectedOrg.editUntil).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons in modal */}
            <div className="flex gap-3 mt-8 sticky bottom-0 bg-[#12122a] pt-4 border-t border-gray-700/30">
              {(selectedOrg.status === 'pending' || selectedOrg.status === 'rejected') && (
                <>
                  <button
                    onClick={() => {
                      AcceptOrg(ORgId)
                      setSearchParams({ id: searchParams.get("id"), status : "Approved"});
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                  >
                    <FaCheckCircle /> Approve
                  </button>
                  <button
                    onClick={() => {
                      setRejectOrg(selectedOrg)
                      setReject(selectedOrg._id)
                      setShowDetail(false)
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Overlay */}
      {showImagePreview && selectedOrg?.image && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[70] flex items-center justify-center p-4"
          onClick={() => setShowImagePreview(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-500 text-white w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition z-10 shadow-lg"
            >
              &times;
            </button>
            <img
              src={selectedOrg.image}
              alt={selectedOrg.username}
              className="max-w-[80vw] max-h-[80vh] rounded-2xl object-contain border-2 border-gray-600/50 shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {reject && rejectOrg && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#12122a] border border-gray-700/50 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <FaTimesCircle className="text-red-400 text-sm" />
                </div>
                <h2 className="text-xl font-bold text-red-400">Reject Organizer</h2>
              </div>
              <button
                onClick={() => { setReject(""); setRejectOrg(null) }}
                className="text-gray-400 hover:text-white bg-gray-700/30 hover:bg-gray-700/60 w-8 h-8 rounded-full flex items-center justify-center transition"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Name</p>
                  <p className="font-medium mt-1 text-sm">{rejectOrg.username}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Role</p>
                  <p className="mt-1 text-sm font-medium">{rejectOrg.Role}</p>
                </div>
              </div>
              <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wide">Email</p>
                <p className="text-gray-300 mt-1 text-sm">{rejectOrg.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Experience</p>
                  <p className="mt-1 text-sm font-medium">{rejectOrg.ExperienceLevel}</p>
                </div>
                <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Status</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[rejectOrg.status]}`}
                  >
                    {rejectOrg.status}
                  </span>
                </div>
              </div>
              <div className="bg-[#1a1a2e]/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wide">Attempts</p>
                <p className="mt-1 text-sm">
                  {rejectOrg.attempts === 0 ? (
                    <span className="bg-blue-500/15 text-blue-300 border border-blue-500/25 px-3 py-1 rounded-full text-xs font-medium">First Timer</span>
                  ) : (
                    <span className="bg-orange-500/15 text-orange-300 border border-orange-500/25 px-3 py-1 rounded-full text-xs font-medium">{rejectOrg.attempts} Attempt{rejectOrg.attempts > 1 ? 's' : ''}</span>
                  )}
                </p>
              </div>

              <div className="bg-[#1a1a2e]/50 rounded-xl p-4 border border-gray-700/30">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-3 font-medium">Edit Until (Date & Time)</p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-gray-400 text-xs mb-1.5 block font-medium">Date</label>
                    <input
                      type="date"
                      value={rejectDate}
                      onChange={(e) => setRejectDate(e.target.value)}
                      min={Min_Date}
                      max={Max_Date}
                      className="w-full bg-[#12122a] border border-gray-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-400 text-xs mb-1.5 block font-medium">Time</label>
                    <input
                      type="time"
                      value={rejectTime}
                      onChange={(e) => setRejectTime(e.target.value)}
                      className="w-full bg-[#12122a] border border-gray-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setReject(""); setRejectOrg(null) }}
                className="flex-1 bg-gray-700/50 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setReject("")
                  setRejectOrg(null)
                  RejectOrg(rejectOrg.id,rejectDate,rejectTime)
                }}
                disabled={!rejectDate || !rejectTime}
                className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-600/30 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:shadow-none"
              >
                <FaTimesCircle /> Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmationModal && (
        <Logout modalData={confirmationModal} />
      )}
    </div>
  )
}

export default UserManagement
