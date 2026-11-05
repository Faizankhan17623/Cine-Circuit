import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckInTicket } from '../../Services/operations/Theatre'

// The ticket QR holds {"id": paymentId, "sig": signature}; a hardware scanner types it into the box like a keyboard
const CheckIn = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const [qrText, setQrText] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [signature, setSignature] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    let id = paymentId.trim()
    let sig = signature.trim()
    if (qrText.trim()) {
      try {
        const parsed = JSON.parse(qrText)
        id = String(parsed?.id || '')
        sig = String(parsed?.sig || '')
      } catch {
        setResult({ success: false, message: 'The scanned text is not a valid ticket QR code' })
        return
      }
    }
    if (!id || !sig) {
      setResult({ success: false, message: 'Scan a ticket QR code or enter the payment id and signature' })
      return
    }
    setLoading(true)
    setResult(await dispatch(CheckInTicket(id, sig, token)))
    setLoading(false)
    setQrText('')
  }

  const inputClass = 'w-full bg-richblack-800 border border-richblack-600 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-yellow-200'

  return (
    <div className="text-white p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Ticket Check-In</h1>

      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 flex flex-col gap-4">
        <label className="text-sm text-richblack-300">
          Scanned QR code
          <textarea
            autoFocus
            rows={3}
            value={qrText}
            onChange={(e) => setQrText(e.target.value)}
            placeholder='{"id":"...","sig":"..."}'
            className={`${inputClass} mt-1 font-mono`}
          />
        </label>

        <p className="text-center text-xs text-richblack-400">or enter the ticket details by hand</p>

        <label className="text-sm text-richblack-300">
          Payment ID
          <input value={paymentId} onChange={(e) => setPaymentId(e.target.value)} className={`${inputClass} mt-1`} />
        </label>
        <label className="text-sm text-richblack-300">
          Signature
          <input value={signature} onChange={(e) => setSignature(e.target.value)} className={`${inputClass} mt-1`} />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-200 text-richblack-900 font-semibold rounded-lg py-2 disabled:opacity-50"
        >
          {loading ? 'Checking in...' : 'Check In'}
        </button>
      </form>

      {result && (
        <div
          role="status"
          className={`glass-card rounded-xl p-4 mt-6 border ${result.success ? 'border-green-500 text-green-300' : 'border-red-500 text-red-300'}`}
        >
          {result.success ? (
            <>
              <p className="font-semibold">Ticket checked in</p>
              <p className="text-sm text-richblack-200 mt-1">Tickets: {result.data?.totalTicketpurchased}</p>
              <p className="text-sm text-richblack-200">Show: {result.data?.Showdate} at {result.data?.time}</p>
              <p className="text-sm text-richblack-400">Checked in at {result.data?.checkedInAt}</p>
            </>
          ) : (
            <p>{result.message || 'Check-in failed'}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CheckIn
