const Genre = require('../../models/genre')
const CreateShow = require('../../models/CreateShow')

// GET /Public-Genres — public, returns all genres with their subgenres
const PublicGenres = async (req, res) => {
    try {
        const genres = await Genre.find().populate('subgeneres', 'name')
        return res.status(200).json({ success: true, data: genres })
    } catch (error) {
        console.log("PublicGenres error:", error)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

// POST /Recommend-Movies — public, filter by genreId + optional subGenreId, sorted by likes
const RecommendMovies = async (req, res) => {
    try {
        const { genreId, subGenreId } = req.body
        if (!genreId) {
            return res.status(400).json({ success: false, message: "Genre is required" })
        }

        const filter = { genre: genreId }
        if (subGenreId) {
            filter.SUbGenre = subGenreId
        }

        const movies = await CreateShow.find(filter)
            .select('title Posterurl _id likes')
            .sort({ likes: -1 })
            .limit(8)

        return res.status(200).json({ success: true, data: movies })
    } catch (error) {
        console.log("RecommendMovies error:", error)
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

module.exports = { PublicGenres, RecommendMovies }
