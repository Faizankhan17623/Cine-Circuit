import React, { useEffect, useState } from 'react'
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GetAllGenres, CreateGenre, UpdateGenre, DeleteGenre, CreateSubgenre, DeleteSubgenre } from '../../Services/operations/Admin'
import Loader from '../extra/Loading'

const Genres = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [newGenre, setNewGenre] = useState('')
  const [showAddGenre, setShowAddGenre] = useState(false)
  const [editingGenre, setEditingGenre] = useState(null)
  const [editName, setEditName] = useState('')
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [newSubgenre, setNewSubgenre] = useState('')

  const fetchGenres = async () => {
    setLoading(true)
    try {
      const response = await dispatch(GetAllGenres(token, navigate))
      if (response?.success) {
        setGenres(response.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchGenres()
  }, [token])

  const addGenre = async () => {
    const name = newGenre.trim()
    if (!name) return toast.error('Genre name cannot be empty')
    const response = await dispatch(CreateGenre(token, name, navigate))
    if (response?.success) {
      setNewGenre('')
      setShowAddGenre(false)
      fetchGenres()
    }
  }

  const deleteGenre = async (e, id) => {
    e.stopPropagation()
    const response = await dispatch(DeleteGenre(token, id, navigate))
    if (response?.success) {
      setGenres(prev => prev.filter(g => g._id !== id))
      if (selectedGenre?._id === id) setSelectedGenre(null)
    }
  }

  const startEdit = (e, genre) => {
    e.stopPropagation()
    setEditingGenre(genre._id)
    setEditName(genre.genreName)
  }

  const saveEdit = async (id) => {
    const name = editName.trim()
    if (!name) return toast.error('Genre name cannot be empty')
    const response = await dispatch(UpdateGenre(token, id, name, navigate))
    if (response?.success) {
      setEditingGenre(null)
      fetchGenres()
    }
  }

  const addSubgenre = async () => {
    const name = newSubgenre.trim()
    if (!name) return toast.error('Subgenre name cannot be empty')
    const response = await dispatch(CreateSubgenre(token, selectedGenre._id, name, navigate))
    if (response?.success) {
      setNewSubgenre('')
      const refreshed = await dispatch(GetAllGenres(token, navigate))
      if (refreshed?.success) {
        setGenres(refreshed.data)
        const updated = refreshed.data.find(g => g._id === selectedGenre._id)
        if (updated) setSelectedGenre(updated)
      }
    }
  }

  const deleteSubgenre = async (subId) => {
    const response = await dispatch(DeleteSubgenre(token, subId, navigate))
    if (response?.success) {
      const refreshed = await dispatch(GetAllGenres(token, navigate))
      if (refreshed?.success) {
        setGenres(refreshed.data)
        const updated = refreshed.data.find(g => g._id === selectedGenre._id)
        if (updated) setSelectedGenre(updated)
      }
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
          <h1 className="text-2xl md:text-3xl font-bold">Genres</h1>
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-medium">
            {genres.length}
          </span>
        </div>
        <button
          onClick={() => setShowAddGenre(true)}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <FaPlus /> Add Genre
        </button>
      </div>

      {/* Add Genre Inline */}
      {showAddGenre && (
        <div className="mb-6 bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4 flex gap-3">
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addGenre()}
            placeholder="Enter genre name..."
            autoFocus
            className="flex-1 bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
          <button
            onClick={addGenre}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Add
          </button>
          <button
            onClick={() => { setShowAddGenre(false); setNewGenre('') }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Genre Grid */}
      {genres.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">No genres yet</p>
          <p className="text-sm mt-1">Click "Add Genre" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <div
              key={genre._id}
              onClick={() => editingGenre !== genre._id && setSelectedGenre(genre)}
              className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4 cursor-pointer hover:border-purple-500 transition group"
            >
              {editingGenre === genre._id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(genre._id)
                      if (e.key === 'Escape') setEditingGenre(null)
                    }}
                    autoFocus
                    className="flex-1 bg-[#12122a] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500 transition min-w-0"
                  />
                  <button
                    onClick={() => saveEdit(genre._id)}
                    className="text-green-400 hover:text-green-300 text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm truncate flex-1">{genre.genreName}</h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition ml-2">
                      <button
                        onClick={(e) => startEdit(e, genre)}
                        className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={(e) => deleteGenre(e, genre._id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    {genre.subgeneres.length} subgenre{genre.subgeneres.length !== 1 ? 's' : ''}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Subgenre Modal */}
      {selectedGenre && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedGenre(null)}
        >
          <div
            className="bg-[#12122a] border border-gray-700 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#7c3aed #1a1a2e' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50">
              <h2 className="text-xl font-bold">{selectedGenre.genreName}</h2>
              <button
                onClick={() => setSelectedGenre(null)}
                className="text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition"
              >
                <IoClose size={18} />
              </button>
            </div>

            {/* Add Subgenre */}
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={newSubgenre}
                onChange={(e) => setNewSubgenre(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSubgenre()}
                placeholder="Add subgenre..."
                className="flex-1 bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
              <button
                onClick={addSubgenre}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <FaPlus size={12} /> Add
              </button>
            </div>

            {/* Subgenres List */}
            {selectedGenre.subgeneres.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No subgenres yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedGenre.subgeneres.map((sub) => (
                  <span
                    key={sub._id}
                    className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                  >
                    {sub.name}
                    <button
                      onClick={() => deleteSubgenre(sub._id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <IoClose size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Genres
