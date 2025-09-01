import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },   // was ObjectId
    movie: { type: String, required: true },  // was ObjectId

    userName: { type: String, required: true },
    picture: { type: String },
    movieName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    movieImage: { type: String },
    reviewTitle: { type: String, required: true },
    reviewText: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
