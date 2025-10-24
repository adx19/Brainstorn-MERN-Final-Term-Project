// server/models/board.model.js
import mongoose from "mongoose";

const drawingStrokeSchema = new mongoose.Schema({
  color: String,
  size: Number,
  points: [{
    x: Number,
    y: Number
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "Untitled Board"
  },
  strokes: [drawingStrokeSchema],
  status: {
    type: String,
    enum: ['ongoing', 'saved', 'completed'],
    default: 'ongoing'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  thumbnail: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const Board = mongoose.model("board", boardSchema);

export default Board;