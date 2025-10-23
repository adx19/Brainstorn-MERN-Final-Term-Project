import express from "express";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/db.js";
import authrouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from 'cors'



const app = express();
const PORT = 2805;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());


app.use("/api/auth", authrouter);

connectDB();


app.get("/", (req, res) => {
  res.send("Welcome to the Brainstorm Server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
