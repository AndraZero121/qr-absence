import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import logo from '../../assets/logo.png';
import CustomAlert from './CustomAlert';

function Navbar({ links = [], showLogout = false, userName = '', userRole = '' }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [alertState, setAlertState] = useState({
        show: false,
        type: 'confirm',
        title: '',
        message: ''
    });
    const [userInfo, setUserInfo] = useState({ name: '', role: '' });
    const menuRef = useRef(null);

    useEffect(() => {
        if (userName && userRole) {
            setUserInfo({ name: userName, role: userRole });
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    setUserInfo({
                        name: userData.nama || userData.name || 'User',
                        role: userData.role || userData.jabatan || ''
                    });
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
        }
    }, [userName, userRole]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleLogoutClick = () => {
        setAlertState({
            show: true,
            type: 'confirm',
            title: 'Konfirmasi Keluar',
            message: 'Apakah Anda yakin ingin keluar dari aplikasi?'
        });
        closeMenu();
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <>
            <nav className="navbar" role="navigation">
                <div className="nav-container">
                    <div className="nav-left">
                        <div className="logo-wrapper" onClick={() => navigate('/')}>
                            <img src={logo} alt="Logo SMK" className="logo" />
                        </div>
                        <div className="brand-text">
                            <span className="school-name">SMKN 2 SINGOSARI</span>
                            <span className="app-subtitle">Attendance System</span>
                        </div>
                    </div>

                    {/* Desktop Links */}
                    <div className="nav-right desktop-only">
                        <div className="nav-links">
                            {links.map((link, index) => (
                                <NavLink
                                    key={index}
                                    to={link.to}
                                    className={({ isActive }) => isActive ? "active" : ""}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>

                        {showLogout && (
                            <div className="user-section">
                                <div className="user-info-brief">
                                    <span className="user-name-brief">{userInfo.name}</span>
                                    <span className="user-role-brief">{userInfo.role}</span>
                                </div>
                                <button onClick={handleLogoutClick} className="btn-logout-circle" title="Keluar">
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="mobile-toggle" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Sidebar */}
                <div className={`mobile-sidebar ${isMenuOpen ? 'active' : ''}`}>
                    <div className="mobile-profile">
                        <div className="mobile-avatar">
                            <FaUser />
                        </div>
                        <div className="mobile-user-details">
                            <p className="mobile-user-name">{userInfo.name}</p>
                            <p className="mobile-user-role">{userInfo.role}</p>
                        </div>
                    </div>

                    <div className="mobile-links">
                        {links.map((link, index) => (
                            <NavLink
                                key={index}
                                to={link.to}
                                onClick={closeMenu}
                                className={({ isActive }) => isActive ? "active" : ""}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {showLogout && (
                        <div className="mobile-footer">
                            <button onClick={handleLogoutClick} className="btn-logout-mobile">
                                <FaSignOutAlt />
                                <span>Keluar Aplikasi</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}

            <CustomAlert
                isOpen={alertState.show}
                onClose={() => setAlertState(prev => ({ ...prev, show: false }))}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                onConfirm={handleConfirmLogout}
                confirmLabel="Ya, Keluar"
                cancelLabel="Kembali"
            />
        </>
    );
}

export default Navbar;