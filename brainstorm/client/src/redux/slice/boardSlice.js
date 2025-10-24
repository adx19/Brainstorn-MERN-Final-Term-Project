// src/redux/slices/boardSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: (() => {
    try {
      const boards = localStorage.getItem("boards");
      return boards ? JSON.parse(boards) : [];
    } catch (e) {
      return [];
    }
  })(),
  currentBoard: null,
  isLoading: false,
  error: null,
};

const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    // Fetch
    fetchBoardsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBoardsSuccess: (state, action) => {
      state.boards = action.payload;
      state.isLoading = false;
      localStorage.setItem("boards", JSON.stringify(action.payload));
    },
    fetchBoardsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create
    createBoardSuccess: (state, action) => {
      state.boards.push(action.payload);
      localStorage.setItem("boards", JSON.stringify(state.boards));
    },

    // Set Current
    setCurrentBoard: (state, action) => {
      state.currentBoard = action.payload;
    },

    // Update
    updateBoardSuccess: (state, action) => {
      const index = state.boards.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
        localStorage.setItem("boards", JSON.stringify(state.boards));
      }
    },

    // Update Status
    updateBoardStatus: (state, action) => {
      const { boardId, status } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.status = status;
        localStorage.setItem("boards", JSON.stringify(state.boards));
      }
    },

    // Add Stroke
    addStroke: (state, action) => {
      const { boardId, stroke } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        if (!board.strokes) board.strokes = [];
        board.strokes.push(stroke);
      }
    },

    // Clear Canvas
    clearBoard: (state, action) => {
      const boardId = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.strokes = [];
      }
    },

    // Delete
    deleteBoardSuccess: (state, action) => {
      state.boards = state.boards.filter(b => b.id !== action.payload);
      localStorage.setItem("boards", JSON.stringify(state.boards));
      state.currentBoard = null;
    },

    // Update Name
    updateBoardName: (state, action) => {
      const { boardId, name } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.name = name;
        localStorage.setItem("boards", JSON.stringify(state.boards));
      }
    },
  },
});

export const {
  fetchBoardsStart,
  fetchBoardsSuccess,
  fetchBoardsFailure,
  createBoardSuccess,
  setCurrentBoard,
  updateBoardSuccess,
  updateBoardStatus,
  addStroke,
  clearBoard,
  deleteBoardSuccess,
  updateBoardName,
} = boardSlice.actions;

export default boardSlice.reducer;