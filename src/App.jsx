import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Academics from './pages/Academics'
import Careers from './pages/Careers'
import Skills from './pages/Skills'
import Jobs from './pages/Jobs'
import Productivity from './pages/Productivity'
import Courses from './pages/Courses'
import AITutor from './pages/AITutor'
import Profile from './pages/Profile'


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Protected routes — require login */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/academics" element={<ProtectedRoute><Academics /></ProtectedRoute>} />
          <Route path="/careers" element={<ProtectedRoute><Careers /></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/productivity" element={<ProtectedRoute><Productivity /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}