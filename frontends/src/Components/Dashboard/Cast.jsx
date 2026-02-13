import React, { useEffect, useState, useRef } from 'react'
import { FaPlus, FaTrash, FaEdit, FaUser, FaImage, FaCamera } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GetAllCast, CreateNewCast, UpdateCastName, UpdateCastImage, DeleteCast } from '../../Services/operations/Cast'
import Loader from '../extra/Loading'

const Cast = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const fileInputRef = useRef(null)
  const updateImageRef = useRef(null)

  const [castList, setCastList] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddCast, setShowAddCast] = useState(false)
  const [newCastName, setNewCastName] = useState('')
  const [newCastImage, setNewCastImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [editingCast, setEditingCast] = useState(null)
  const [editName, setEditName] = useState('')
  const [updateImageCast, setUpdateImageCast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [selectedCast, setSelectedCast] = useState(null)

  const fetchCast = async () => {
    setLoading(true)
    try {
      const response = await dispatch(GetAllCast(token, navigate))
      if (response?.success) {
        setCastList(response.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchCast()
  }, [token])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or WebP)')
        return
      }
      setNewCastImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const addCast = async () => {
    const name = newCastName.trim()
    if (!name) return toast.error('Cast name cannot be empty')
    if (!newCastImage) return toast.error('Please select an image')

    const response = await dispatch(CreateNewCast(token, name, newCastImage, navigate))
    if (response?.success) {
      setNewCastName('')
      setNewCastImage(null)
      setImagePreview(null)
      setShowAddCast(false)
      fetchCast()
    }
  }

  const deleteCast = async (id) => {
    const response = await dispatch(DeleteCast(token, id, navigate))
    if (response?.success) {
      setCastList(prev => prev.filter(c => c._id !== id))
      setDeleteConfirm(null)
    }
  }

  const startEdit = (e, cast) => {
    e.stopPropagation()
    setEditingCast(cast._id)
    setEditName(cast.name)
  }

  const saveEdit = async (id) => {
    const name = editName.trim()
    if (!name) return toast.error('Cast name cannot be empty')
    const response = await dispatch(UpdateCastName(token, id, name, navigate))
    if (response?.success) {
      setEditingCast(null)
      fetchCast()
    }
  }

  const handleUpdateImage = async (id, file) => {
    if (!file) return
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)')
      return
    }
    const response = await dispatch(UpdateCastImage(token, id, file, navigate))
    if (response?.success) {
      setUpdateImageCast(null)
      fetchCast()
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4 md:p-6 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaUser className="text-2xl text-yellow-500" />
          <h1 className="text-2xl md:text-3xl font-bold">Cast Members</h1>
          <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-medium">
            {castList.length}
          </span>
        </div>
        <button
          onClick={() => setShowAddCast(true)}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <FaPlus /> Add Cast
        </button>
      </div>

      {/* Add Cast Form */}
      {showAddCast && (
        <div className="mb-6 bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Image Upload */}
            <div className="flex flex-col items-center gap-2">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-600 hover:border-yellow-500 flex items-center justify-center cursor-pointer transition overflow-hidden"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500">
                    <FaCamera className="text-2xl mx-auto mb-1" />
                    <span className="text-xs">Upload Image</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name Input and Buttons */}
            <div className="flex-1 flex flex-col gap-3">
              <input
                type="text"
                value={newCastName}
                onChange={(e) => setNewCastName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCast()}
                placeholder="Enter cast member name..."
                autoFocus
                className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition"
              />
              <div className="flex gap-3">
                <button
                  onClick={addCast}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  Add Cast Member
                </button>
                <button
                  onClick={() => {
                    setShowAddCast(false)
                    setNewCastName('')
                    setNewCastImage(null)
                    setImagePreview(null)
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cast Grid */}
      {castList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <FaUser className="text-6xl mb-4 opacity-30" />
          <p className="text-lg">No cast members yet</p>
          <p className="text-sm mt-1">Click "Add Cast" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {castList.map((cast) => (
            <div
              key={cast._id}
              className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl overflow-hidden hover:border-yellow-500/50 transition group"
            >
              {/* Cast Image */}
              <div className="relative aspect-square">
                {cast.images ? (
                  <img
                    src={cast.images}
                    alt={cast.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <FaUser className="text-4xl text-gray-600" />
                  </div>
                )}

                {/* Action Buttons Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => startEdit(e, cast)}
                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition"
                    title="Edit Name"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setUpdateImageCast(cast._id)
                      updateImageRef.current?.click()
                    }}
                    className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/40 text-green-400 transition"
                    title="Update Image"
                  >
                    <FaImage size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cast._id)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>

              {/* Cast Name */}
              <div className="p-3">
                {editingCast === cast._id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(cast._id)
                        if (e.key === 'Escape') setEditingCast(null)
                      }}
                      autoFocus
                      className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(cast._id)}
                        className="flex-1 text-green-400 hover:text-green-300 text-xs font-medium bg-green-500/10 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCast(null)}
                        className="flex-1 text-gray-400 hover:text-gray-300 text-xs font-medium bg-gray-500/10 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <h3 className="font-semibold text-sm truncate text-center">{cast.name}</h3>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden input for updating image */}
      <input
        ref={updateImageRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={(e) => {
          if (updateImageCast && e.target.files[0]) {
            handleUpdateImage(updateImageCast, e.target.files[0])
          }
        }}
        className="hidden"
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-[#12122a] border border-gray-700 rounded-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Delete Cast Member</h2>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this cast member? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteCast(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cast
