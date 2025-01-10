import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    tourId: {  // renamed for clarity
      type: mongoose.Types.ObjectId,
      ref: "Tour",
      required: true,  // added required to enforce relationship
    },
    username: {
      type: String,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
