import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "../extra/Loading";
import { IoIosArrowBack } from "react-icons/io";
import Profesion from "../../data/Professsion.json";
import CountryCodee from "../../data/CountryCode.json";
import { MdDelete } from "react-icons/md";
import { Changeimage } from "../../Services/operations/User";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LiaEyeSolid,LiaEyeSlashSolid  } from "react-icons/lia";

const Settings = () => {
  const { image, token } = useSelector((state) => state.auth);
  const { cooldownDate } = useSelector((state) => state.profile);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch("newPassword");
  const currentPassword = watch("currentPassword")

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(handler);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await dispatch(Changeimage(token, selectedFile,navigate));
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  const isCooldownActive =
    cooldownDate && new Date(cooldownDate) > new Date();
  const timeLeft = isCooldownActive
    ? Math.ceil((new Date(cooldownDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    // send to backend
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full min-h-full bg-richblack-900 flex flex-col items-center gap-6 px-4 sm:px-6 py-8 overflow-y-auto"
    >
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-richblack-300 hover:text-white transition-colors w-fit"
        >
          <IoIosArrowBack className="text-lg" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Profile</h1>
      </div>

      {/* Cooldown Warning */}
      {isCooldownActive && (
        <div className="w-full max-w-3xl bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3.5 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <p className="text-red-400 text-sm">
            You can change your image again in <span className="font-semibold text-red-300">{timeLeft} day(s)</span>.
          </p>
        </div>
      )}

      {/* Profile Picture */}
      <div className="w-full max-w-3xl bg-richblack-800 border border-richblack-700 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={
            selectedFile
              ? URL.createObjectURL(selectedFile)
              : image || "/default-profile.png"
          }
          alt="profile"
          className="w-20 h-20 rounded-full object-cover border-[3px] border-richblack-600 shadow-lg shrink-0"
        />
        <div className="flex flex-col gap-3 items-center sm:items-start">
          <p className="text-white text-base font-medium">Change Profile Picture</p>
          <div className="flex gap-3">
            {selectedFile ? (
              <button
                type="button"
                className="bg-yellow-50 hover:bg-yellow-100 text-richblack-900 font-semibold rounded-lg px-5 py-2 text-sm transition-all duration-200 shadow-md shadow-yellow-50/10"
                onClick={handleUpload}
                disabled={isCooldownActive}
              >
                Upload
              </button>
            ) : (
              <label className={`bg-yellow-50 hover:bg-yellow-100 text-richblack-900 font-semibold rounded-lg px-5 py-2 text-sm transition-all duration-200 shadow-md shadow-yellow-50/10 cursor-pointer ${isCooldownActive ? "opacity-50 cursor-not-allowed" : ""}`}>
                Select
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={isCooldownActive}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setSelectedFile(file);
                  }}
                />
              </label>
            )}
            <button
              type="button"
              className={`bg-richblack-700 border border-richblack-600 text-richblack-100 hover:text-white hover:border-richblack-500 rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 ${
                !selectedFile ? "opacity-40 cursor-not-allowed" : ""
              }`}
              onClick={() => setSelectedFile(null)}
              disabled={!selectedFile || isCooldownActive}
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="w-full max-w-3xl bg-richblack-800 border border-richblack-700 rounded-xl p-6 flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-yellow-100">Profile Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Display Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-richblack-100 font-medium">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("displayName", { required: "Display Name is required" })}
              className="w-full px-4 py-2.5 bg-richblack-700 border border-richblack-600 rounded-lg text-white text-sm placeholder:text-richblack-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50"
              placeholder="Enter your name"
            />
            {errors.displayName && (
              <p className="text-red-400 text-xs">{errors.displayName.message}</p>
            )}
          </div>

          {/* Profession */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-richblack-100 font-medium">
              Profession <span className="text-red-500">*</span>
            </label>
            <select
              {...register("profession", { required: "Profession is required" })}
              className="w-full px-4 py-2.5 bg-richblack-700 border border-richblack-600 rounded-lg text-white text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 cursor-pointer"
            >
              <option value="">Select your profession</option>
              {Profesion.professions.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
            {errors.profession && (
              <p className="text-red-400 text-xs">{errors.profession.message}</p>
            )}
          </div>
        </div>

        {/* DOB + Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-richblack-100 font-medium">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("dob", { required: "Date of Birth is required" })}
              className="w-full px-4 py-2.5 bg-richblack-700 border border-richblack-600 rounded-lg text-white text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50"
            />
            {errors.dob && (
              <p className="text-red-400 text-xs">{errors.dob.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-richblack-100 font-medium">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-5 h-[42px] items-center">
              {["Male", "Female", "Other"].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value={g}
                    {...register("gender", { required: "Gender is required" })}
                    className="accent-yellow-200 w-4 h-4"
                  />
                  <span className="text-sm text-richblack-200 group-hover:text-white transition-colors">{g}</span>
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="text-red-400 text-xs">{errors.gender.message}</p>
            )}
          </div>
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-richblack-100 font-medium">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <select
              {...register("countryCode", { required: "Code is required" })}
              className="w-[160px] sm:w-[200px] px-3 py-2.5 bg-richblack-700 border border-richblack-600 rounded-lg text-white text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50 cursor-pointer shrink-0"
              defaultValue=""
            >
              <option value="" disabled>Select Country</option>
              {CountryCodee.map((c, i) => (
                <option key={i} value={c.code}>{c.country}-{c.code}</option>
              ))}
            </select>
            <input
              type="tel"
              maxLength={10}
              {...register("mobileNumber", { required: "Number is required" })}
              className="flex-1 px-4 py-2.5 bg-richblack-700 border border-richblack-600 rounded-lg text-white text-sm placeholder:text-richblack-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50"
              placeholder="Enter number"
            />
          </div>
          {(errors.countryCode || errors.mobileNumber) && (
            <p className="text-red-400 text-xs">
              {errors.countryCode?.message || errors.mobileNumber?.message}
            </p>
          )}
        </div>
      </div>

      {/* Password Section */}
      <div className="w-full max-w-3xl bg-richblack-800 border border-richblack-700 rounded-xl p-6 flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-yellow-100">Password</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-richblack-100 font-medium">Current Password</label>
            <input
              type="password"
              {...register("currentPassword", {
                required: "New password is required",
                 minLength: { value: 6, message: "Password must be at least 6 character" },
                maxLength: { value: 10, message: "Password must be at most 10 characters" },
              })}
              className="w-full px-4 py-2.5 bg-richblack-700 border border-richblack-600 rounded-lg text-white text-sm placeholder:text-richblack-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50"
              placeholder="Enter current password"
            />
            {errors.currentPassword && (
              <p className="text-red-400 text-xs">{errors.currentPassword.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-richblack-100 font-medium">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Password must be at least 6 character" },
                maxLength: { value: 10, message: "Password must be at most 10 characters" },
              })}
              className="w-full px-4 py-2.5 bg-richblack-700 border border-richblack-600 rounded-lg text-white text-sm placeholder:text-richblack-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-yellow-200/50 focus:border-yellow-200/50"
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="text-red-400 text-xs">{errors.newPassword.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="w-full max-w-3xl bg-pink-900/20 border border-pink-800/30 rounded-xl p-6 flex gap-5">
        <div className="w-12 h-12 rounded-xl bg-pink-500/15 flex items-center justify-center shrink-0">
          <MdDelete className="text-pink-400 text-2xl" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-white text-base font-semibold">Delete Account</h3>
          <p className="text-richblack-300 text-sm leading-relaxed">
            Would you like to delete your account? This account contains paid courses. Deleting your account will remove all associated content permanently.
          </p>
          <Link
            to="/"
            className="text-pink-300 hover:text-pink-200 text-sm font-medium underline underline-offset-2 transition-colors w-fit mt-1"
          >
            I want to delete my account.
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-3xl flex justify-end gap-3 pt-2 pb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-richblack-700 border border-richblack-600 text-richblack-100 hover:text-white hover:border-richblack-500 rounded-lg px-6 py-2.5 text-sm font-medium transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-gradient-to-r from-yellow-200 to-yellow-50 text-richblack-900 font-bold rounded-lg px-6 py-2.5 text-sm transition-all duration-200 shadow-lg shadow-yellow-200/10 hover:shadow-yellow-200/20 hover:shadow-xl active:scale-[0.98]"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default Settings;
