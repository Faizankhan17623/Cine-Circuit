import toast from 'react-hot-toast'
import { apiConnector } from '../apiConnector'
import { CouponApi } from '../Apis/UserApi'
import { CouponAdminApi } from '../Apis/AdminApi'

// ── User: validate a coupon before paying ─────────────────────────────────────
export async function validateCoupon(couponCode, totalAmount, token) {
    try {
        const response = await apiConnector(
            'POST',
            CouponApi.ValidateCoupon,
            { couponCode, totalAmount },
            { Authorization: `Bearer ${token}` }
        )
        if (!response.data.success) {
            return { success: false, message: response.data.message }
        }
        return {
            success: true,
            discountAmount: response.data.discountAmount,
            finalAmount: response.data.finalAmount,
            couponCode: response.data.couponCode,
            discountType: response.data.discountType,
            discountValue: response.data.discountValue,
        }
    } catch (error) {
        const msg = error?.response?.data?.message || 'Failed to validate coupon'
        return { success: false, message: msg }
    }
}

// ── Admin: create coupon ───────────────────────────────────────────────────────
export function createCoupon(data, token) {
    return async () => {
        const toastId = toast.loading('Creating coupon...')
        try {
            const response = await apiConnector(
                'POST',
                CouponAdminApi.CreateCoupon,
                data,
                { Authorization: `Bearer ${token}` }
            )
            if (!response.data.success) throw new Error(response.data.message)
            toast.success('Coupon created successfully')
            return { success: true, data: response.data.data }
        } catch (error) {
            const msg = error?.response?.data?.message || error.message || 'Failed to create coupon'
            toast.error(msg)
            return { success: false, message: msg }
        } finally {
            toast.dismiss(toastId)
        }
    }
}

// ── Admin: get all coupons ────────────────────────────────────────────────────
export function getAllCoupons(token, page = 1, isActive) {
    return async () => {
        try {
            const params = { page, limit: 20 }
            if (isActive !== undefined) params.isActive = isActive
            const response = await apiConnector(
                'GET',
                CouponAdminApi.GetAllCoupons,
                null,
                { Authorization: `Bearer ${token}` },
                params
            )
            if (!response.data.success) throw new Error(response.data.message)
            return {
                success: true,
                data: response.data.data,
                total: response.data.total,
                totalPages: response.data.totalPages,
                page: response.data.page
            }
        } catch (error) {
            const msg = error?.response?.data?.message || 'Failed to fetch coupons'
            return { success: false, message: msg }
        }
    }
}

// ── Admin: update coupon ──────────────────────────────────────────────────────
export function updateCoupon(data, token) {
    return async () => {
        const toastId = toast.loading('Updating coupon...')
        try {
            const response = await apiConnector(
                'PUT',
                CouponAdminApi.UpdateCoupon,
                data,
                { Authorization: `Bearer ${token}` }
            )
            if (!response.data.success) throw new Error(response.data.message)
            toast.success('Coupon updated successfully')
            return { success: true, data: response.data.data }
        } catch (error) {
            const msg = error?.response?.data?.message || error.message || 'Failed to update coupon'
            toast.error(msg)
            return { success: false, message: msg }
        } finally {
            toast.dismiss(toastId)
        }
    }
}

// ── Admin: delete coupon ──────────────────────────────────────────────────────
export function deleteCoupon(couponId, token) {
    return async () => {
        const toastId = toast.loading('Deleting coupon...')
        try {
            const response = await apiConnector(
                'DELETE',
                `${CouponAdminApi.DeleteCoupon}?couponId=${couponId}`,
                null,
                { Authorization: `Bearer ${token}` }
            )
            if (!response.data.success) throw new Error(response.data.message)
            toast.success('Coupon deleted')
            return { success: true }
        } catch (error) {
            const msg = error?.response?.data?.message || error.message || 'Failed to delete coupon'
            toast.error(msg)
            return { success: false, message: msg }
        } finally {
            toast.dismiss(toastId)
        }
    }
}
