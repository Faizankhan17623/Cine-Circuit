const RatingAndReview = require("../../models/RatingAndReview")
const CreateShow = require('../../models/CreateShow')
const Payment = require('../../models/payment')
const mongoose = require("mongoose")
const USER = require('../../models/user')

// Create a new rating and review
exports.createRating = async (req, res) => {
  try {
    const userId = req.USER.id
    const { rating, review, showId } = req.body

    // Validate input
    if (!rating || !review || !showId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    // Check if the user has purchased tickets for this show
    const ticketPurchase = await Payment.findOne({
      userid: userId,
      showid: showId,
      Payment_Status: "success"  // Only consider successful payments
    })

    if (!ticketPurchase) {
      return res.status(404).json({
        success: false,
        message: "You have not purchased tickets for this show",
      })
    }

    // Check if the user has already reviewed the show
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: showId,
    })

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Show already reviewed by user",
      })
    }

    // Create a new rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: showId,
      user: userId,
    })

    // Add the rating and review to the show
    await CreateShow.findByIdAndUpdate(showId, {
      $push: {
        ratingAndReviews: ratingReview._id,
      },
    })

    return res.status(201).json({
      success: true,
      message: "Rating and review created successfully",
      ratingReview,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Get the average rating for a course
exports.getAverageRating = async (req, res) => {
  try {
    const Showid = req.body.Showid

    // Calculate the average rating using the MongoDB aggregation pipeline
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(Showid), // Convert courseId to ObjectId
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ])

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      })
    }

    // If no ratings are found, return 0 as the default rating
    return res.status(200).json({ success: true, averageRating: 0 })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating for the course",
      error: error.message,
    })
  }
}

// Get all rating and reviews
exports.getAllRatingReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .exec()

      if(!allReviews || allReviews.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No reviews found",
        })
      }
    res.status(200).json({
      success: true,
      data: allReviews,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating and review for the course",
      error: error.message,
    })
  }
}