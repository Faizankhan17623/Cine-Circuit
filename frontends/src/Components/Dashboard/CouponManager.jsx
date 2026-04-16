import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTag, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaTimes } from 'react-icons/fa'
import { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } from '../../Services/operations/Coupon'

const EMPTY_FORM = {
    code: '',
    discountType: 'flat',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    expiryDate: '',
    usageLimit: '',
    perUserLimit: '1',
}

const CouponManager = () => {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)

    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1)

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState('')

    const [deleteConfirm, setDeleteConfirm] = useState(null) // coupon object to delete

    const fetchCoupons = async (p = page) => {
        setLoading(true)
        const result = await dispatch(getAllCoupons(token, p))
        if (result.success) {
            setCoupons(result.data)
            setTotalPages(result.totalPages)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCoupons(page)
    }, [page])

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: name === 'code' ? value.toUpperCase() : value }))
        setFormError('')
    }

    const openCreate = () => {
        setEditingId(null)
        setForm(EMPTY_FORM)
        setFormError('')
        setShowForm(true)
    }

    const openEdit = (coupon) => {
        setEditingId(coupon._id)
        setForm({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: String(coupon.discountValue),
            minOrderAmount: String(coupon.minOrderAmount || ''),
            maxDiscount: String(coupon.maxDiscount || ''),
            expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
            usageLimit: String(coupon.usageLimit),
            perUserLimit: String(coupon.perUserLimit || 1),
        })
        setFormError('')
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!form.code || !form.discountValue || !form.expiryDate || !form.usageLimit) {
            setFormError('Code, discount value, expiry date and usage limit are required')
            return
        }
        if (parseFloat(form.discountValue) <= 0) {
            setFormError('Discount value must be greater than 0')
            return
        }
        if (form.discountType === 'percentage' && parseFloat(form.discountValue) > 100) {
            setFormError('Percentage discount cannot exceed 100')
            return
        }

        const payload = {
            code: form.code.trim(),
            discountType: form.discountType,
            discountValue: parseFloat(form.discountValue),
            minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : 0,
            maxDiscount: (form.discountType === 'percentage' && form.maxDiscount) ? parseFloat(form.maxDiscount) : null,
            expiryDate: form.expiryDate,
            usageLimit: parseInt(form.usageLimit),
            perUserLimit: parseInt(form.perUserLimit) || 1,
        }

        setFormLoading(true)
        let result
        if (editingId) {
            result = await dispatch(updateCoupon({ couponId: editingId, ...payload }, token))
        } else {
            result = await dispatch(createCoupon(payload, token))
        }
        setFormLoading(false)

        if (result.success) {
            setShowForm(false)
            setEditingId(null)
            setForm(EMPTY_FORM)
            fetchCoupons(page)
        } else {
            setFormError(result.message || 'Something went wrong')
        }
    }

    const handleToggleActive = async (coupon) => {
        const result = await dispatch(updateCoupon({ couponId: coupon._id, isActive: !coupon.isActive }, token))
        if (result.success) {
            setCoupons((prev) =>
                prev.map((c) => c._id === coupon._id ? { ...c, isActive: !coupon.isActive } : c)
            )
        }
    }

    const handleDelete = async () => {
        if (!deleteConfirm) return
        const result = await dispatch(deleteCoupon(deleteConfirm._id, token))
        if (result.success) {
            setDeleteConfirm(null)
            fetchCoupons(page)
        }
    }

    const isExpired = (date) => new Date(date) < new Date()

    return (
        <div className="p-6 text-white min-h-screen bg-richblack-900">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FaTag className="text-yellow-400" /> Coupon Manager
                    </h1>
                    <p className="text-richblack-400 text-sm mt-1">Create and manage promo codes for ticket discounts</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-xl transition text-sm"
                >
                    <FaPlus size={12} /> Create Coupon
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : coupons.length === 0 ? (
                <div className="text-center py-20 text-richblack-400">
                    <FaTag size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No coupons yet. Create your first one!</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-richblack-700">
                    <table className="w-full text-sm">
                        <thead className="bg-richblack-800 text-richblack-300 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-4 py-3 text-left">Code</th>
                                <th className="px-4 py-3 text-left">Discount</th>
                                <th className="px-4 py-3 text-left">Min Order</th>
                                <th className="px-4 py-3 text-left">Used / Limit</th>
                                <th className="px-4 py-3 text-left">Expiry</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon) => (
                                <tr key={coupon._id} className="border-t border-richblack-700 hover:bg-richblack-800/50 transition">
                                    <td className="px-4 py-3 font-mono font-bold text-yellow-400">{coupon.code}</td>
                                    <td className="px-4 py-3">
                                        {coupon.discountType === 'flat'
                                            ? <span className="text-green-400">₹{coupon.discountValue} off</span>
                                            : <span className="text-blue-400">
                                                {coupon.discountValue}% off
                                                {coupon.maxDiscount ? ` (max ₹${coupon.maxDiscount})` : ''}
                                              </span>
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-richblack-300">
                                        {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={coupon.usedCount >= coupon.usageLimit ? 'text-red-400' : 'text-richblack-200'}>
                                            {coupon.usedCount} / {coupon.usageLimit}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={isExpired(coupon.expiryDate) ? 'text-red-400' : 'text-richblack-300'}>
                                            {new Date(coupon.expiryDate).toLocaleDateString('en-IN')}
                                            {isExpired(coupon.expiryDate) && ' (expired)'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleToggleActive(coupon)}
                                            className={`flex items-center gap-1 text-xs font-semibold transition ${
                                                coupon.isActive ? 'text-green-400 hover:text-green-300' : 'text-richblack-500 hover:text-richblack-300'
                                            }`}
                                        >
                                            {coupon.isActive
                                                ? <><FaToggleOn size={16} /> Active</>
                                                : <><FaToggleOff size={16} /> Inactive</>
                                            }
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEdit(coupon)}
                                                className="p-1.5 rounded-lg bg-richblack-700 hover:bg-yellow-400/20 hover:text-yellow-400 text-richblack-300 transition"
                                                title="Edit"
                                            >
                                                <FaEdit size={12} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(coupon)}
                                                className="p-1.5 rounded-lg bg-richblack-700 hover:bg-red-500/20 hover:text-red-400 text-richblack-300 transition"
                                                title="Delete"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1 rounded-lg text-sm transition ${
                                p === page
                                    ? 'bg-yellow-400 text-black font-semibold'
                                    : 'bg-richblack-700 text-richblack-300 hover:bg-richblack-600'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}

            {/* Create / Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="bg-richblack-800 rounded-2xl border border-richblack-700 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-bold">
                                {editingId ? 'Edit Coupon' : 'Create Coupon'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-richblack-400 hover:text-white transition">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Code */}
                            <div>
                                <label className="text-xs text-richblack-300 mb-1 block">Coupon Code *</label>
                                <input
                                    name="code"
                                    value={form.code}
                                    onChange={handleFormChange}
                                    placeholder="e.g. SUMMER20"
                                    maxLength={20}
                                    className="w-full bg-richblack-700 border border-richblack-600 rounded-xl px-4 py-2.5 text-sm text-white uppercase placeholder-richblack-400 focus:outline-none focus:border-yellow-400 transition font-mono tracking-widest"
                                />
                            </div>

                            {/* Discount Type */}
                            <div>
                                <label className="text-xs text-richblack-300 mb-1 block">Discount Type *</label>
                                <div className="flex gap-3">
                                    {['flat', 'percentage'].map((type) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="discountType"
                                                value={type}
                                                checked={form.discountType === type}
                                                onChange={handleFormChange}
                                                className="accent-yellow-400"
                                            />
                                            <span className="text-sm capitalize">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Discount Value */}
                            <div>
                                <label className="text-xs text-richblack-300 mb-1 block">
                                    {form.discountType === 'flat' ? 'Discount Amount (₹) *' : 'Discount Percentage (%) *'}
                                </label>
                                <input
                                    type="number"
                                    name="discountValue"
                                    value={form.discountValue}
                                    onChange={handleFormChange}
                                    min="1"
                                    max={form.discountType === 'percentage' ? 100 : undefined}
                                    placeholder={form.discountType === 'flat' ? '50' : '20'}
                                    className="w-full bg-richblack-700 border border-richblack-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-400 transition"
                                />
                            </div>

                            {/* Max Discount (percentage only) */}
                            {form.discountType === 'percentage' && (
                                <div>
                                    <label className="text-xs text-richblack-300 mb-1 block">Max Discount Cap (₹) — optional</label>
                                    <input
                                        type="number"
                                        name="maxDiscount"
                                        value={form.maxDiscount}
                                        onChange={handleFormChange}
                                        min="1"
                                        placeholder="e.g. 100"
                                        className="w-full bg-richblack-700 border border-richblack-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-400 transition"
                                    />
                                </div>
                            )}

                            {/* Min Order Amount */}
                            <div>
                                <label className="text-xs text-richblack-300 mb-1 block">Minimum Order Amount (₹) — optional</label>
                                <input
                                    type="number"
                                    name="minOrderAmount"
                                    value={form.minOrderAmount}
                                    onChange={handleFormChange}
                                    min="0"
                                    placeholder="0 = no minimum"
                                    className="w-full bg-richblack-700 border border-richblack-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-400 transition"
                                />
                            </div>

                            {/* Expiry Date */}
                            <div>
                                <label className="text-xs text-richblack-300 mb-1 block">Expiry Date *</label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={form.expiryDate}
                                    onChange={handleFormChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-richblack-700 border border-richblack-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                                />
                            </div>

                            {/* Usage Limit */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-richblack-300 mb-1 block">Total Usage Limit *</label>
                                    <input
                                        type="number"
                                        name="usageLimit"
                                        value={form.usageLimit}
                                        onChange={handleFormChange}
                                        min="1"
                                        placeholder="100"
                                        className="w-full bg-richblack-700 border border-richblack-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-400 transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-richblack-300 mb-1 block">Per-User Limit</label>
                                    <input
                                        type="number"
                                        name="perUserLimit"
                                        value={form.perUserLimit}
                                        onChange={handleFormChange}
                                        min="1"
                                        placeholder="1"
                                        className="w-full bg-richblack-700 border border-richblack-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-richblack-400 focus:outline-none focus:border-yellow-400 transition"
                                    />
                                </div>
                            </div>

                            {formError && (
                                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{formError}</p>
                            )}

                            <div className="flex gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-richblack-600 text-richblack-300 hover:text-white hover:border-richblack-500 transition text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold transition text-sm"
                                >
                                    {formLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="bg-richblack-800 rounded-2xl border border-richblack-700 p-6 w-full max-w-sm text-center">
                        <FaTrash className="text-red-400 text-3xl mx-auto mb-4" />
                        <h3 className="text-lg font-bold mb-2">Delete Coupon?</h3>
                        <p className="text-richblack-400 text-sm mb-6">
                            Are you sure you want to delete <span className="text-yellow-400 font-mono font-bold">{deleteConfirm.code}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-2.5 rounded-xl border border-richblack-600 text-richblack-300 hover:text-white transition text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CouponManager
