import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRouter from "./routes/auth.routes.js";
import whiteboardRouter from "./routes/whiteboard.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2805;

// Database Connection
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // your React app's URL
    credentials: true, // allow cookies
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); // allow large JSON (for board data)
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/whiteboard", whiteboardRouter);

// Root Route
app.get("/", (req, res) => {
  res.send("🧠 Welcome to the Brainstorm Server!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
