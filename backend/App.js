import express from "express";
import dotenv from "dotenv";
import movieRoutes from "./Routes/movieRouter.js";
import userRoutes from "./Routes/userRouter.js";
import reviewRoutes from "./Routes/reviewRouter.js";
import watchListRouter from "./Routes/watchListRouter.js";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config({ path: "./.env" });

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

connectDB();

app.use("/movies", movieRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);
app.use("/watchlist", watchListRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});