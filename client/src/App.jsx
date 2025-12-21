import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/guard/ProtectedRoute';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Vision from './pages/public/Vision';
import Awareness from './pages/public/Awareness';
import AnonymousQuestions from './pages/public/AnonymousQuestions';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/member/Dashboard';
import Events from './pages/member/Events';
import Gallery from './pages/member/Gallery';
import Stories from './pages/member/Stories';
import Resources from './pages/member/Resources';
import Profile from './pages/member/Profile';

import AdminRoute from './components/guard/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMembers from './pages/admin/ManageMembers';
import ManageEvents from './pages/admin/ManageEvents';
import ManageGallery from './pages/admin/ManageGallery';
import ManageStories from './pages/admin/ManageStories';
import ManageQuestions from './pages/admin/ManageQuestions';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/questions" element={<AnonymousQuestions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Member Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/member" element={<Dashboard />} />
            <Route path="/member/events" element={<Events />} />
            <Route path="/member/gallery" element={<Gallery />} />
            <Route path="/member/stories" element={<Stories />} />
            <Route path="/member/resources" element={<Resources />} />
            <Route path="/member/profile" element={<Profile />} />
            <Route path="/member/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/members" element={<ManageMembers />} />
            <Route path="/admin/events" element={<ManageEvents />} />
            <Route path="/admin/gallery" element={<ManageGallery />} />
            <Route path="/admin/stories" element={<ManageStories />} />
            <Route path="/admin/questions" element={<ManageQuestions />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<div className="container mt-5"><h1>404 - Page Not Found</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;
