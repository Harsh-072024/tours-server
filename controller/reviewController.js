import Tour from "../models/Tour.js";
import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  const tourId = req.params.tourId;  // ensure tourId is correctly passed in the URL

  // Add tourId to the review object
  const newReview = new Review({ 
    ...req.body,
    tourId: tourId  // associate review with the tour
  });

  try {
    const savedReview = await newReview.save();

    // After creating a new review, update the reviews array in the Tour
    await Tour.findByIdAndUpdate(tourId, {
      $push: { reviews: savedReview._id },
    });

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      data: savedReview,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: err.message,  // Include error message for better debugging
    });
  }
};
