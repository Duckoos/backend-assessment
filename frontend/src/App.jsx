import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import { LogOut, User as UserIcon } from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

// Layout component with Navigation
const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    
    return (
        <div className="min-h-screen bg-gray-50">
            {user && (
                <nav className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold text-indigo-600">TaskFlow App</h1>
                                <div className="ml-10 flex items-baseline space-x-4">
                                     <a href="/dashboard" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Dashboard</a>
                                     {user.role === 'admin' && (
                                         <a href="/admin" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Admin Area</a>
                                     )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <UserIcon className="h-5 w-5" />
                                    <span className="text-sm font-medium">{user.name}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                >
                                    <LogOut className="h-4 w-4 mr-1.5" /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            )}
            <main>
                {children}
            </main>
        </div>
    )
}

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    </AuthProvider>
  )
}

export default App
