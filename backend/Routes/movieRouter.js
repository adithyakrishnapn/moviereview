import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const apikey = process.env.API_KEY;
    const response = await fetch(
      `${process.env.API_URL}?apikey=${apikey}&s=avengers&page=1`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const apikey = process.env.API_KEY;

    const response = await fetch(
      `${process.env.API_URL}?apikey=${apikey}&i=${id}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
