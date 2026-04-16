const USER = require('../../models/user')
const CreateShow = require('../../models/CreateShow')
const ticket = require('../../models/ticket')
const Payment = require('../../models/payment')
const Theatres = require('../../models/Theatres')
const TheatresTicket = require('../../models/TheatresTicket')

// GET /Organizer-Ticket-Report
// Full ticket analytics for organizer:
// - Per-show ticket batch: created, remaining, sold, allotted theatres
// - Per-show sales report: revenue, purchase count, daily breakdown
// - Theatre allotment breakdown
exports.GetOrganizerTicketReport = async (req, res) => {
    try {
        const userId = req.USER.id
        if (!userId) return res.status(400).json({ success: false, message: 'User ID required' })

        const user = await USER.findById(userId)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        const ticketIds = user.ticketCreated || []
        const showIds = user.showsCreated || []

        if (ticketIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No tickets created yet',
                data: { ticketBatches: [], salesReport: [], theatreAllotments: [], totals: { totalCreated: 0, totalRemaining: 0, totalSold: 0, totalRevenue: 0 } }
            })
        }

        // Fetch all ticket batches created by this organizer
        const tickets = await ticket.find({ _id: { $in: ticketIds } })

        // Fetch all shows for name lookup
        const shows = showIds.length > 0
            ? await CreateShow.find({ _id: { $in: showIds } }).select('title releasedate movieStatus VerifiedByTheAdmin Posterurl')
            : []
        const showMap = {}
        shows.forEach(s => { showMap[s._id.toString()] = s })

        // Fetch all payments for organizer's shows (only successful ones)
        const showIdStrings = showIds.map(id => id.toString())
        const payments = showIdStrings.length > 0
            ? await Payment.find({ showid: { $in: showIdStrings }, Payment_Status: 'success' })
            : []

        // Build per-show payment map
        const paymentByShow = {}
        payments.forEach(p => {
            const sid = p.showid
            if (!paymentByShow[sid]) paymentByShow[sid] = []
            paymentByShow[sid].push(p)
        })

        // Build ticket batch report per show
        const ticketBatches = await Promise.all(tickets.map(async (t) => {
            const showId = t.showid?.toString()
            const show = showMap[showId] || null
            const showPayments = paymentByShow[showId] || []

            const totalCreated = Number(t.overallTicketCreated) || 0
            const remaining = Number(t.TicketsRemaining) || 0
            const sold = totalCreated - remaining

            const totalRevenue = showPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
            const totalPurchaseCount = showPayments.length

            // Daily sales breakdown
            const dailySales = {}
            showPayments.forEach(p => {
                const day = p.purchaseDate || p.paymentDate || (p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'Unknown')
                if (!dailySales[day]) dailySales[day] = { date: day, tickets: 0, revenue: 0, purchases: 0 }
                dailySales[day].tickets += Number(p.totalTicketpurchased) || 0
                dailySales[day].revenue += Number(p.amount) || 0
                dailySales[day].purchases += 1
            })

            // Show time + date breakdown from payments
            const timingBreakdown = {}
            showPayments.forEach(p => {
                const key = `${p.Showdate || 'Unknown date'} | ${p.time || 'Unknown time'}`
                if (!timingBreakdown[key]) timingBreakdown[key] = { date: p.Showdate || 'Unknown', time: p.time || 'Unknown', tickets: 0, revenue: 0 }
                timingBreakdown[key].tickets += Number(p.totalTicketpurchased) || 0
                timingBreakdown[key].revenue += Number(p.amount) || 0
            })

            // Theatre allotment for this ticket batch
            const theatreAllotments = []
            if (t.allotedToTheatres && t.allotedToTheatres.length > 0) {
                const theatreData = await Theatres.find({ _id: { $in: t.allotedToTheatres } }).select('Theatrename locationName')
                t.allotedToTheatres.forEach((theatreId, index) => {
                    const theatre = theatreData.find(th => th._id.toString() === theatreId.toString())
                    theatreAllotments.push({
                        theatreId: theatreId,
                        theatreName: theatre?.Theatrename || 'Unknown Theatre',
                        location: theatre?.locationName || '',
                        ticketsAlloted: Number(t.totalTicketsAlloted?.[index]) || 0,
                        allotedAt: t.timeofAllotmentofTicket || null
                    })
                })
            }

            return {
                ticketId: t._id,
                showId,
                showTitle: show?.title || 'Unknown Show',
                showStatus: show?.movieStatus || 'Unknown',
                releaseDate: show?.releasedate || null,
                verified: show?.VerifiedByTheAdmin || false,
                posterUrl: show?.Posterurl || null,
                ticketType: t.typeofticket || 'Standard',
                showType: t.showtype || 'Theatre',
                pricePerTicket: Number(t.priceoftheticket) || 0,
                totalCreated,
                remaining,
                sold,
                totalTheatresAlloted: t.allotedToTheatres?.length || 0,
                createdAt: t.TicketCreationTime || null,
                allotedAt: t.timeofAllotmentofTicket || null,
                revenue: totalRevenue,
                purchaseCount: totalPurchaseCount,
                dailySales: Object.values(dailySales).sort((a, b) => (a.date > b.date ? -1 : 1)),
                timingBreakdown: Object.values(timingBreakdown),
                theatreAllotments
            }
        }))

        // Overall totals
        const totals = ticketBatches.reduce((acc, tb) => ({
            totalCreated: acc.totalCreated + tb.totalCreated,
            totalRemaining: acc.totalRemaining + tb.remaining,
            totalSold: acc.totalSold + tb.sold,
            totalRevenue: acc.totalRevenue + tb.revenue,
            totalPurchases: acc.totalPurchases + tb.purchaseCount
        }), { totalCreated: 0, totalRemaining: 0, totalSold: 0, totalRevenue: 0, totalPurchases: 0 })

        // Overall daily sales across all shows
        const overallDailySales = {}
        payments.forEach(p => {
            const day = p.purchaseDate || p.paymentDate || (p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'Unknown')
            if (!overallDailySales[day]) overallDailySales[day] = { date: day, tickets: 0, revenue: 0, purchases: 0 }
            overallDailySales[day].tickets += Number(p.totalTicketpurchased) || 0
            overallDailySales[day].revenue += Number(p.amount) || 0
            overallDailySales[day].purchases += 1
        })

        return res.status(200).json({
            success: true,
            message: 'Organizer ticket report fetched',
            data: {
                ticketBatches,
                totals,
                overallDailySales: Object.values(overallDailySales).sort((a, b) => (a.date > b.date ? -1 : 1))
            }
        })

    } catch (error) {
        console.log('Error in GetOrganizerTicketReport:', error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}
