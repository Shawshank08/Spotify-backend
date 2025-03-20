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

// Function to recursively scan directories for .mp3 files
function scanDirectory(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      // Recursively scan subdirectories
      results = results.concat(scanDirectory(filePath));
    } else if (file.endsWith(".mp3")) {
      // Add .mp3 files to the results
      results.push(filePath);
    }
  });
  return results;
}

// Endpoint to list songs (root songs directory)
app.get("/songs", (req, res) => {
  const songsDir = path.join(__dirname, "songs");
  try {
    const mp3Files = scanDirectory(songsDir);
    // Convert absolute paths to relative paths (for easier frontend use)
    const relativePaths = mp3Files.map(file => path.relative(songsDir, file));
    res.setHeader("Content-Type", "application/json");
    res.json(relativePaths);
  } catch (err) {
    console.error("Error scanning songs directory:", err);
    res.status(500).send("Unable to scan songs directory");
  }
});

// Endpoint to list songs from a specific folder
app.get("/songs/:folder", (req, res) => {
  const folder = req.params.folder;
  const songsDir = path.join(__dirname, "songs", folder);
  try {
    const mp3Files = scanDirectory(songsDir);
    // Convert absolute paths to relative paths (for easier frontend use)
    const relativePaths = mp3Files.map(file => path.relative(songsDir, file));
    res.setHeader("Content-Type", "application/json");
    res.json(relativePaths);
  } catch (err) {
    console.error("Error scanning songs directory:", err);
    res.status(500).send("Unable to scan songs directory");
  }
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