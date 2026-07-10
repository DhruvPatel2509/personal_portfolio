import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Loader from './components/ui/Loader';
import ScrollProgress from './components/ui/ScrollProgress';
import ProtectedRoute from './components/admin/ProtectedRoute';

import Home from './pages/Home';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AboutManage from './pages/admin/AboutManage';
import SkillsManage from './pages/admin/SkillsManage';
import ProjectsManage from './pages/admin/ProjectsManage';
import EducationManage from './pages/admin/EducationManage';
import ExperienceManage from './pages/admin/ExperienceManage';
import CertificatesManage from './pages/admin/CertificatesManage';
import AchievementsManage from './pages/admin/AchievementsManage';
import CodingProfilesManage from './pages/admin/CodingProfilesManage';
import MessagesManage from './pages/admin/MessagesManage';
import SettingsManage from './pages/admin/SettingsManage';
import ResumeImportManage from './pages/admin/ResumeImportManage';

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Brief, deliberate splash so the loading animation is perceptible
    // rather than flashing instantly on fast connections.
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) return <Loader />;

  return (
    <AuthProvider>
      <ScrollProgress />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="resume-import" element={<ResumeImportManage />} />
          <Route path="about" element={<AboutManage />} />
          <Route path="skills" element={<SkillsManage />} />
          <Route path="projects" element={<ProjectsManage />} />
          <Route path="education" element={<EducationManage />} />
          <Route path="experience" element={<ExperienceManage />} />
          <Route path="certificates" element={<CertificatesManage />} />
          <Route path="achievements" element={<AchievementsManage />} />
          <Route path="coding-profiles" element={<CodingProfilesManage />} />
          <Route path="messages" element={<MessagesManage />} />
          <Route path="settings" element={<SettingsManage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
