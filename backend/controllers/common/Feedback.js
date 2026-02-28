const Feedback = require('../../models/Feedback')

exports.SubmitFeedback = async (req, res) => {
    try {
        const { firstName, lastName, email, countrycode, number, message } = req.body

        const feedback = await Feedback.create({ firstName, lastName, email, countrycode, number, message })

        return res.status(201).json({ success: true, message: 'Feedback submitted successfully', data: feedback })
    } catch (error) {
        console.error('SubmitFeedback error:', error)
        return res.status(500).json({ success: false, message: 'Failed to submit feedback' })
    }
}
