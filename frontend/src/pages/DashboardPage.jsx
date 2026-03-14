import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { BackgroundPaths } from '@/components/ui/background-paths';

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    try {
      console.log("Creating task:", newTaskTitle);
      const response = await api.post('/tasks', { title: newTaskTitle, status: 'pending', priority: 'medium' });
      console.log("Task created successfully:", response.data);
      setNewTaskTitle('');
      fetchTasks();
    } catch (error) {
       console.error("Failed to create task", error.response?.data || error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
       console.error("Failed to delete task", error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
      try {
        await api.put(`/tasks/${taskId}`, { status: newStatus });
        fetchTasks();
      } catch (error) {
         console.error("Failed to update task", error);
      }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading tasks...</div>;

  return (
    <BackgroundPaths>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tasks</h1>
                
                {/* Create Task Form */}
                <form onSubmit={handleCreateTask} className="mb-8 flex gap-4">
                    <input 
                        type="text" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-3 bg-white/80 backdrop-blur-sm"
                    />
                    <button 
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Plus className="h-5 w-5 mr-1" /> Add Task
                    </button>
                </form>

                {/* Task List */}
                <div className="bg-white/80 backdrop-blur-sm shadow overflow-hidden sm:rounded-md border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {tasks.length === 0 ? (
                        <li className="px-6 py-12 text-center text-gray-500">
                            No tasks found. Create one above!
                        </li>
                    ) : tasks.map((task) => (
                    <li key={task.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center flex-1">
                            <input 
                                type="checkbox" 
                                checked={task.status === 'completed'}
                                onChange={(e) => handleUpdateTaskStatus(task.id, e.target.checked ? 'completed' : 'pending')}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                            />
                            <div className="ml-4">
                                <p className={`text-sm font-medium text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                    {task.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Priority: <span className="capitalize">{task.priority}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                        <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 hover:text-red-900 p-2">
                            <Trash2 className="h-5 w-5" />
                        </button>
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
    </BackgroundPaths>
  );
}
