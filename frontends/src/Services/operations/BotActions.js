// Bot Actions — Cine Circuit Form-Filling Bot
// Direct API calls for the bot. Each function returns { success, message, data? }

import Cookies from 'js-cookie';
import { apiConnector } from '../apiConnector';
import { SendOtp, Login, CreateUser, SearchApi } from '../Apis/UserApi';
import { CreateOrgainezer } from '../Apis/OranizaerApi';
import { CreateTheatrere } from '../Apis/TheatreApi';
import { setToken, setLogin, setUser, setUserImage } from '../../Slices/authSlice';
import { setuser, setStatus, setAttempts, setEditUntil } from '../../Slices/ProfileSlice';
import { setRejectedData } from '../../Slices/orgainezerSlice';

// ── Send OTP ──────────────────────────────────────────────────────────────────
export async function botSendOtp(email) {
  try {
    const res = await apiConnector('POST', SendOtp.createotp, { email });
    if (res.data.success) {
      return {
        success: true,
        message: `OTP sent to ${email}! Check your inbox — it expires in 2 minutes.`,
      };
    }
    return { success: false, message: res.data.message || 'Failed to send OTP.' };
  } catch (e) {
    const msg = e?.response?.data?.message || 'Failed to send OTP. Make sure the email is valid.';
    return { success: false, message: msg };
  }
}

// ── Login ─────────────────────────────────────────────────────────────────────
export async function botLogin(email, password, dispatch, navigate) {
  try {
    const res = await apiConnector('POST', Login.login, { email, password });
    if (res.data.success) {
      const { token, user } = res.data;

      // Update Redux store — same as the normal login flow
      dispatch(setToken(token));
      dispatch(setLogin(true));
      dispatch(setUserImage(user?.image || ''));
      dispatch(setUser(user));
      dispatch(setuser({ ...user }));

      // Sync organizer status
      const orgData = user?.orgainezerdata;
      if (orgData && typeof orgData === 'object') {
        dispatch(setStatus(orgData.status === 'pending' ? 'submitted' : orgData.status));
        dispatch(setAttempts(orgData.attempts ?? 0));
        dispatch(setEditUntil(orgData.editUntil ?? ''));
      } else if (orgData) {
        dispatch(setStatus('submitted'));
      } else {
        dispatch(setStatus('pending'));
        dispatch(setAttempts(0));
        dispatch(setEditUntil(''));
        dispatch(setRejectedData(null));
      }

      // Persist token
      Cookies.set('token', token, { expires: 2 });
      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('Verified', JSON.stringify(user.verified));
      localStorage.setItem('userImage', user?.image || '');

      // Navigate after a short delay so the bot message is visible
      setTimeout(() => navigate('/Dashboard/My-Profile'), 1500);

      return {
        success: true,
        message: `Logged in as ${user?.userName || email} (${user?.usertype})! Taking you to the dashboard...`,
        user,
      };
    }
    return { success: false, message: res.data.message || 'Login failed.' };
  } catch (e) {
    const msg = e?.response?.data?.message || 'Login failed. Check your email and password.';
    return { success: false, message: msg };
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────
export function botLogout(dispatch) {
  dispatch(setToken(null));
  dispatch(setUser(null));
  dispatch(setLogin(false));
  dispatch(setuser(null));
  dispatch(setStatus('pending'));
  dispatch(setAttempts(0));
  dispatch(setEditUntil(''));
  dispatch(setRejectedData(null));
  Cookies.remove('token');
  localStorage.removeItem('token');
  localStorage.removeItem('userImage');
  localStorage.removeItem('user');
  localStorage.removeItem('Verified');
  localStorage.removeItem('Data_Submitted');
  return { success: true, message: 'You have been logged out successfully.' };
}

// ── Create Viewer ─────────────────────────────────────────────────────────────
export async function botCreateViewer(name, email, password, phone, otp, countrycode = '+91') {
  try {
    const res = await apiConnector('POST', CreateUser.createuser, {
      name,
      email,
      password,
      number: phone,
      otp: String(otp),
      countrycode,
    });
    if (res.data.success) {
      return {
        success: true,
        message: `Viewer account created for ${name}! You can now login with ${email}.`,
      };
    }
    return { success: false, message: res.data.message || 'Failed to create account.' };
  } catch (e) {
    const msg = e?.response?.data?.message || 'Failed to create Viewer account.';
    return { success: false, message: msg };
  }
}

// ── Create Organizer ──────────────────────────────────────────────────────────
export async function botCreateOrganizer(name, email, password, phone, otp, countrycode = '+91') {
  try {
    const res = await apiConnector('POST', CreateOrgainezer.createorgainezer, {
      name,
      email,
      password,
      number: phone,
      otp: String(otp),
      countrycode,
    });
    if (res.data.success) {
      return {
        success: true,
        message: `Organizer account created for ${name}! After admin approval you can start creating shows.`,
      };
    }
    return { success: false, message: res.data.message || 'Failed to create Organizer account.' };
  } catch (e) {
    const msg = e?.response?.data?.message || 'Failed to create Organizer account.';
    return { success: false, message: msg };
  }
}

// ── Create Theatre ────────────────────────────────────────────────────────────
export async function botCreateTheatre(name, email, password) {
  try {
    const res = await apiConnector('POST', CreateTheatrere.CreateTheatre, {
      name,
      email,
      password,
    });
    if (res.data.success) {
      return {
        success: true,
        message: `Theatre account registered for ${name}! Awaiting admin verification.`,
      };
    }
    return { success: false, message: res.data.message || 'Failed to register Theatre.' };
  } catch (e) {
    const msg = e?.response?.data?.message || 'Failed to register Theatre account.';
    return { success: false, message: msg };
  }
}

// ── Search Movies ─────────────────────────────────────────────────────────────
export async function botSearch(query) {
  try {
    const res = await apiConnector('GET', SearchApi.search, null, {}, { query });
    if (res.data.success) {
      const movies = res.data.data || [];
      if (movies.length === 0) {
        return { success: true, message: `No movies found for "${query}".`, movies: [] };
      }
      return {
        success: true,
        message: `Found ${movies.length} result${movies.length > 1 ? 's' : ''} for "${query}":`,
        movies: movies.slice(0, 6),
      };
    }
    return { success: false, message: 'Search failed. Try again.' };
  } catch (e) {
    return { success: false, message: 'Search failed. Try again.' };
  }
}
