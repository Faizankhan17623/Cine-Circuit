import OtpInput from 'react-otp-input';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Navbar from '../Home/Navbar';
import { LuTimerReset } from "react-icons/lu";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { MdVerifiedUser, MdEmail } from "react-icons/md";
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UserCreation, sendOtp } from '../../Services/operations/Auth';
import { Creation } from '../../Services/operations/orgainezer';

const OTP_TIMER_KEY = 'otp_timer_expiry';
const OTP_DURATION = 60; // seconds

const OTP = ({ Style }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState('');
  const [decrement, setDecrement] = useState(0);
  const intervalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [resendOtp, setResendOtp] = useState('');

  const { otp: sentOtp, mail, data } = location.state || {};

  useEffect(() => {
    if (!sentOtp || !mail || !data) {
      toast.error('Invalid session. Please sign up again.');
      navigate('/SignUp');
    }
  }, [sentOtp, mail, data, navigate]);

  // Calculate remaining seconds from stored expiry
  const getRemainingTime = useCallback(() => {
    const expiry = sessionStorage.getItem(OTP_TIMER_KEY);
    if (!expiry) return 0;
    const remaining = Math.round((parseInt(expiry, 10) - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }, []);

  const startCountdown = useCallback(() => {
    const expiryTime = Date.now() + OTP_DURATION * 1000;
    sessionStorage.setItem(OTP_TIMER_KEY, String(expiryTime));
    setDecrement(OTP_DURATION);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const remaining = Math.round((expiryTime - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        sessionStorage.removeItem(OTP_TIMER_KEY);
        setDecrement(0);
      } else {
        setDecrement(remaining);
      }
    }, 1000);
  }, []);

  // On mount: restore timer from sessionStorage or start fresh
  useEffect(() => {
    const remaining = getRemainingTime();
    if (remaining > 0) {
      // Resume existing timer
      setDecrement(remaining);
      const expiry = parseInt(sessionStorage.getItem(OTP_TIMER_KEY), 10);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const r = Math.round((expiry - Date.now()) / 1000);
        if (r <= 0) {
          clearInterval(intervalRef.current);
          sessionStorage.removeItem(OTP_TIMER_KEY);
          setDecrement(0);
        } else {
          setDecrement(r);
        }
      }, 1000);
    } else {
      // No active timer — start a new countdown
      startCountdown();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleVerifyClick = async () => {
    if (data.usertype === 'Viewer') {
      if (otp === String(sentOtp) || otp === String(resendOtp)) {
        try {
          setLoading(true);
          const fullName = `${data.firstName} ${data.lastName}`;
          const response = await dispatch(
            UserCreation(fullName, data.password, data.email, data.phoneNumber, otp, data.countryCode)
          );
          if (response?.success) {
            toast.success('User Created');
            sessionStorage.removeItem(OTP_TIMER_KEY);
            navigate('/Login');
          } else {
            toast.error('Error in creating the user');
          }
        } catch (error) {
          console.log(error);
          toast.error('Error in filling the details');
        } finally {
          setLoading(false);
        }
      } else {
        toast.error('Wrong OTP. Please try again.');
      }
    }

    if (data.usertype === 'Organizer') {
      if (otp === String(sentOtp) || otp === String(resendOtp)) {
        try {
          setLoading(true);
          const fullName = `${data.firstName} ${data.lastName}`;
          // console.log(fullName, data.password, data.email, data.phoneNumber, otp)
          // console.log(data)
          const response = await dispatch(Creation(fullName, data.password, data.email, data.phoneNumber, otp, data.countryCode));
          if (response?.success) {
            toast.success('User Created');
            sessionStorage.removeItem(OTP_TIMER_KEY);
            navigate('/Login');
          } else {
            toast.error('Error in creating the user');
          }
        } catch (error) {
          console.log(error);
          toast.error('Error in filling the details');
        } finally {
          setLoading(false);
        }
      } else {
        toast.error('Wrong OTP. Please try again.');
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setOtp('');
      const response = await dispatch(sendOtp(data.email));
      if (response?.success) {
        toast.success('OTP sent to your email');
        setResendOtp(response.data.data.data);
        startCountdown();
      } else {
        toast.error('Error in sending the OTP');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error in resending the OTP');
    } finally {
      setLoading(false);
    }
  };

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Circular progress for timer
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (decrement / OTP_DURATION) * circumference;

  return (
    <div className={`${Style ? 'hidden' : 'w-full min-h-screen flex flex-col overflow-x-hidden bg-richblack-900'}`}>
      <Navbar />
      <div className="flex-1 flex justify-center items-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-richblack-800 border border-richblack-700 rounded-2xl shadow-2xl p-8 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-100 flex items-center justify-center shadow-lg">
                <MdEmail className="text-3xl text-richblack-900" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Verify Your <span className="bg-gradient-to-r from-yellow-200 to-yellow-50 bg-clip-text text-transparent">Email</span>
              </h1>
              <p className="text-richblack-300 text-sm leading-relaxed">
                A 6-digit verification code has been sent to
                <br />
                <span className="text-yellow-200 font-medium">{mail || 'your email'}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="py-2">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => (
                  <input
                    type="tel"
                    maxLength={1}
                    {...props}
                    placeholder="-"
                    className="!w-12 !h-14 sm:!w-14 sm:!h-16 border-2 border-richblack-600 bg-richblack-700 text-xl font-bold rounded-xl text-white text-center outline-none transition-all duration-200 focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200/30 focus:bg-richblack-600 placeholder:text-richblack-500"
                  />
                )}
                containerStyle={{
                  justifyContent: 'center',
                  gap: '8px',
                }}
              />
            </div>

            {/* Timer */}
            <div className="flex justify-center items-center gap-3">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-richblack-700" />
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ${decrement <= 10 ? 'text-red-500' : 'text-yellow-200'}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-sm font-bold font-mono ${decrement <= 10 ? 'text-red-400' : 'text-yellow-200'}`}>
                    {formatTime(decrement)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-richblack-300">
                {decrement > 0 ? (
                  <span>Code expires in <span className={`font-semibold ${decrement <= 10 ? 'text-red-400' : 'text-yellow-200'}`}>{decrement}s</span></span>
                ) : (
                  <span className="text-red-400 font-medium">Code expired. Resend to get a new one.</span>
                )}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="button"
              className={`w-full py-3.5 rounded-xl text-base font-bold tracking-wide transition-all duration-200 shadow-lg flex justify-center items-center gap-2 ${
                otp.length < 6 || loading
                  ? 'bg-richblack-600 text-richblack-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-200 to-yellow-100 text-richblack-900 hover:shadow-yellow-200/20 hover:shadow-xl active:scale-[0.98]'
              }`}
              onClick={handleVerifyClick}
              disabled={otp.length < 6 || loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <MdVerifiedUser className="text-lg" />
                  <span>Verify & Register</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-richblack-700" />
              <span className="text-xs text-richblack-500 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-richblack-700" />
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <button
                className="flex items-center gap-2 text-sm font-medium text-richblack-200 hover:text-yellow-200 transition-colors"
                onClick={() => {
                  sessionStorage.removeItem(OTP_TIMER_KEY);
                  navigate('/SignUp');
                }}
              >
                <HiArrowNarrowLeft className="text-lg" />
                Back to Sign Up
              </button>
              <button
                className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-lg ${
                  decrement > 0 || loading
                    ? 'text-richblack-500 cursor-not-allowed'
                    : 'text-blue-300 hover:text-yellow-200 hover:bg-richblack-700'
                }`}
                disabled={decrement > 0 || loading}
                onClick={handleResendOtp}
              >
                <LuTimerReset className="text-lg" />
                Resend OTP
              </button>
            </div>
          </div>

          {/* Help text */}
          <p className="text-center text-xs text-richblack-500 mt-4">
            Didn't receive the code? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTP;
