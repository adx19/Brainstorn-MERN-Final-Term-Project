import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { saveBoard, getBoards, getBoardById, deleteBoard, updateBoardStatusController } from "../controllers/whiteboard.controllers.js";

const router = express.Router();

// Save new board
router.post("/save", verifyToken, saveBoard);

// Get all boards of logged-in user
router.get("/all", verifyToken, getBoards);

// Get specific board by ID
router.get("/:id", verifyToken, getBoardById);

// Update Board
router.patch("/:id/status", verifyToken, updateBoardStatusController);

// Delete a board
router.delete("/:id", verifyToken, deleteBoard);


export default router;
