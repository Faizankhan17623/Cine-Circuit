import React, { useEffect, useState } from 'react'
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GetAllLanguages, CreateLanguageOp, UpdateLanguageOp, DeleteLanguageOp } from '../../Services/operations/Admin'
import Loader from '../extra/Loading'

const Language = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newLang, setNewLang] = useState('')
  const [showAddLang, setShowAddLang] = useState(false)
  const [editingLang, setEditingLang] = useState(null)
  const [editName, setEditName] = useState('')

  const fetchLanguages = async () => {
    setLoading(true)
    try {
      const response = await dispatch(GetAllLanguages(token, navigate))
      if (response?.success) {
        setLanguages(response.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchLanguages()
  }, [token])

  const addLanguage = async () => {
    const name = newLang.trim()
    if (!name) return toast.error('Language name cannot be empty')
    const response = await dispatch(CreateLanguageOp(token, name, navigate))
    if (response?.success) {
      setNewLang('')
      setShowAddLang(false)
      fetchLanguages()
    }
  }

  const deleteLang = async (e, id) => {
    e.stopPropagation()
    const response = await dispatch(DeleteLanguageOp(token, id, navigate))
    if (response?.success) {
      setLanguages(prev => prev.filter(l => l._id !== id))
    }
  }

  const startEdit = (e, lang) => {
    e.stopPropagation()
    setEditingLang(lang._id)
    setEditName(lang.name)
  }

  const saveEdit = async (id) => {
    const name = editName.trim()
    if (!name) return toast.error('Language name cannot be empty')
    const response = await dispatch(UpdateLanguageOp(token, id, name, navigate))
    if (response?.success) {
      setEditingLang(null)
      fetchLanguages()
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
          <h1 className="text-2xl md:text-3xl font-bold">Languages</h1>
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-medium">
            {languages.length}
          </span>
        </div>
        <button
          onClick={() => setShowAddLang(true)}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <FaPlus /> Add Language
        </button>
      </div>

      {/* Add Language Inline */}
      {showAddLang && (
        <div className="mb-6 bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4 flex gap-3">
          <input
            type="text"
            value={newLang}
            onChange={(e) => setNewLang(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
            placeholder="Enter language name..."
            autoFocus
            className="flex-1 bg-[#12122a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
          <button
            onClick={addLanguage}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Add
          </button>
          <button
            onClick={() => { setShowAddLang(false); setNewLang('') }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Language Grid */}
      {languages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">No languages yet</p>
          <p className="text-sm mt-1">Click "Add Language" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {languages.map((lang) => (
            <div
              key={lang._id}
              className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4 hover:border-purple-500 transition group"
            >
              {editingLang === lang._id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(lang._id)
                      if (e.key === 'Escape') setEditingLang(null)
                    }}
                    autoFocus
                    className="flex-1 bg-[#12122a] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500 transition min-w-0"
                  />
                  <button
                    onClick={() => saveEdit(lang._id)}
                    className="text-green-400 hover:text-green-300 text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm truncate flex-1">{lang.name}</h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition ml-2">
                    <button
                      onClick={(e) => startEdit(e, lang)}
                      className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={(e) => deleteLang(e, lang._id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Language
