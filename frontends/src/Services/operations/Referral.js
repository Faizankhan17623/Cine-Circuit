import { apiConnector } from '../apiConnector'
import { ReferralApi } from '../Apis/UserApi'

// Viewer: own referral code, reward rates, stats and the list of invited users
export async function getMyReferral(token) {
    try {
        const response = await apiConnector(
            'GET',
            ReferralApi.MyReferral,
            null,
            { Authorization: `Bearer ${token}` }
        )
        if (!response.data.success) {
            return { success: false, message: response.data.message }
        }
        return { success: true, data: response.data }
    } catch (error) {
        const msg = error?.response?.data?.message || 'Failed to load your referral details'
        return { success: false, message: msg }
    }
}

// Public: used by the signup form to confirm a code before the account is created
export async function validateReferralCode(referralCode) {
    try {
        const response = await apiConnector('POST', ReferralApi.ValidateReferralCode, { referralCode })
        if (!response.data.success) {
            return { success: false, message: response.data.message }
        }
        return {
            success: true,
            message: response.data.message,
            referrerName: response.data.referrerName,
            refereeReward: response.data.refereeReward,
        }
    } catch (error) {
        const msg = error?.response?.data?.message || 'Invalid referral code'
        return { success: false, message: msg }
    }
}
