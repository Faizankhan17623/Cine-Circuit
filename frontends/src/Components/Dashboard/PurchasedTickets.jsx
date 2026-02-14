import React, { useEffect, useState } from "react";
import Loader from "../extra/Loading";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PurchasedTicketsFullDetails } from "../../Services/operations/User";
import { MakePdf } from "../../Services/operations/Payment";
import { FaTicketAlt, FaDownload, FaChevronDown, FaChevronUp } from "react-icons/fa";

const formatTime12hr = (time) => {
  if (!time) return "";
  const parts = time.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] || "00";
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
};

const PurchasedTickets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCard, setExpandedCard] = useState(null);

  const postsPerPage = 5;

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await dispatch(PurchasedTicketsFullDetails(token, navigate));
        if (response?.success) {
          setTickets(response.data.data || []);
        }
      } catch (error) {
        console.log("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const getStatus = (ticket) => {
    const paymentStatus = ticket.paymentDetails?.Payment_Status;
    if (paymentStatus === "failure") return "Failed";
    if (paymentStatus === "created") return "Pending";

    const showDateStr = ticket.paymentDetails?.Showdate;
    if (!showDateStr) return "Completed";

    const parts = showDateStr.split("/");
    if (parts.length === 3) {
      const showDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      showDate.setHours(0, 0, 0, 0);

      if (showDate > today) return "Upcoming";
      if (showDate.getTime() === today.getTime()) return "Today";
    }
    return "Completed";
  };

  const filteredTickets = tickets.filter((ticket) => {
    const status = getStatus(ticket);
    if (activeTab === "All") return true;
    if (activeTab === "Upcoming") return status === "Upcoming" || status === "Today";
    if (activeTab === "Completed") return status === "Completed";
    if (activeTab === "Failed") return status === "Failed" || status === "Pending";
    return true;
  });

  const totalPages = Math.ceil(filteredTickets.length / postsPerPage);
  const paginationNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationNumbers.push(i);
  }

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const handleDownloadPdf = (paymentId) => {
    dispatch(MakePdf(paymentId, token));
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-richblack-900">
        <Loader />
      </div>
    );
  }

  // Stats
  const successTickets = tickets.filter((t) => t.paymentDetails?.Payment_Status === "success");
  const totalSpent = successTickets.reduce((sum, t) => sum + (t.paymentDetails?.amount || 0), 0);
  const totalTicketCount = successTickets.reduce(
    (sum, t) => sum + parseInt(t.paymentDetails?.totalTicketpurchased || 0),
    0
  );

  const statusConfig = {
    Upcoming: { bg: "bg-blue-500/15", text: "text-blue-400", ring: "ring-blue-500/20", dot: "bg-blue-400" },
    Today: { bg: "bg-yellow-500/15", text: "text-yellow-400", ring: "ring-yellow-500/20", dot: "bg-yellow-400" },
    Completed: { bg: "bg-green-500/15", text: "text-green-400", ring: "ring-green-500/20", dot: "bg-green-400" },
    Failed: { bg: "bg-red-500/15", text: "text-red-400", ring: "ring-red-500/20", dot: "bg-red-400" },
    Pending: { bg: "bg-orange-500/15", text: "text-orange-400", ring: "ring-orange-500/20", dot: "bg-orange-400" },
  };

  return (
    <div className="bg-richblack-900 min-h-screen text-white p-4 md:p-6">
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
          <p className="text-2xl font-bold text-yellow-400">{successTickets.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-5">
          <p className="text-xs text-blue-400/70 uppercase tracking-wider font-medium mb-1">Tickets Purchased</p>
          <p className="text-2xl font-bold text-blue-400">{totalTicketCount}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-5">
          <p className="text-xs text-green-400/70 uppercase tracking-wider font-medium mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-green-400">&#8377;{totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 mb-4 overflow-x-auto">
        {["All", "Upcoming", "Completed", "Failed"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
              setExpandedCard(null);
            }}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm whitespace-nowrap ${
              activeTab === tab
                ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ticket Cards */}
      <div className="space-y-4">
        {currentTickets.map((ticket, index) => {
          const payment = ticket.paymentDetails;
          const show = ticket.showDetails;
          const theatre = ticket.theatreDetails;
          const status = getStatus(ticket);
          const config = statusConfig[status] || statusConfig["Completed"];
          const isExpanded = expandedCard === index;
          const globalIndex = startIndex + index;

          return (
            <div
              key={globalIndex}
              className="bg-gray-900/70 rounded-xl border border-gray-800/50 overflow-hidden shadow-lg hover:border-gray-700/60 transition-all duration-200"
            >
              {/* Main Row */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 md:p-5">
                {/* Poster */}
                <div className="relative flex-shrink-0">
                  <img
                    src={show?.Posterurl}
                    alt={show?.title}
                    className="w-16 h-20 md:w-14 md:h-18 rounded-lg object-cover ring-1 ring-gray-700/50"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${config.dot}`}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white/90 truncate">{show?.title || "Unknown Movie"}</h3>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ring-1 ${config.bg} ${config.text} ${config.ring}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                    <span>{theatre?.Theatrename || "Unknown Theatre"}</span>
                    <span className="text-gray-600">|</span>
                    <span>{payment?.Showdate || "N/A"}</span>
                    <span className="text-gray-600">|</span>
                    <span>{formatTime12hr(payment?.time)}</span>
                  </div>
                </div>

                {/* Right Side Info */}
                <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Tickets</p>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {payment?.totalTicketpurchased || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Amount</p>
                    <p className="text-sm font-bold text-yellow-400 mt-0.5">
                      &#8377;{(payment?.amount || 0).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {payment?.Payment_Status === "success" && (
                      <button
                        onClick={() => handleDownloadPdf(payment?._id)}
                        className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                        title="Download Ticket PDF"
                      >
                        <FaDownload size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedCard(isExpanded ? null : index)}
                      className="p-2 rounded-lg bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                      title="View Details"
                    >
                      {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-800/50 bg-gray-800/30 px-5 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left - Ticket Categories */}
                    <div>
                      <h4 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">
                        Ticket Categories
                      </h4>
                      <div className="space-y-2">
                        {payment?.ticketCategorey?.map((cat, catIndex) => (
                          <div
                            key={catIndex}
                            className="flex justify-between items-center bg-gray-900/60 rounded-lg px-3 py-2.5 border border-gray-700/30"
                          >
                            <div>
                              <p className="text-sm font-medium text-white/80">{cat.category || cat.categoryName}</p>
                              <p className="text-[11px] text-gray-500">
                                {cat.quantity || cat.ticketsPurchased} x &#8377;{cat.price}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-yellow-400">
                              &#8377;{(parseInt(cat.quantity || cat.ticketsPurchased) * parseInt(cat.price)).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right - Payment & Show Info */}
                    <div>
                      <h4 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">
                        Booking Details
                      </h4>
                      <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Theatre</span>
                          <span className="text-white/80 font-medium">{theatre?.Theatrename}</span>
                        </div>
                        {theatre?.locationName && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Location</span>
                            <span className="text-white/80">{theatre.locationName}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Show Date</span>
                          <span className="text-white/80">{payment?.Showdate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Show Time</span>
                          <span className="text-white/80">{formatTime12hr(payment?.time)}</span>
                        </div>
                        {payment?.purchaseDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Purchased On</span>
                            <span className="text-white/80">{payment.purchaseDate}</span>
                          </div>
                        )}
                        {payment?.paymentMethod && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Payment Method</span>
                            <span className="text-white/80 capitalize">{payment.paymentMethod}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Status</span>
                          <span className={`font-medium capitalize ${
                            payment?.Payment_Status === "success"
                              ? "text-green-400"
                              : payment?.Payment_Status === "failure"
                              ? "text-red-400"
                              : "text-orange-400"
                          }`}>
                            {payment?.Payment_Status}
                          </span>
                        </div>
                        <hr className="border-gray-700/50" />
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-300">Total Amount</span>
                          <span className="text-yellow-400 text-base">
                            &#8377;{(payment?.amount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {currentTickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-900/40 rounded-xl border border-gray-800/50">
            <FaTicketAlt className="text-4xl text-gray-600 mb-3" />
            <p className="text-sm font-medium">No tickets found</p>
            <p className="text-xs text-gray-600 mt-1">
              {activeTab === "All"
                ? "You haven't purchased any tickets yet"
                : `No ${activeTab.toLowerCase()} tickets`}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredTickets.length > postsPerPage && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="text-gray-300 font-medium">{startIndex + 1}</span> -{" "}
            <span className="text-gray-300 font-medium">
              {Math.min(endIndex, filteredTickets.length)}
            </span>{" "}
            of{" "}
            <span className="text-gray-300 font-medium">{filteredTickets.length}</span> tickets
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
              onClick={() =>
                setCurrentPage((p) => Math.min(paginationNumbers.length, p + 1))
              }
              disabled={currentPage === paginationNumbers.length}
              className="px-3 py-1.5 rounded-lg text-sm bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasedTickets;
