import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: String, required: true }, // imdbID
    movieName: { type: String },
    poster: { type: String },
    dateAdded: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);
export default Watchlist;
