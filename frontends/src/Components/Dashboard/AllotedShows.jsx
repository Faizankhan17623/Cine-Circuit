import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetShowAllotedDetails } from '../../Services/operations/Theatre'

const AllotedShows = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [shows, setShows] = useState([])

  useEffect(() => {
    const fetchShows = async () => {
      const result = await dispatch(GetShowAllotedDetails(token))
      if (result?.success) {
        setShows(result.data.show || [])
      }
      setLoading(false)
    }
    if (token) fetchShows()
  }, [dispatch, token])

  if (loading) {
    return <div className="text-white text-center mt-10">Loading Alloted Shows...</div>
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Alloted Shows</h1>
      {shows.length > 0 ? (
        <div className="grid gap-4">
          {shows.map((item, index) => (
            <div key={index} className="bg-richblack-800 rounded-lg p-4 border border-richblack-700">
              <p className="font-semibold text-lg">{item.data?.title || `Show ${index + 1}`}</p>
              <p className="text-richblack-300 text-sm mt-1">Status: {item.data?.movieStatus || 'N/A'}</p>
              {item.data?.releasedate && (
                <p className="text-richblack-400 text-sm">Release: {item.data.releasedate}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-richblack-800 rounded-lg p-6">
          <p className="text-richblack-300">No shows alloted to your theatre yet.</p>
        </div>
      )}
    </div>
  )
}

export default AllotedShows
