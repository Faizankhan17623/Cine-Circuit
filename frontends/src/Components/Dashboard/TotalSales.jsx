import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CalculateTotalSale } from '../../Services/operations/Theatre'

const TotalSales = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const fetchSales = async () => {
      const result = await dispatch(CalculateTotalSale(token))
      if (result?.success) {
        setTotalAmount(result.data.totalAmount || 0)
      }
      setLoading(false)
    }
    if (token) fetchSales()
  }, [dispatch, token])

  if (loading) {
    return <div className="text-white text-center mt-10">Loading Total Sales...</div>
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Total Sales</h1>
      <div className="bg-richblack-800 rounded-lg p-6">
        <p className="text-richblack-300 text-sm mb-2">Total Revenue</p>
        <p className="text-4xl font-bold text-yellow-200">
          {totalAmount > 0 ? `₹${totalAmount.toLocaleString('en-IN')}` : '₹0'}
        </p>
        {totalAmount === 0 && (
          <p className="text-richblack-400 text-sm mt-3">No sales recorded yet.</p>
        )}
      </div>
    </div>
  )
}

export default TotalSales
