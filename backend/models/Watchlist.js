const mongoose = require('mongoose')

const WatchlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User  ',
            required: true,
            unique: true,
        },
        movies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Show',
            },
        ],
    },
    { timestamps: true }
)

module.exports = mongoose.model('Watchlist', WatchlistSchema)
