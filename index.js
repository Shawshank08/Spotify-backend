const express = require("express");
const path = require("path");
const fs = require("fs");
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
  }
}));

// Endpoint to list songs (root songs directory)
app.get("/songs", (req, res) => {
  const songsDir = path.join(__dirname, "songs");
  fs.readdir(songsDir, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan songs directory");
    }
    const mp3Files = files.filter(file => file.endsWith(".mp3"));
    res.setHeader("Content-Type", "application/json");
    res.json(mp3Files);
  });
});

// Endpoint to list songs from a specific folder
app.get("/songs/:folder", (req, res) => {
  const folder = req.params.folder;
  const songsDir = path.join(__dirname, "songs", folder);
  fs.readdir(songsDir, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan songs directory");
    }
    const mp3Files = files.filter(file => file.endsWith(".mp3"));
    res.setHeader("Content-Type", "application/json");
    res.json(mp3Files);
  });
});

// Endpoint to serve album info (info.json)
app.get("/songs/:folder/info.json", (req, res) => {
  const folder = req.params.folder;
  const infoPath = path.join(__dirname, "songs", folder, "info.json");
  res.sendFile(infoPath);
});

// Endpoint to serve album cover (cover.png)
app.get("/songs/:folder/cover.png", (req, res) => {
  const folder = req.params.folder;
  const coverPath = path.join(__dirname, "songs", folder, "cover.png");
  res.sendFile(coverPath);
});

// Route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Music Player Backend!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});