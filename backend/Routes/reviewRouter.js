import express from "express";
import Review from "../models/Review.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { user,userName,picture, movie,movieName,reviewTitle, rating, reviewText, movieImage } = req.body;
  try{
    const data = new Review({
        user,
        userName,
        picture,
        movie,
        movieName,
        movieImage,
        rating,
        reviewTitle,
        reviewText,
        timestamp: new Date(),
    })

    await data.save();
    res.status(201).json({ message: "Review added successfully", review: data });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:movieId", async (req, res) => {
  const { movieId } = req.params;
  try {
    const reviews = await Review.find({ movie: movieId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/rev/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await Review.find({ user: userId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.delete("/:reviewId", authMiddleware, async (req, res) => {
  const { reviewId } = req.params;
  try {
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
