import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, MapPin, ListOrdered, LogOut } from 'lucide-react';

const ProfileDropdown = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleLogout = () => {
        logoutUser();
        setIsOpen(false);
    };

    return (
        <div className="profile-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
            <div 
                className="profile-dropdown-trigger" 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', 
                    padding: '8px 12px', borderRadius: '24px', transition: 'all 0.2s ease',
                    background: isOpen ? '#f1f1f6' : 'transparent', fontWeight: '600', color: 'var(--text-main)'
                }}
            >
                <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '14px'
                }}>
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span>{user?.username || 'User'} ▼</span>
            </div>

            {isOpen && (
                <div className="profile-dropdown-menu" style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '220px',
                    background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    border: '1px solid var(--border)', overflow: 'hidden', zIndex: 1000,
                    animation: 'fadeInDown 0.2s ease forwards'
                }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: '#fafafa' }}>
                        <p style={{ fontWeight: '700', fontSize: '16px', margin: 0, color: 'var(--text-main)' }}>{user?.username || 'User'}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.email || ''}
                        </p>
                    </div>

                    <div style={{ padding: '8px' }}>
                        <button 
                            onClick={() => handleNavigate('/profile')}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', color: 'var(--text-main)', fontWeight: '500', fontSize: '15px' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f5f5fa'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <User size={18} color="var(--primary)" /> My Profile
                        </button>

                        <button 
                            onClick={() => handleNavigate('/profile?tab=addresses')}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', color: 'var(--text-main)', fontWeight: '500', fontSize: '15px' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f5f5fa'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <MapPin size={18} color="var(--primary)" /> Saved Addresses
                        </button>

                        <button 
                            onClick={() => handleNavigate('/orders')}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', color: 'var(--text-main)', fontWeight: '500', fontSize: '15px' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f5f5fa'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <ListOrdered size={18} color="var(--primary)" /> Orders
                        </button>

                        <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }}></div>

                        <button 
                            onClick={handleLogout}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', color: '#ff4d4f', fontWeight: '500', fontSize: '15px' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#fff1f0'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <LogOut size={18} color="#ff4d4f" /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
