require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { MongoClient } = require("mongodb");

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.json({ limit: "20kb" }));

//  CORS
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // allow server-to-server / tools (no origin)
    if (!origin) return cb(null, true);

    // allow only whitelisted frontends
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);

    // IMPORTANT: don't throw error (preflight needs CORS headers)
    return cb(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: false, // you are NOT using cookies
};

app.use(cors(corsOptions));
app.options("/*", cors(corsOptions)); // ✅ REQUIRED FOR PREFLIGHT


// ✅ Rate limiters (note: serverless resets sometimes; ok for basic use)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

const strictLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

// ✅ Mongo (serverless-safe)
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "slv";

let cachedClient = null;
let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;

  if (!MONGO_URI) throw new Error("MONGO_URI missing in env");

  cachedClient = cachedClient || new MongoClient(MONGO_URI, { maxPoolSize: 10 });
  if (!cachedClient.topology?.isConnected?.()) {
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(DB_NAME);
  return cachedDb;
}

function validateLead(body) {
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();

  if (!name || name.length > 80) return { ok: false, message: "Invalid name" };
  if (!phone || !/^[0-9+\-\s]{8,15}$/.test(phone))
    return { ok: false, message: "Invalid phone" };
  if (!message || message.length > 500) return { ok: false, message: "Invalid message" };

  return { ok: true, data: { name, phone, message, createdAt: new Date() } };
}

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/add-leads", strictLimiter, async (req, res) => {
  try {
    const v = validateLead(req.body);
    if (!v.ok) return res.status(400).json({ message: v.message });

    const db = await getDb();
    const result = await db.collection("leads").insertOne(v.data);
    return res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/get-leads", apiLimiter, async (req, res) => {
  try {
    const db = await getDb();
    const docs = await db
      .collection("leads")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.json(docs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Vercel export (NO listen)
module.exports = app;
