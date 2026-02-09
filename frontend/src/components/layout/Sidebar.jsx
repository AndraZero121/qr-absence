import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaChevronRight,
  FaHome,
  FaBriefcase,
  FaCalendarAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaShieldAlt,
  FaBook,
  FaHistory
} from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen, links = [], userRole = '', userName = '' }) => {
  /* location removed */
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: '', role: '' });

  useEffect(() => {
    if (userName && userRole) {
      if (userInfo.name !== userName || userInfo.role !== userRole) {
        setUserInfo({ name: userName, role: userRole });
      }
    } else {
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUserInfo({
            name: userData.name || 'User',
            role: localStorage.getItem('user_role') || ''
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, userRole]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_data');
    sessionStorage.clear();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    const roles = {
      'admin': { label: 'Administrator', bg: 'bg-red-50', text: 'text-red-500' },
      'waka': { label: 'Waka Kesiswaan', bg: 'bg-indigo-50', text: 'text-indigo-500' },
      'guru': { label: 'Guru Mata Pelajaran', bg: 'bg-blue-50', text: 'text-blue-500' },
      'siswa': { label: 'Peserta Didik', bg: 'bg-cyan-50', text: 'text-cyan-500' },
      'wakel': { label: 'Wali Kelas', bg: 'bg-emerald-50', text: 'text-emerald-500' },
      'pengurus_kelas': { label: 'Pengurus Kelas', bg: 'bg-orange-50', text: 'text-orange-500' },
    };
    return roles[role] || { label: role, bg: 'bg-gray-50', text: 'text-gray-500' };
  };

  const badge = getRoleBadge(userInfo.role);

  return (
    <aside className={`
      fixed lg:sticky top-[80px] h-[calc(100vh-80px)] z-40 bg-white/95 backdrop-blur-xl border-r border-gray-200 transition-all duration-500 ease-in-out flex flex-col
      ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}
    `}>
      {/* Toggle Button Inside Sidebar for Desktop */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 bg-indigo-600 text-white rounded-full items-center justify-center shadow-lg hover:bg-indigo-700 transition-all z-10"
      >
        <FaChevronRight className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`} size={12} />
      </button>

      {/* Profile Area */}
      <div className={`p-8 border-b border-gray-100 flex flex-col items-center transition-opacity duration-300 overflow-hidden ${!isOpen && 'lg:opacity-0 lg:pointer-events-none'}`}>
        <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-400 mb-4 shadow-inner ring-4 ring-white">
          <FaUser size={30} />
        </div>
        <h2 className="font-black text-gray-800 text-md text-center leading-tight truncate w-full">{userInfo.name}</h2>
        <p className={`text-[9px] font-black uppercase tracking-[0.15em] mt-2 px-3 py-1 rounded-full whitespace-nowrap ${badge.bg} ${badge.text}`}>
          {badge.label}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 custom-scrollbar">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group relative
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <span className={`text-xl transition-transform group-hover:scale-110`}>
              {/* Optional: Add icon mapping based on label if icons not provided */}
              {item.icon || <FaHome />}
            </span>
            <AnimatePresence>
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!isOpen && (
              <div className="hidden lg:group-hover:block absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-4 w-full px-4 py-3.5 text-xs font-black text-red-600 hover:bg-red-50 rounded-2xl transition-all uppercase tracking-widest ${!isOpen && 'lg:justify-center'}`}
        >
          <FaSignOutAlt className="text-xl" />
          <AnimatePresence>
            {isOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Keluar
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
