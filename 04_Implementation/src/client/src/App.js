import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// เชื่อมต่อ Server Backend
const socket = io('http://localhost:5000');

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // รับข้อมูลเริ่มต้น
    socket.on('initTasks', (initialTasks) => {
      setTasks(initialTasks);
    });

    // รับ Event งานใหม่
    socket.on('taskAdded', (newTask) => {
      setTasks((prev) => [...prev, newTask]);
    });

    // รับ Event อัปเดตงาน
    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    });

    // รับ Event ลบงาน
    socket.on('taskDeleted', (deletedId) => {
      setTasks((prev) => prev.filter(t => t.id !== deletedId));
    });

    return () => socket.off(); // Cleanup
  }, []);

  // ฟังก์ชันส่งข้อมูล
  const handleAddTask = () => {
    if (input.trim()) {
      socket.emit('addTask', { title: input, user: user });
      setInput('');
    }
  };

  const handleToggle = (id) => {
    socket.emit('toggleTask', id);
  };

  const handleDelete = (id) => {
    socket.emit('deleteTask', id);
  };

  // หน้า Login ง่ายๆ
  if (!isJoined) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
          <h1 className="text-2xl font-bold mb-4">Join Room</h1>
          <input 
            className="border p-2 w-full mb-4 rounded" 
            placeholder="Enter nickname..." 
            value={user} 
            onChange={(e) => setUser(e.target.value)} 
          />
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
            onClick={() => user && setIsJoined(true)}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // หน้า Dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header */}
        <header className="bg-blue-600 p-6 flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold">Real-time To-Do</h1>
          <div className="text-right">
            <p className="text-sm">User: {user}</p>
            <div className="flex items-center justify-end gap-2 text-xs text-blue-200">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span> Online
            </div>
          </div>
        </header>

        {/* Input */}
        <div className="p-6 border-b bg-gray-50 flex gap-4">
          <input
            className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button 
            onClick={handleAddTask}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        {/* List */}
        <div className="p-6 space-y-3">
          {tasks.length === 0 && <p className="text-center text-gray-400">No tasks yet.</p>}
          
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition group">
              <div className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  checked={task.isCompleted}
                  onChange={() => handleToggle(task.id)}
                  className="w-5 h-5 cursor-pointer accent-green-500"
                />
                <div>
                  <p className={`text-lg ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400">Created by: {task.createdBy}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(task.id)}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
