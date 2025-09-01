import express from "express";
import Watchlist from "../models/Watchlist.js";
const router = express.Router();



router.post("/", async (req, res) => {
  try {
    const { userId, movieId, movieName, poster } = req.body;
    const newWatchlistItem = new Watchlist({
      user: userId,
      movie: movieId,
      movieName,
      poster
    });
    await newWatchlistItem.save();
    res.status(201).json(newWatchlistItem);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.params.userId });
    res.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:userId/:movieId", async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    await Watchlist.findOneAndDelete({ user: userId, movie: movieId });
    res.json({ status: "204", message: "Removed from watchlist" });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;