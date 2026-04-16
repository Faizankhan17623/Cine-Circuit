const USER = require('../../models/user')
const CreateShow = require('../../models/CreateShow')
const BugReport = require('../../models/BugReport')
const TheatreRequest = require('../../models/TheatrerRequest')

// GET /Admin-Stats
// Returns all key counts in a single call for the admin dashboard home
exports.GetAdminStats = async (req, res) => {
    try {
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
            },
        })
    } catch (error) {
        console.log('Error in GetAdminStats:', error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}
