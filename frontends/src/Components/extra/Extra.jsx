import { Link } from 'react-router-dom'
import Navbar from '../Home/Navbar'

function Extra() {
  return (
    <div className="min-h-screen bg-richblack-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center items-center px-6 animate-fadeIn">
        <h1 className="text-[120px] md:text-[160px] font-extrabold leading-none bg-gradient-to-b from-yellow-50 via-yellow-200 to-yellow-500 bg-clip-text text-transparent select-none">
          404
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full my-6" />
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center">Page Not Found</h2>
        <p className="text-richblack-300 text-center max-w-md mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="px-6 py-2.5 bg-yellow-50 text-richblack-900 font-semibold rounded-lg hover:brightness-110 transition-all duration-200 shadow-md"
          >
            Go Home
          </Link>
          <Link
            to="/Contact"
            className="px-6 py-2.5 border border-richblack-600 text-richblack-200 font-medium rounded-lg hover:border-richblack-400 hover:text-white transition-all duration-200"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Extra;
