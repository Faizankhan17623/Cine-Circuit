const USER = require('../../models/user')
const CreateShow = require('../../models/CreateShow')
const BugReport = require('../../models/BugReport')
const TheatreRequest = require('../../models/TheatrerRequest')
const Visitor = require('../../models/Visitor')
const Payment = require('../../models/payment')

// GET /Admin-Stats
// Returns all key counts in a single call for the admin dashboard home
exports.GetAdminStats = async (req, res) => {
    try {
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)

        const [
            totalViewers,
            totalOrganizers,
            verifiedOrganizers,
            totalTheatrers,
            verifiedTheatrers,
            pendingOrgRequests,
            pendingTheatreRequests,
            totalShows,
            verifiedShows,
            unverifiedShows,
            bugOpen,
            bugInProgress,
            bugResolved,
            totalUniqueVisitors,
            visitorsToday,
            newVisitorsToday,
            totalVisitsAgg,
        ] = await Promise.all([
            USER.countDocuments({ usertype: 'Viewer' }),
            USER.countDocuments({ usertype: 'Organizer' }),
            USER.countDocuments({ usertype: 'Organizer', verified: true }),
            USER.countDocuments({ usertype: 'Theatrer' }),
            USER.countDocuments({ usertype: 'Theatrer', verified: true }),
            USER.countDocuments({ usertype: 'Organizer', verified: false }),
            TheatreRequest.countDocuments({}),
            CreateShow.countDocuments({}),
            CreateShow.countDocuments({ VerifiedByTheAdmin: true }),
            CreateShow.countDocuments({ VerifiedByTheAdmin: false }),
            BugReport.countDocuments({ status: 'open' }),
            BugReport.countDocuments({ status: 'in-progress' }),
            BugReport.countDocuments({ status: 'resolved' }),
            Visitor.countDocuments({}),
            Visitor.countDocuments({ lastVisited: { $gte: startOfToday } }),
            Visitor.countDocuments({ createdAt: { $gte: startOfToday } }),
            Visitor.aggregate([{ $group: { _id: null, total: { $sum: '$visitCount' } } }]),
        ])

        return res.status(200).json({
            success: true,
            message: 'Admin stats fetched',
            data: {
                users: {
                    totalViewers,
                    totalOrganizers,
                    verifiedOrganizers,
                    pendingOrgRequests,
                    totalTheatrers,
                    verifiedTheatrers,
                    pendingTheatreRequests,
                },
                shows: {
                    total: totalShows,
                    verified: verifiedShows,
                    unverified: unverifiedShows,
                },
                bugs: {
                    open: bugOpen,
                    inProgress: bugInProgress,
                    resolved: bugResolved,
                    total: bugOpen + bugInProgress + bugResolved,
                },
                visitors: {
                    totalUnique: totalUniqueVisitors,
                    totalVisits: totalVisitsAgg[0]?.total || 0,
                    visitorsToday,
                    newVisitorsToday,
                },
            },
        })
    } catch (error) {
        console.log('Error in GetAdminStats:', error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

// GET /Visitor-Stats — admin only
// Returns paginated visitor list + summary numbers
exports.GetVisitorStats = async (req, res) => {
    try {
        const page  = parseInt(req.query.page)  || 1
        const limit = parseInt(req.query.limit) || 20
        const skip  = (page - 1) * limit

        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)

        const startOf7Days = new Date()
        startOf7Days.setDate(startOf7Days.getDate() - 6)
        startOf7Days.setHours(0, 0, 0, 0)

        const startOf30Days = new Date()
        startOf30Days.setDate(startOf30Days.getDate() - 29)
        startOf30Days.setHours(0, 0, 0, 0)

        const [
            totalUniqueVisitors,
            visitorsToday,
            visitors7Days,
            visitors30Days,
            newVisitorsToday,
            totalVisitsAgg,
            topVisitors,
            totalForPagination,
        ] = await Promise.all([
            Visitor.countDocuments({}),
            Visitor.countDocuments({ lastVisited: { $gte: startOfToday } }),
            Visitor.countDocuments({ lastVisited: { $gte: startOf7Days } }),
            Visitor.countDocuments({ lastVisited: { $gte: startOf30Days } }),
            Visitor.countDocuments({ createdAt: { $gte: startOfToday } }),
            Visitor.aggregate([{ $group: { _id: null, total: { $sum: '$visitCount' } } }]),
            Visitor.find({})
                .sort({ visitCount: -1 })
                .skip(skip)
                .limit(limit)
                .select('ip visitCount lastVisited createdAt'),
            Visitor.countDocuments({}),
        ])

        return res.status(200).json({
            success: true,
            message: 'Visitor stats fetched',
            data: {
                summary: {
                    totalUnique: totalUniqueVisitors,
                    totalVisits: totalVisitsAgg[0]?.total || 0,
                    visitorsToday,
                    newVisitorsToday,
                    visitors7Days,
                    visitors30Days,
                },
                visitors: topVisitors,
                pagination: {
                    total: totalForPagination,
                    page,
                    limit,
                    totalPages: Math.ceil(totalForPagination / limit),
                    hasNextPage: page < Math.ceil(totalForPagination / limit),
                    hasPrevPage: page > 1,
                },
            },
        })
    } catch (error) {
        console.log('Error in GetVisitorStats:', error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

// GET /Public-Stats — no auth required, used on public homepage
exports.GetPublicStats = async (req, res) => {
    try {
        const [totalVisits, totalUsers, totalShows, totalTickets] = await Promise.all([
            Visitor.aggregate([{ $group: { _id: null, total: { $sum: '$visitCount' } } }]),
            USER.countDocuments({}),
            CreateShow.countDocuments({ VerifiedByTheAdmin: true }),
            Payment.countDocuments({}),
        ])

        return res.status(200).json({
            success: true,
            data: {
                totalVisits: totalVisits[0]?.total || 0,
                totalUsers,
                totalShows,
                totalTickets,
            },
        })
    } catch (error) {
        console.log('Error in GetPublicStats:', error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}
