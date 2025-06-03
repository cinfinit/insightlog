#!/usr/bin/env node
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 1337;
const cors = require("cors");

const LOG_FILE = path.join(__dirname, "logs", "insightLog.json");

app.use(cors()); // <-- allow all origins by default
// Middleware
app.use(express.json());
app.use("/dashboard", express.static(path.join(__dirname, "dashboard")));

// GET: Send all logs to dashboard
app.get("/api/logs", (req, res) => {
  try {
    const raw = fs.readFileSync(LOG_FILE, "utf8");
    const lines = raw.split("\n").filter(Boolean);
    const logs = lines.map((line) => JSON.parse(line));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to read logs" });
  }
});

// POST: Receive log from browser
app.post("/api/logs", (req, res) => {
  const log = req.body;
  fs.appendFileSync(LOG_FILE, JSON.stringify(log) + "\n", "utf8");
  res.status(200).send({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`InsightLog server running at http://localhost:${PORT}/dashboard`);
});
