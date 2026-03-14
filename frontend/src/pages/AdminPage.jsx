import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Shield, Trash2, Edit2, Users } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [usersResponse, tasksResponse] = await Promise.all([
        api.get('/auth/users'),
        api.get('/tasks')
      ]);
      setUsers(usersResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
       console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchData(); // Refresh tasks
    } catch (error) {
       console.error("Failed to delete task", error);
    }
  };

  if (loading || !user || user.role !== 'admin') {
      return null; // Return null while checking auth or loading
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Users List */}
            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" /> All Users
                </h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <li key={u.id} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-900">{u.name}</p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                            {u.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>

            {/* All Tasks */}
             <div>
                <h2 className="text-xl font-semibold mb-4">All System Tasks</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {tasks.length === 0 ? (
                         <li className="px-6 py-4 text-center text-gray-500">No tasks in the system.</li>
                     ) : tasks.map((task) => {
                         const owner = users.find(u => u.id === task.owner_id);
                         return (
                          <li key={task.id} className="px-6 py-4 flex items-center justify-between">
                             <div className="flex flex-col">
                                 <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                 <p className="text-xs text-gray-500">
                                    Owner: {owner ? owner.email : 'Unknown'} • Status: {task.status}
                                 </p>
                             </div>
                             <div className="flex items-center gap-3">
                                <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 hover:text-red-900 p-2">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                             </div>
                          </li>
                        )
                    })}
                  </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
