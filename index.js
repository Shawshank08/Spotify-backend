const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Serve static files (e.g., MP3 files) from the "songs" folder
app.use("/songs", express.static(path.join(__dirname, "songs")));

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});