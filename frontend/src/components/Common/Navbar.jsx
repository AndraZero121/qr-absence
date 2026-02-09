import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import logo from '../../assets/logo.png';
import CustomAlert from './CustomAlert';

function Navbar({ showLogout = false, userName = '', user_role = '', toggleSidebar, isSidebarOpen }) {
    const navigate = useNavigate();
    const [alertState, setAlertState] = useState({
        show: false,
        type: 'confirm',
        title: '',
        message: ''
    });
    const [userInfo, setUserInfo] = useState({ name: '', role: '' });

    useEffect(() => {
        if (userName && user_role) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUserInfo({ name: userName, role: user_role });
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
    }, [userName, user_role]);

    const handleLogoutClick = () => {
        setAlertState({
            show: true,
            type: 'confirm',
            title: 'Konfirmasi Keluar',
            message: 'Apakah Anda yakin ingin keluar dari aplikasi?'
        });
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <>
            <nav className="navbar glass-navbar" role="navigation">
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

                    {/* Desktop User Section */}
                    <div className="nav-right desktop-only">
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
                    <button className="mobile-toggle" onClick={toggleSidebar}>
                        {isSidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </nav>

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