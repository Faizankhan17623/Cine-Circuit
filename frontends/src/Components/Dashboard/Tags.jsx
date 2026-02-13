import React, { useEffect, useState } from 'react'
import { FaPlus, FaTrash, FaEdit, FaHashtag } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GetAllTags, CreateTag, UpdateTagName, DeleteTag } from '../../Services/operations/Tags'
import Loader from '../extra/Loading'

const Tags = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { tags: reduxTags, loading: reduxLoading } = useSelector((state) => state.tags)

  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [showAddTag, setShowAddTag] = useState(false)
  const [editingTag, setEditingTag] = useState(null)
  const [editName, setEditName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchTags = async () => {
    setLoading(true)
    try {
      const response = await dispatch(GetAllTags(token, navigate))
      if (response?.success) {
        setTags(response.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchTags()
  }, [token])

  const addTag = async () => {
    const tagname = newTag.trim()
    // console.log(name)
    if (!tagname) return toast.error('Tag name cannot be empty')
    const response = await dispatch(CreateTag(token, tagname, navigate))
    if (response?.success) {
      setNewTag('')
      setShowAddTag(false)
      fetchTags()
    }
  }

  const deleteTag = async (id) => {
    const response = await dispatch(DeleteTag(token, id, navigate))
    if (response?.success) {
      setTags(prev => prev.filter(t => t._id !== id))
      setDeleteConfirm(null)
    }
  }

  const startEdit = (e, tag) => {
    e.stopPropagation()
    setEditingTag(tag._id)
    setEditName(tag.name)
  }

  const saveEdit = async (id) => {
    const name = editName.trim()
    if (!name) return toast.error('Tag name cannot be empty')
    const response = await dispatch(UpdateTagName(token, id, name, navigate))
    if (response?.success) {
      setEditingTag(null)
      fetchTags()
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
          <FaHashtag className="text-2xl text-yellow-500" />
          <h1 className="text-2xl md:text-3xl font-bold">Tags</h1>
          <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-medium">
            {tags.length}
          </span>
        </div>
        <button
          onClick={() => setShowAddTag(true)}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <FaPlus /> Add Tag
        </button>
      </div>

      {/* Add Tag Inline */}
      {showAddTag && (
        <div className="mb-6 bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4 flex gap-3">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
            placeholder="Enter tag name..."
            autoFocus
            className="flex-1 bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition"
          />
          <button
            onClick={addTag}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Add
          </button>
          <button
            onClick={() => { setShowAddTag(false); setNewTag('') }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Tags Grid */}
      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <FaHashtag className="text-6xl mb-4 opacity-30" />
          <p className="text-lg">No tags yet</p>
          <p className="text-sm mt-1">Click "Add Tag" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tags.map((tag) => (
            <div
              key={tag._id}
              className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4 hover:border-yellow-500/50 transition group"
            >
              {editingTag === tag._id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(tag._id)
                      if (e.key === 'Escape') setEditingTag(null)
                    }}
                    autoFocus
                    className="w-full bg-[#12122a] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(tag._id)}
                      className="flex-1 text-green-400 hover:text-green-300 text-sm font-medium bg-green-500/10 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTag(null)}
                      className="flex-1 text-gray-400 hover:text-gray-300 text-sm font-medium bg-gray-500/10 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">#</span>
                      <h3 className="font-semibold text-sm truncate">{tag.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition ml-2">
                      <button
                        onClick={(e) => startEdit(e, tag)}
                        className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(tag._id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

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
            <h2 className="text-xl font-bold mb-4">Delete Tag</h2>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this tag? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteTag(deleteConfirm)}
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

export default Tags
