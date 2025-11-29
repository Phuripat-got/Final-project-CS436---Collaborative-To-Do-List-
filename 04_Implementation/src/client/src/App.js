import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // เชื่อมต่อ Server

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    socket.on('initTasks', (t) => setTasks(t));
    socket.on('taskAdded', (t) => setTasks((p) => [...p, t]));
    socket.on('taskUpdated', (t) => setTasks((p) => p.map(i => i.id === t.id ? t : i)));
    socket.on('taskDeleted', (id) => setTasks((p) => p.filter(i => i.id !== id)));
    return () => socket.off();
  }, []);

  const handleAddTask = () => {
    if (input.trim()) {
      socket.emit('addTask', { title: input, user: user });
      setInput('');
    }
  };

  const handleDelete = (id) => {
    if(window.confirm("ต้องการลบรายการนี้ใช่ไหม?")) {
      socket.emit('deleteTask', id);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    socket.emit('updateStatus', { id, newStatus });
  };

  const startEditing = (id, currentTitle) => {
    setEditingId(id);
    setEditText(currentTitle);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      socket.emit('editTask', { id, newTitle: editText });
      setEditingId(null);
    }
  };

  // --- หน้า Login ---
  if (!isJoined) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
          {/* Logo */}
          <div className="mb-8 text-center">
             {/* ใช้รูป Logo ที่คุณใส่ไปเมื่อกี้ */}
             <img src="/logo.png" alt="what to do? logo" className="w-64 mx-auto" />
          </div>

          <input 
            className="w-full p-3 border rounded-lg mb-4 text-center" 
            placeholder="ชื่อของคุณ (Acting as...)" 
            value={user} 
            onChange={(e) => setUser(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && user && setIsJoined(true)}
          />
          <button 
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition"
            onClick={() => user && setIsJoined(true)}
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  // --- หน้า Dashboard ---
  return (
    <div className="container">
      
      {/* Header */}
      <header className="flex justify-between items-center my-6">
        <img src="/logo.png" alt="Logo" className="w-32" />
        <div className="bg-indigo-50 px-4 py-2 rounded-lg">
            <span className="text-gray-600 mr-2">👤 Acting as:</span>
            <span className="font-bold text-gray-800">{user}</span>
        </div>
      </header>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="เพิ่มงานใหม่..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button 
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-sm transition"
        >
          Add Task
        </button>
      </div>

      <ul className="list-none p-0">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item status-${task.status}`}>
            
            {/* Dropdown เลือกสถานะ */}
            <select 
              className={`status-selector ${task.status}`}
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
            >
              <option value="todo">⏳ รอดำเนินการ</option>
              <option value="in_progress">🚧 กำลังทำ</option>
              <option value="done">✅ เสร็จสิ้น</option>
            </select>

            <div className="task-content">
              {editingId === task.id ? (
                // โหมดแก้ไข
                <div className="flex gap-2">
                    <input 
                      className="flex-grow p-1 border rounded" 
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                    />
                    {/* ปุ่ม Save/Cancel แบบข้อความ */}
                    <button onClick={() => saveEdit(task.id)} className="text-green-600 font-bold hover:underline">[Save]</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500 hover:underline">[Cancel]</button>
                </div>
              ) : (
                // โหมดแสดงผลปกติ
                <>
                    <div className="task-text font-medium text-lg">{task.title}</div>
                    <div className="task-meta">
                        <span className="badge">{task.createdBy}</span>
                        <span>{new Date(task.createdAt).toLocaleString('th-TH')}</span>
                    </div>
                </>
              )}
            </div>

            {/* --- [จุดที่แก้ไข] เปลี่ยนปุ่มเป็นข้อความ [Edit] และ [Del] --- */}
            <div className="flex gap-1 ml-4 font-mono text-sm">
               {editingId !== task.id && (
                  <button 
                    onClick={() => startEditing(task.id, task.title)}
                    className="text-black font-bold hover:underline"
                  >
                    [Edit]
                  </button>
               )}
               <button 
                  onClick={() => handleDelete(task.id)}
                  className="text-black font-bold hover:underline"
               >
                  [Del]
               </button>
            </div>
            {/* -------------------------------------------------------- */}

          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
