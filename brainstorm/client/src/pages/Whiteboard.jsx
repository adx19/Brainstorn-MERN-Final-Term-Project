// src/pages/Whiteboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Save,
  LogOut,
  Trash2,
  Download,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";

import {
  getBoards as getBoardsAPI,
  saveBoard as saveBoardAPI,
  deleteBoard as deleteBoardAPI,
  updateBoardStatus as updateBoardStatusAPI,
} from "../../apiCalls/whiteboardApi"; // import your API functions

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [boards, setBoards] = useState([]);
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [boardName, setBoardName] = useState("Untitled Board");
  const [status, setStatus] = useState("ongoing");
  const [showList, setShowList] = useState(true);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);

  // Canvas drawing handlers
  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setCurrentStroke([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const point = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };

    setCurrentStroke((prev) => [...prev, point]);

    const ctx = canvas.getContext("2d");

    ctx.lineWidth = brushSize;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    const last = currentStroke[currentStroke.length - 1];
    if (last) ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStrokes((prev) => [
      ...prev,
      { color: brushColor, size: brushSize, points: currentStroke },
    ]);
    setCurrentStroke([]);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Create new board
  const createNewBoard = () => {
    const newId = Date.now().toString();
    const newBoard = {
      _id: newId,
      title: "New Board",
      data: [],
      status: "ongoing",
      createdAt: new Date(),
    };
    setBoards((prev) => [...prev, newBoard]);
    setCurrentBoardId(newId);
    setBoardName(newBoard.title);
    setStrokes([]);
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Load board by ID
  const loadBoard = (id) => {
    const board = boards.find((b) => b._id === id);
    if (!board) return;
    setCurrentBoardId(id);
    setBoardName(board.title);
    setStatus(board.status || "ongoing");
    setStrokes(board.data || []);

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    board.data?.forEach((stroke) => {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.beginPath();
      stroke.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });
  };

  // Save board
  const saveBoard = async () => {
    try {
      const boardData = {
        title: boardName,
        data: strokes,
        status,
      };
      const saved = await saveBoardAPI(boardData);
      setBoards((prev) =>
        prev.map((b) => (b._id === currentBoardId ? saved.board : b))
      );
      setStatus(saved.board.status);
      alert("Board saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save board.");
    }
  };

  // Delete board
  const deleteBoardHandler = async () => {
    try {
      await deleteBoardAPI(currentBoardId);
      setBoards((prev) => prev.filter((b) => b._id !== currentBoardId));
      setCurrentBoardId(null);
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Failed to delete board.");
    }
  };

  // Mark board complete
  const markComplete = async () => {
    try {
      const updated = await updateBoardStatusAPI(currentBoardId, "completed");
      setStatus("completed");
      setBoards((prev) =>
        prev.map((b) => (b._id === currentBoardId ? updated : b))
      );
      alert("Board marked as completed!");
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  // Load all boards on mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBoards = async () => {
      try {
        const boardsData = await getBoardsAPI();
        setBoards(boardsData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBoards();
  }, [navigate, user]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []); // empty dependency, runs once

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      stroke.points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }, [strokes]); // redraw only

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      <header className="bg-white shadow p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-indigo-900">Brainstorm</h1>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="px-3 py-1 border-2 border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span
              className={`px-3 py-1 rounded text-sm font-semibold ${
                status === "ongoing"
                  ? "bg-blue-100 text-blue-700"
                  : status === "saved"
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {status}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 gap-3 p-3">
        <aside
          className={`${
            showList ? "w-64" : "w-0"
          } transition-all bg-white rounded shadow overflow-y-auto flex flex-col`}
        >
          <button
            onClick={createNewBoard}
            className="m-3 flex gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-semibold"
          >
            <Plus size={20} /> New
          </button>
          <div className="flex-1 px-3 pb-3 space-y-2">
            {boards.map((b) => (
              <button
                key={b._id}
                onClick={() => loadBoard(b._id)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  currentBoardId === b._id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {b.title}
              </button>
            ))}
          </div>
        </aside>

        <button
          onClick={() => setShowList(!showList)}
          className="self-start bg-white text-indigo-600 p-2 rounded shadow hover:bg-gray-100"
        >
          <ChevronLeft size={20} className={showList ? "rotate-180" : ""} />
        </button>

        <div className="flex-1 flex flex-col gap-3">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="flex-1 bg-white rounded shadow border-2 border-indigo-200 cursor-crosshair"
          />

          <div className="bg-white rounded shadow p-4">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Size</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <button
                onClick={() => setBrushColor("#000000")}
                className="bg-black h-8 rounded hover:opacity-80"
                title="Black"
              />
              <button
                onClick={() => setBrushColor("#FF0000")}
                className="bg-red-600 h-8 rounded hover:opacity-80"
                title="Red"
              />
              <button
                onClick={() => setBrushColor("#00FF00")}
                className="bg-green-600 h-8 rounded hover:opacity-80"
                title="Green"
              />
              <button
                onClick={() => setBrushColor("#FFFFFF")}
                className="bg-gray-300 h-8 rounded hover:opacity-80 border border-gray-400"
                title="Eraser"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button
                onClick={saveBoard}
                className="flex gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm font-semibold"
              >
                <Save size={16} /> Save
              </button>
              <button
                onClick={markComplete}
                className="flex gap-1 bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 text-sm font-semibold"
              >
                ✓ Done
              </button>
              <button
                onClick={() => {
                  setStrokes([]);
                  const ctx = canvasRef.current.getContext("2d");
                  ctx.clearRect(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                  );
                }}
                className="flex gap-1 bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700 text-sm font-semibold"
              >
                <Trash2 size={16} /> Clear
              </button>
              <button
                onClick={() => {
                  const canvas = canvasRef.current;
                  const link = document.createElement("a");
                  link.href = canvas.toDataURL();
                  link.download = boardName + ".png";
                  link.click();
                }}
                className="flex gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={deleteBoardHandler}
                className="flex gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm font-semibold"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
