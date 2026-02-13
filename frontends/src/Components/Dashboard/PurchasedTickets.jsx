import React, { useState } from "react";
import Loader from "../extra/Loading";
import { useSelector } from "react-redux";
import Movies from "../../data/movies_data.json";

const PurchasedTickets = () => {
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoggedIn, image } = useSelector((state) => state.auth);

  const postsPerPage = 5;
  const paginationNumbers = [];

  // Filtering logic for tabs
  const filteredMovies = Movies.filter((movie) => {
    // console.log(movie)
    if (activeTab === "All") return true;
    if (activeTab === "Upcoming") return movie.progress
    if (activeTab === "Completed") return movie.progress === 100;
    return true;
  });

  for (let i = 1; i <= Math.ceil(Movies.length / postsPerPage); i++) {
    paginationNumbers.push(i);
  }

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentMovies = Movies.slice(startIndex, endIndex);

  // Date helpers
  function parseDate(str) {
    const [day, month, year] = str.split("-");
    return new Date(`20${year}`, month - 1, day);
  }

  function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // Stats
  const totalSpent = Movies.reduce((sum, m) => sum + m.total_tickets_purchased * m.price, 0);
  const totalTickets = Movies.reduce((sum, m) => sum + m.total_tickets_purchased, 0);

  return (
    <div className="bg-richblack-900 min-h-screen text-white p-4 md:p-6 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-1">
        Home <span className="text-gray-600 mx-1">/</span> Dashboard{" "}
        <span className="text-gray-600 mx-1">/</span>{" "}
        <span className="text-yellow-400">Purchased Tickets</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold mb-4">Purchased Tickets</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-5">
          <p className="text-xs text-yellow-400/70 uppercase tracking-wider font-medium mb-1">Total Bookings</p>
          <p className="text-2xl font-bold text-yellow-400">{Movies.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-5">
          <p className="text-xs text-blue-400/70 uppercase tracking-wider font-medium mb-1">Tickets Purchased</p>
          <p className="text-2xl font-bold text-blue-400">{totalTickets}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-5">
          <p className="text-xs text-green-400/70 uppercase tracking-wider font-medium mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-green-400">&#8377;{totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        {["All", "Upcoming", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
              activeTab === tab
                ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900/70 rounded-xl overflow-hidden shadow-2xl border border-gray-800/50 backdrop-blur-sm">
        {/* Table Header */}
        <div className="grid grid-cols-5 px-5 py-3.5 text-gray-400 text-xs border-b border-gray-700/50 bg-gray-800/60 font-semibold uppercase tracking-wider">
          <span>Movie Name</span>
          <span>Show Date</span>
          <span className="text-center">Tickets</span>
          <span className="text-center">Price</span>
          <span className="text-center">Status</span>
        </div>

        {/* Table Rows */}
        {currentMovies.map((movie,index) => {
          const price = movie.total_tickets_purchased * movie.price;

          const today = new Date();
          const showDate = parseDate(movie.show_date);
          const todayDate = stripTime(today);
          const showDateOnly = stripTime(showDate);

          let status = "Upcoming";
          if (showDateOnly < todayDate) {
            status = "Expired";
          } else if (showDateOnly.getTime() === todayDate.getTime()) {
            status = "Released";
          }

          return (
            <div
              key={index}
              className="grid grid-cols-5 items-center px-5 py-3.5 border-b border-gray-800/40 hover:bg-gray-800/40 transition-all duration-200 relative group"
            >
              {/* Movie Info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={image}
                    alt={movie.movie_name}
                    className="w-11 h-11 rounded-lg object-cover ring-1 ring-gray-700/50"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900"
                    style={{
                      backgroundColor: status === "Upcoming" ? "#3b82f6" : status === "Released" ? "#22c55e" : "#ef4444"
                    }}
                  />
                </div>
                <div>
                  <span className="font-medium text-sm text-white/90">{movie.movie_name}</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">#{movie.index}</p>
                </div>
              </div>

              {/* Show Date */}
              <div>
                <span className="text-gray-300 text-sm">{movie.show_date}</span>
                <p className="text-[11px] text-gray-500 mt-0.5">{movie.show_time}</p>
              </div>

              {/* Tickets */}
              <div className="text-center">
                <span className="inline-flex items-center justify-center bg-gray-800/80 text-gray-200 text-sm font-semibold w-8 h-8 rounded-lg">
                  {movie.total_tickets_purchased}
                </span>
              </div>

              {/* Price */}
              <div className="text-center">
                <span className="text-white font-semibold text-sm">&#8377;{price.toLocaleString()}</span>
                <p className="text-[11px] text-gray-500 mt-0.5">&#8377;{movie.price}/ticket</p>
              </div>

              {/* Status + Menu */}
              <div className="flex justify-center items-center gap-2 relative">
                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 ${
                    status === "Upcoming"
                      ? "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20"
                      : status === "Released"
                      ? "bg-green-500/15 text-green-400 ring-1 ring-green-500/20"
                      : "bg-red-500/15 text-red-400 ring-1 ring-red-500/20"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    status === "Upcoming" ? "bg-blue-400" : status === "Released" ? "bg-green-400" : "bg-red-400"
                  }`} />
                  {status}
                </span>

                {/* Menu */}
                <button
                  onClick={() =>
                    setMenuOpen(menuOpen === index ? null : index)
                  }
                  className="hover:bg-gray-700/60 p-1.5 rounded-lg text-lg text-gray-500 hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                >
                  &#8942;
                </button>

                {menuOpen === index && (
                  <div className="absolute right-0 top-10 w-44 bg-gray-800 rounded-xl shadow-xl shadow-black/40 z-50 border border-gray-700/50 overflow-hidden animate-scaleIn">
                    <button className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-700/60 text-gray-200 transition-colors">
                      View Full Details
                    </button>
                    <div className="border-t border-gray-700/50" />
                    <button className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {currentMovies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <svg className="w-12 h-12 mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <p className="text-sm font-medium">No tickets found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-5">
        <p className="text-sm text-gray-500">
          Showing <span className="text-gray-300 font-medium">{startIndex + 1}</span> - <span className="text-gray-300 font-medium">{Math.min(endIndex, Movies.length)}</span> of <span className="text-gray-300 font-medium">{Movies.length}</span> tickets
        </p>
        <div className="flex gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-sm bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {paginationNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === num
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                  : "bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(paginationNumbers.length, p + 1))}
            disabled={currentPage === paginationNumbers.length}
            className="px-3 py-1.5 rounded-lg text-sm bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasedTickets;
