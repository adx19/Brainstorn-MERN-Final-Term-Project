import Whiteboard from "../models/whiteboard.model.js";

// Create or Save a new board
export const saveBoard = async (req, res) => {
  const { title, data } = req.body;
  const userId = req.user.id; // from JWT payload

  try {
    const board = new Whiteboard({ userId, title, data });
    await board.save();

    res.status(201).json({ message: "Board saved successfully", board });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all boards for a user
export const getBoards = async (req, res) => {
  try {
    const boards = await Whiteboard.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single board by ID
export const getBoardById = async (req, res) => {
  try {
    const board = await Whiteboard.findOne({ _id: req.params.id, userId: req.user.id });
    if (!board) return res.status(404).json({ error: "Board not found" });

    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a board
export const deleteBoard = async (req, res) => {
  try {
    const deleted = await Whiteboard.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ error: "Board not found" });

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBoardStatusController = async (req, res) => {
  try {
    console.log("User from JWT:", req.user);
    console.log("Params:", req.params);
    console.log("Body:", req.body);

    const { id } = req.params;
    const { status } = req.body;

    const board = await Whiteboard.findById(id);
    if (!board) {
      console.log("Board not found");
      return res.status(404).json({ msg: "Board not found" });
    }

    if (board.userId.toString() !== req.user.id) {
      console.log("Unauthorized user trying to update");
      return res.status(403).json({ msg: "Not authorized" });
    }

    board.status = status;
    await board.save();

    res.status(200).json(board);
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
