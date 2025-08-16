import express, { Request, Response } from "express";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
import sessionRouter from "./routes/session";
import chatRouter from "./routes/chat";
import authRoutes from "./routes/auth";
import historyRoutes from "./routes/history";
import contactRoutes from "./routes/Contact";      // ⬅️ fixed case
import cors from "cors";
import session from "express-session";
import { connectToDb } from "./utils/db";
import path from "path";
import profileRoutes from "./routes/profile";

configDotenv();

const app = express();

// If deploying behind a proxy (Render/Railway/Heroku), uncomment:
// app.set("trust proxy", 1);

// ===== CORS (allow a small whitelist of dev origins) =====
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigins = [
  CLIENT_ORIGIN,
  "http://localhost:8080",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// (Optional but nice for uptime checks)
app.get("/health", (_req, res) => res.json({ ok: true }));

// ===== Parsers =====
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===== Session (dev-friendly cookie settings) =====
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard_cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax", // if cross-site over HTTPS, use "none" and secure:true
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ===== Logger =====
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ===== Static files =====
app.use(express.static(path.join(__dirname, "public")));

// ===== Homepage =====
app.get("/index", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== Routers =====
app.use("/session", sessionRouter);
app.use("/chat", chatRouter);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/profile", profileRoutes);

// ===== Start server after DB connection =====
connectToDb()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
      console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
  });

export default app; // (optional; useful for testing)
