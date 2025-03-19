const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
const cors = require("cors");
app.use(cors({ origin: "https://spotifycloneshashank.netlify.app" }));

// Serve static files (e.g., MP3 files) from the "songs" folder
app.use("/songs", express.static(path.join(__dirname, "songs"), {
  setHeaders: (res, path) => {
    // Set CORS headers for static files
    res.set("Access-Control-Allow-Origin", "https://spotifycloneshashank.netlify.app");
  },
});

// Endpoint to list songs
app.get("/songs", (req, res) => {
  const songsDir = path.join(__dirname, "songs");
  const fs = require("fs");
  fs.readdir(songsDir, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan songs directory");
    }
    const mp3Files = files.filter(file => file.endsWith(".mp3"));
    res.json(mp3Files);
  });
});

// Route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Music Player Backend!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});