const Theatrestickets = require('../../models/TheatresTicket')

// Deterministic seat layout for a category: seats are labelled RowLetter+Number,
// e.g. A1, A2 ... based on seatsPerRow. Row letters cycle A-Z then AA, AB, ...
const rowLabel = (rowIndex) => {
    let label = ''
    let n = rowIndex
    do {
        label = String.fromCharCode(65 + (n % 26)) + label
        n = Math.floor(n / 26) - 1
    } while (n >= 0)
    return label
}

const generateSeatLabels = (totalSeats, seatsPerRow) => {
    const perRow = seatsPerRow > 0 ? seatsPerRow : 10
    const labels = []
    for (let i = 0; i < totalSeats; i++) {
        const row = Math.floor(i / perRow)
        const col = (i % perRow) + 1
        labels.push(`${rowLabel(row)}${col}`)
    }
    return labels
}

exports.generateSeatLabels = generateSeatLabels

// GET /Payment/Seat-Map?ticketId=&time=
// Returns, per category, the full seat layout and which seats are already booked for that showtime.
exports.GetSeatMap = async (req, res) => {
    try {
        const { ticketId, time } = req.query

        if (!ticketId || !time) {
            return res.status(400).json({
                message: "ticketId and time are required",
                success: false
            })
        }

        const ticketDoc = await Theatrestickets.findById(ticketId)
        if (!ticketDoc) {
            return res.status(404).json({
                message: "Ticket not found",
                success: false
            })
        }

        if (!ticketDoc.timings.includes(time)) {
            return res.status(400).json({
                message: "Selected time is not available for this ticket",
                success: false
            })
        }

        const categories = ticketDoc.ticketsCategory.map((cat) => {
            const totalSeats = Number(cat.ticketsCreated) || 0
            const seatLabels = generateSeatLabels(totalSeats, cat.seatsPerRow)

            const bookedEntry = ticketDoc.bookedSeats.find(
                (b) => b.time === time && b.category === cat.category
            )
            const bookedSeats = bookedEntry ? bookedEntry.seats : []

            return {
                categoryId: cat._id,
                category: cat.category,
                price: cat.price,
                seatsPerRow: cat.seatsPerRow || 10,
                seats: seatLabels,
                bookedSeats,
                available: seatLabels.length - bookedSeats.length
            }
        })

        return res.status(200).json({
            message: "Seat map fetched successfully",
            success: true,
            data: categories
        })
    } catch (error) {
        console.error("Error in GetSeatMap:", error)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}
