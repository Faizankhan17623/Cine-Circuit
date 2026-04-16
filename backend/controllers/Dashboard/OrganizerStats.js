const USER = require('../../models/user')
const CreateShow = require('../../models/CreateShow')
const ticket = require('../../models/ticket')

// GET /Organizer-Stats
// Returns organizer dashboard summary — show counts, ticket counts, allotment summary
exports.GetOrganizerStats = async (req, res) => {
    try {
        const userId = req.USER.id
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID required' })
        }

        const user = await USER.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const showIds = user.showsCreated || []

        // Get all shows created by this organizer
        const shows = showIds.length > 0
            ? await CreateShow.find({ _id: { $in: showIds } }).select('title VerifiedByTheAdmin uploaded movieStatus releasedate')
            : []

        const totalShows = shows.length
        const verifiedShows = shows.filter(s => s.VerifiedByTheAdmin === true).length
        const uploadedShows = shows.filter(s => s.uploaded === true).length
        const upcomingShows = shows.filter(s => s.movieStatus === 'Upcoming').length
        const releasedShows = shows.filter(s => s.movieStatus === 'Released').length

        // Get all tickets created by this organizer
        const ticketIds = user.ticketCreated || []
        const tickets = ticketIds.length > 0
            ? await ticket.find({ _id: { $in: ticketIds } })
            : []

        const totalTickets = tickets.length
        const totalTheatresAllotted = tickets.reduce((sum, t) => sum + (t.allotedToTheatres?.length || 0), 0)
        const totalTicketsCreated = tickets.reduce((sum, t) => sum + (Number(t.overallTicketCreated) || 0), 0)
        const totalTicketsRemaining = tickets.reduce((sum, t) => sum + (Number(t.TicketsRemaining) || 0), 0)

        return res.status(200).json({
            success: true,
            message: 'Organizer stats fetched',
            data: {
                shows: {
                    total: totalShows,
                    verified: verifiedShows,
                    uploaded: uploadedShows,
                    upcoming: upcomingShows,
                    released: releasedShows,
                    recentShows: shows.slice(-5).reverse(), // last 5 shows
                },
                tickets: {
                    totalTicketBatches: totalTickets,
                    totalTheatresAllotted,
                    totalTicketsCreated,
                    totalTicketsRemaining,
                    ticketsSold: totalTicketsCreated - totalTicketsRemaining,
                },
            },
        })
    } catch (error) {
        console.log('Error in GetOrganizerStats:', error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}
