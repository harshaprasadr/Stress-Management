// server.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/stress_detection";

// Middleware
app.use(express.json());
app.use(cors());

// Local File Database Fallback (ensures backend works even without MongoDB installed)
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function initLocalStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

function getLocalUsers() {
  try {
    initLocalStorage();
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading local users:", err.message);
    return [];
  }
}

function saveLocalUsers(users) {
  try {
    initLocalStorage();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving local users:", err.message);
  }
}

// Mongoose User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// Disable mongoose buffering so operations fail fast if DB is disconnected
mongoose.set("bufferCommands", false);

// Connect to MongoDB with timeout
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 3000,
}).then(() => {
  console.log("✅ MongoDB connected successfully to:", MONGODB_URI);
  syncLocalUsersToMongo();
}).catch(err => {
  console.warn("⚠️  MongoDB not running at (" + MONGODB_URI + "): " + err.message);
  console.log("📁 Seamless fallback activated: Using local JSON storage (data/users.json)");
  console.log("   Registration and login will work 100% reliably!");
});

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connection established");
  syncLocalUsersToMongo();
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected. Using local file storage fallback.");
});

// Helper: sync users from local storage to MongoDB when connected
async function syncLocalUsersToMongo() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const localUsers = getLocalUsers();
    for (const localUser of localUsers) {
      const exists = await User.findOne({ email: localUser.email.toLowerCase() });
      if (!exists) {
        await User.create({
          name: localUser.name,
          email: localUser.email.toLowerCase(),
          password: localUser.password,
          createdAt: localUser.createdAt || new Date()
        });
        console.log(`🔄 Synced local user ${localUser.email} to MongoDB`);
      }
    }
  } catch (err) {
    console.error("Error syncing users to MongoDB:", err.message);
  }
}

// Database helper functions (works seamlessly with MongoDB or local file fallback)
async function findUserByEmail(email) {
  const normalized = email.toLowerCase().trim();
  if (mongoose.connection.readyState === 1) {
    try {
      const mongoUser = await User.findOne({ email: normalized });
      if (mongoUser) return mongoUser;
    } catch (err) {
      console.warn("MongoDB query failed, falling back to local storage:", err.message);
    }
  }
  const localUsers = getLocalUsers();
  return localUsers.find(u => u.email.toLowerCase() === normalized) || null;
}

async function saveUser({ name, email, password }) {
  const normalized = email.toLowerCase().trim();
  let savedUser = null;

  if (mongoose.connection.readyState === 1) {
    try {
      const newUser = new User({ name: name.trim(), email: normalized, password });
      savedUser = await newUser.save();
      console.log("✅ User saved in MongoDB:", normalized);
    } catch (err) {
      console.warn("MongoDB save failed, saving to local storage:", err.message);
    }
  }

  // Always keep local storage updated
  const localUsers = getLocalUsers();
  const existingIdx = localUsers.findIndex(u => u.email.toLowerCase() === normalized);
  const userData = {
    _id: savedUser ? savedUser._id.toString() : Date.now().toString(),
    name: name.trim(),
    email: normalized,
    password,
    createdAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    localUsers[existingIdx] = userData;
  } else {
    localUsers.push(userData);
  }
  saveLocalUsers(localUsers);

  if (!savedUser) {
    console.log("📁 User saved in Local JSON storage (data/users.json):", normalized);
  }

  return savedUser || userData;
}

// REGISTER
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Register request:", { name, email, password: password ? "***" : "missing" });

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters long" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await saveUser({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id || user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "Server error: " + (err.message || "Registration failed") });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request:", { email, password: password ? "***" : "missing" });

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials: user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials: incorrect password" });
    }

    const token = jwt.sign({ id: user._id || user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id || user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error: " + (err.message || "Login failed") });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const isMongo = mongoose.connection.readyState === 1;
  res.json({
    status: "OK",
    message: "Stress Detection API is running",
    storage: isMongo ? "MongoDB" : "Local File Database (data/users.json)"
  });
});

// Run server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Storage: MongoDB (mongodb://127.0.0.1:27017) with auto-fallback to local JSON (data/users.json)`);
});
