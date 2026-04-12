const Watchlist = require('../../models/Watchlist')

// POST /Add-To-Watchlist — logged-in Viewer
const AddToWatchlist = async (req, res) => {
    try {
        const userId = req.USER.id
        const { movieId } = req.body

        if (!movieId) {
            return res.status(400).json({ success: false, message: 'Movie ID is required' })
        }

        // Find or create the user's watchlist doc
        let watchlist = await Watchlist.findOne({ user: userId })

        if (!watchlist) {
            watchlist = await Watchlist.create({ user: userId, movies: [movieId] })
            return res.status(201).json({ success: true, message: 'Movie added to watchlist' })
        }

        // Already in watchlist
        if (watchlist.movies.includes(movieId)) {
            return res.status(409).json({ success: false, message: 'Movie already in watchlist' })
        }

        watchlist.movies.push(movieId)
        await watchlist.save()

        return res.status(200).json({ success: true, message: 'Movie added to watchlist' })
    } catch (error) {
        console.log('AddToWatchlist error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// DELETE /Remove-From-Watchlist — logged-in Viewer
const RemoveFromWatchlist = async (req, res) => {
    try {
        const userId = req.USER.id
        const { movieId } = req.body

        if (!movieId) {
            return res.status(400).json({ success: false, message: 'Movie ID is required' })
        }

        const watchlist = await Watchlist.findOne({ user: userId })

        if (!watchlist) {
            return res.status(404).json({ success: false, message: 'Watchlist not found' })
        }

        const before = watchlist.movies.length
        watchlist.movies = watchlist.movies.filter((id) => id.toString() !== movieId)

        if (watchlist.movies.length === before) {
            return res.status(404).json({ success: false, message: 'Movie not found in watchlist' })
        }

        await watchlist.save()

        return res.status(200).json({ success: true, message: 'Movie removed from watchlist' })
    } catch (error) {
        console.log('RemoveFromWatchlist error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

// GET /My-Watchlist — logged-in Viewer
const GetMyWatchlist = async (req, res) => {
    try {
        const userId = req.USER.id

        const watchlist = await Watchlist.findOne({ user: userId }).populate({
            path: 'movies',
            select: 'title Posterurl genre tagline releasedate BannerLiked averageRating',
            populate: {
                path: 'genre',
                select: 'genreName',
            },
        })

        if (!watchlist) {
            return res.status(200).json({ success: true, data: [] })
        }

        return res.status(200).json({ success: true, data: watchlist.movies })
    } catch (error) {
        console.log('GetMyWatchlist error:', error)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

module.exports = { AddToWatchlist, RemoveFromWatchlist, GetMyWatchlist }
