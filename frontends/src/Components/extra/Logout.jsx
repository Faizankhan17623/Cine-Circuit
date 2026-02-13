import { IoWarningOutline } from "react-icons/io5"
import IconBtn from "./IconBtn"

const Logout = ({ modalData }) => {
  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/60 backdrop-blur-sm">
      
      {/* Modal */}
      <div className="w-[90%] max-w-[380px] rounded-xl bg-richblack-800 border border-richblack-600 shadow-2xl animate-scaleIn">
        
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-richblack-600">
          <div className="p-2 rounded-full bg-red-500/20">
            <IoWarningOutline className="text-2xl text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-richblack-5">
            {modalData?.text1}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-richblack-200 text-sm leading-relaxed">
            {modalData?.text2}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-richblack-600">
          
          {/* Cancel */}
          <button
            onClick={modalData?.btn2Handler}
            className="px-4 py-2 rounded-md bg-richblack-700 text-richblack-200 hover:bg-richblack-600 transition"
          >
            {modalData?.btn2Text}
          </button>

          {/* Logout (Danger) */}
          <button
            onClick={modalData?.btn1Handler}
            className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            {modalData?.btn1Text}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Logout