const CreateShow = require('../../models/CreateShow')
const Theatre = require('../../models/Theatres')
const Theatrestickets = require('../../models/TheatresTicket')
const genre = require('../../models/genre')
const language = require('../../models/CreateLanguage')

/**
 * GET /Public-Genres-Languages
 * Returns all genres and languages for filter dropdowns (public, no auth)
 */
exports.GetGenresAndLanguages = async (req, res) => {
    try {
        const [genres, languages] = await Promise.all([
            genre.find({}, 'genreName _id').sort('genreName'),
            language.find({}, 'name _id').sort('name'),
        ])
        return res.status(200).json({
            success: true,
            data: { genres, languages }
        })
    } catch (error) {
        console.log('GetGenresAndLanguages error:', error)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

/**
 * POST /Enhanced-Finder
 * Flexible show search — all fields optional except date.
 * Supports: location (city), movieName, theatreName, date (required),
 *           genreId, languageId, maxPrice
 */
exports.EnhancedFinder = async (req, res) => {
    try {
        const { location, movieName, theatreName, date, genreId, languageId, maxPrice } = req.body

        if (!date) {
            return res.status(400).json({ success: false, message: 'Date is required' })
        }

        // ── Step 1: Find matching theatres ───────────────────────────────────
        const theatreQuery = {}
        if (location && location.trim()) theatreQuery.locationName = { $regex: location.trim(), $options: 'i' }
        if (theatreName && theatreName.trim()) theatreQuery.Theatrename = { $regex: theatreName.trim(), $options: 'i' }

        const theatres = await Theatre.find(theatreQuery, '_id Theatrename locationName')
        if (theatres.length === 0) {
            return res.status(200).json({ success: true, data: [], message: 'No theatres found' })
        }
        const theatreIds = theatres.map(t => t._id)

        // ── Step 2: Find shows matching optional filters ─────────────────────
        const showQuery = {
            AllotedToTheNumberOfTheatres: { $in: theatreIds },
            VerifiedByTheAdmin: true,
        }
        if (movieName && movieName.trim()) showQuery.title = { $regex: movieName.trim(), $options: 'i' }
        if (genreId && genreId.trim()) showQuery.genre = genreId
        if (languageId && languageId.trim()) showQuery.language = languageId

        const shows = await CreateShow.find(showQuery, 'title genre language Posterurl AllotedToTheNumberOfTheatres _id')
            .populate('genre', 'genreName')
            .populate('language', 'name')

        if (shows.length === 0) {
            return res.status(200).json({ success: true, data: [], message: 'No shows found' })
        }

        // ── Step 3: Get ticket data for each show+theatre combo on given date ─
        const results = []

        for (const show of shows) {
            const allottedIds = show.AllotedToTheNumberOfTheatres.map(id => id.toString())
            const matchingTheatres = theatres.filter(t => allottedIds.includes(t._id.toString()))

            for (const theatre of matchingTheatres) {
                const ticketData = await Theatrestickets.findOne({
                    theatreId: theatre._id,
                    Date: date,
                })
                if (!ticketData) continue
                if (maxPrice && ticketData.pricefromtheorg > Number(maxPrice)) continue

                results.push({
                    theatre: {
                        _id: theatre._id,
                        Theatrename: theatre.Theatrename,
                        locationName: theatre.locationName,
                    },
                    movie: {
                        _id: show._id,
                        title: show.title,
                        Posterurl: show.Posterurl,
                        genre: show.genre,
                        language: show.language,
                    },
                    tickets: ticketData,
                })
            }
        }

        return res.status(200).json({ success: true, data: results })
    } catch (error) {
        console.log('EnhancedFinder error:', error)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}
