// src/pages/Whiteboard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, LogOut, Trash2, Download, Plus, ChevronLeft } from 'lucide-react';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [boards, setBoards] = useState([]);
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [boardName, setBoardName] = useState('Untitled Board');
  const [status, setStatus] = useState('ongoing');
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const boardsData = localStorage.getItem('boards');
    const allBoards = boardsData ? JSON.parse(boardsData) : [];
    setBoards(allBoards);
    
    const boardId = location.state?.boardId;
    if (boardId) {
      const board = allBoards.find(b => b.id === boardId);
      setCurrentBoardId(boardId);
      setBoardName(board?.name || 'Untitled Board');
      setStatus(board?.status || 'ongoing');
    } else {
      const newId = Date.now().toString();
      setCurrentBoardId(newId);
      const newBoards = [...allBoards, { id: newId, name: 'New Board', status: 'ongoing', createdAt: new Date() }];
      setBoards(newBoards);
      localStorage.setItem('boards', JSON.stringify(newBoards));
    }
  }, [navigate, location]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (currentBoardId && boards.length > 0) {
      const board = boards.find(b => b.id === currentBoardId);
      if (board?.imageData) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = board.imageData;
      }
    }
  }, [currentBoardId, boards]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const saveBoard = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    const updated = boards.map(b => b.id === currentBoardId ? { ...b, name: boardName, imageData, status: 'saved', updatedAt: new Date() } : b);
    setBoards(updated);
    localStorage.setItem('boards', JSON.stringify(updated));
    setStatus('saved');
    alert('Board saved!');
  };

  const markComplete = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    const updated = boards.map(b => b.id === currentBoardId ? { ...b, imageData, status: 'completed', updatedAt: new Date() } : b);
    setBoards(updated);
    localStorage.setItem('boards', JSON.stringify(updated));
    setStatus('completed');
    alert('Board marked as completed!');
  };

  const deleteBoard = () => {
    if (window.confirm('Delete board?')) {
      const updated = boards.filter(b => b.id !== currentBoardId);
      setBoards(updated);
      localStorage.setItem('boards', JSON.stringify(updated));
      navigate('/home');
    }
  };

  const createNew = () => {
    const newId = Date.now().toString();
    const newBoard = { id: newId, name: 'New Board', status: 'ongoing', createdAt: new Date() };
    const updated = [...boards, newBoard];
    setBoards(updated);
    localStorage.setItem('boards', JSON.stringify(updated));
    setCurrentBoardId(newId);
    setBoardName('New Board');
    setStatus('ongoing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      <header className="bg-white shadow p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-indigo-900">Brainstorm</h1>
            <input type="text" value={boardName} onChange={(e) => setBoardName(e.target.value)} className="px-3 py-1 border-2 border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span className={`px-3 py-1 rounded text-sm font-semibold ${status === 'ongoing' ? 'bg-blue-100 text-blue-700' : status === 'saved' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{status}</span>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"><LogOut size={20} /></button>
        </div>
      </header>

      <div className="flex flex-1 gap-3 p-3">
        <aside className={`${showList ? 'w-64' : 'w-0'} transition-all bg-white rounded shadow overflow-y-auto flex flex-col`}>
          <button onClick={createNew} className="m-3 flex gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-semibold"><Plus size={20} /> New</button>
          <div className="flex-1 px-3 pb-3 space-y-2">
            {boards.map(b => <button key={b.id} onClick={() => { setCurrentBoardId(b.id); setBoardName(b.name); setStatus(b.status || 'ongoing'); }} className={`w-full text-left px-3 py-2 rounded text-sm ${currentBoardId === b.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{b.name}</button>)}
          </div>
        </aside>

        <button onClick={() => setShowList(!showList)} className="self-start bg-white text-indigo-600 p-2 rounded shadow hover:bg-gray-100"><ChevronLeft size={20} className={showList ? 'rotate-180' : ''} /></button>

        <div className="flex-1 flex flex-col gap-3">
          <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)} className="flex-1 bg-white rounded shadow border-2 border-indigo-200 cursor-crosshair" />
          
          <div className="bg-white rounded shadow p-4">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-3">
              <div><label className="text-xs font-semibold block mb-1">Color</label><input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
              <div><label className="text-xs font-semibold block mb-1">Size</label><input type="range" min="1" max="20" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full" /></div>
              <button onClick={() => setBrushColor('#000000')} className="bg-black h-8 rounded hover:opacity-80" title="Black" />
              <button onClick={() => setBrushColor('#FF0000')} className="bg-red-600 h-8 rounded hover:opacity-80" title="Red" />
              <button onClick={() => setBrushColor('#00FF00')} className="bg-green-600 h-8 rounded hover:opacity-80" title="Green" />
              <button onClick={() => setBrushColor('#FFFFFF')} className="bg-gray-300 h-8 rounded hover:opacity-80 border border-gray-400" title="Eraser" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button onClick={saveBoard} className="flex gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm font-semibold"><Save size={16} /> Save</button>
              <button onClick={markComplete} className="flex gap-1 bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 text-sm font-semibold">✓ Done</button>
              <button onClick={() => { const ctx = canvasRef.current.getContext('2d'); ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); }} className="flex gap-1 bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700 text-sm font-semibold"><Trash2 size={16} /> Clear</button>
              <button onClick={() => { const link = document.createElement('a'); link.href = canvasRef.current.toDataURL(); link.download = boardName + '.png'; link.click(); }} className="flex gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm font-semibold"><Download size={16} /> Download</button>
              <button onClick={deleteBoard} className="flex gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm font-semibold"><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;