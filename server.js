// backend/server.js
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const app = express();

const PORT = process.env.PORT || 5000;
const CONTACTS_FILE = process.env.CONTACTS_FILE || path.join(__dirname, "data", "contacts.json");

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// Serve static frontend
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Routes
app.get("/", (req, res) => res.sendFile(path.join(publicDir, "index.html")));

app.get("/api/services", (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: "Vocal Training", description: "Improve tone, range, and breathing." },
      { id: 2, title: "Instrument Lessons", description: "Learn tabla, harmonium, or guitar." },
      { id: 3, title: "Music Theory", description: "Understand scales, ragas, and chords." },
      { id: 4, title: "Performance Workshops", description: "Gain confidence on stage." }
    ]
  });
});

app.post(
  "/api/contact",
  body("name").isString().notEmpty(),
  body("email").isEmail(),
  body("message").isString().isLength({ min: 3 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const entry = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
    const file = CONTACTS_FILE;
    let contacts = [];

    if (fs.existsSync(file)) {
      contacts = JSON.parse(fs.readFileSync(file, "utf8") || "[]");
    }
    contacts.push(entry);
    fs.writeFileSync(file, JSON.stringify(contacts, null, 2));

    res.status(201).json({ success: true, message: "Thank you! We’ll get back to you soon." });
  }
);

// Fallback
app.use((req, res) => res.status(404).send("Not Found"));

// Start
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
// backend/server.js
