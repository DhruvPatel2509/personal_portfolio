import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiUser,
  FiCode,
  FiFolder,
  FiBook,
  FiBriefcase,
  FiAward,
  FiStar,
  FiHash,
  FiMail,
  FiSettings,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/resume-import', label: 'Resume Import', icon: FiFileText },
  { to: '/admin/about', label: 'About', icon: FiUser },
  { to: '/admin/skills', label: 'Skills', icon: FiCode },
  { to: '/admin/projects', label: 'Projects', icon: FiFolder },
  { to: '/admin/education', label: 'Education', icon: FiBook },
  { to: '/admin/experience', label: 'Experience', icon: FiBriefcase },
  { to: '/admin/certificates', label: 'Certificates', icon: FiAward },
  { to: '/admin/achievements', label: 'Achievements', icon: FiStar },
  { to: '/admin/coding-profiles', label: 'Coding Profiles', icon: FiHash },
  { to: '/admin/messages', label: 'Messages', icon: FiMail },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="text-lg font-bold gradient-text">Admin Panel</p>
        <p className="text-xs text-slate-500 mt-1">{admin?.name}</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-white/10 bg-surface/50">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-64 bg-surface z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/10">
          <p className="font-bold gradient-text">Admin Panel</p>
          <button onClick={() => setMobileOpen(true)} className="text-xl">
            <FiMenu />
          </button>
        </header>

        <main className="p-5 sm:p-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed top-4 right-4 z-[60] lg:hidden text-2xl text-white"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default AdminLayout;
