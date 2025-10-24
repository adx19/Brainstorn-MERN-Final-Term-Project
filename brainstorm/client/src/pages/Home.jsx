// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slice/authSlice';
import { updateBoardStatus, deleteBoardSuccess } from '../redux/slice/boardSlice';

import { Plus, LogOut, Edit2, Trash2, AlertCircle, Save, CheckCircle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [tab, setTab] = useState('ongoing');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser({});
      }
    }
    const boardsData = localStorage.getItem('boards');
    if (boardsData) {
      try {
        setBoards(JSON.parse(boardsData));
      } catch (e) {
        setBoards([]);
      }
    }
  }, [navigate]);

  const updateStatus = (id, status) => {
    dispatch(updateBoardStatus({ boardId: id, status }));
  };

  const deleteBoard = (id) => {
    if (window.confirm('Delete board?')) {
      dispatch(deleteBoardSuccess(id));
    }
  };

  const statusColors = { ongoing: 'bg-blue-100 text-blue-800', saved: 'bg-green-100 text-green-800', completed: 'bg-purple-100 text-purple-800' };
  const statusIcons = { ongoing: AlertCircle, saved: Save, completed: CheckCircle };
  const filtered = boards.filter(b => b.status === tab || (!b.status && tab === 'ongoing'));
  const stats = { ongoing: boards.filter(b => !b.status || b.status === 'ongoing').length, saved: boards.filter(b => b.status === 'saved').length, completed: boards.filter(b => b.status === 'completed').length };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow p-4 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div><h1 className="text-3xl font-bold text-indigo-600">Brainstorm</h1><p className="text-sm text-gray-600">Welcome, {user?.name || user?.username || 'User'}</p></div>
          <button onClick={() => { dispatch(logout()); navigate('/login'); }} className="flex gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"><LogOut size={20} /> Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name || user?.username}! 👋</h2>
          <button onClick={() => navigate('/whiteboard', { state: { newBoard: true } })} className="flex gap-2 bg-white text-indigo-600 px-4 py-2 rounded font-bold hover:bg-gray-100"><Plus size={20} /> New Board</button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {Object.entries(stats).map(([key, count]) => <div key={key} className="bg-white p-6 rounded shadow"><p className="text-gray-600 text-sm capitalize">{key}</p><p className="text-3xl font-bold text-indigo-600">{count}</p></div>)}
        </div>

        <div className="flex gap-4 border-b mb-6">
          {Object.keys(stats).map(s => <button key={s} onClick={() => setTab(s)} className={`px-4 py-2 font-semibold border-b-2 capitalize ${tab === s ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600'}`}>{s}</button>)}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded text-center"><p className="text-2xl font-bold text-gray-800 mb-4">No {tab} boards</p><button onClick={() => navigate('/whiteboard', { state: { newBoard: true } })} className="bg-indigo-600 text-white px-4 py-2 rounded font-bold hover:bg-indigo-700"><Plus size={20} /> Create</button></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(b => {
              const Icon = statusIcons[b.status || 'ongoing'];
              return (
                <div key={b.id} className="bg-white rounded shadow hover:shadow-lg">
                  <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 cursor-pointer hover:opacity-90" onClick={() => navigate('/whiteboard', { state: { boardId: b.id } })}>{b.imageData ? <img src={b.imageData} alt={b.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">🎨</div>}</div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{b.name}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded flex gap-1 ${statusColors[b.status || 'ongoing']}`}><Icon size={14} /> {b.status || 'ongoing'}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{new Date(b.createdAt).toLocaleDateString()}</p>
                    <button onClick={() => navigate('/whiteboard', { state: { boardId: b.id } })} className="w-full bg-indigo-600 text-white px-3 py-2 rounded font-semibold hover:bg-indigo-700 mb-2 flex justify-center gap-1"><Edit2 size={16} /> Open</button>
                    <div className="flex gap-2">
                      {b.status !== 'ongoing' && <button onClick={() => updateStatus(b.id, 'ongoing')} className="flex-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold hover:bg-blue-200">Ongoing</button>}
                      {b.status !== 'saved' && <button onClick={() => updateStatus(b.id, 'saved')} className="flex-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold hover:bg-green-200">Saved</button>}
                      {b.status !== 'completed' && <button onClick={() => updateStatus(b.id, 'completed')} className="flex-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold hover:bg-purple-200">Done</button>}
                    </div>
                    <button onClick={() => deleteBoard(b.id)} className="w-full mt-2 bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-semibold hover:bg-red-200"><Trash2 size={14} className="inline mr-1" /> Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;