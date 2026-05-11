import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import AuthContext from '../context/AuthContext';
import AddressModal from '../components/AddressModal';
import { User, MapPin, Phone, Mail, Clock, Plus, Edit2, Trash2, Home, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'profile';
    
    const [activeTab, setActiveTab] = useState(initialTab);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState(null);

    // Phone editing state
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [editPhoneValue, setEditPhoneValue] = useState('');
    const [isSavingPhone, setIsSavingPhone] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/me/');
            setProfile(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile', error);
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/auth/addresses/${id}/`);
            toast.success('Address deleted');
            fetchProfile(); // Refresh
        } catch (error) {
            toast.error('Failed to delete address');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await api.post(`/auth/addresses/${id}/set_default/`);
            toast.success('Default address updated');
            fetchProfile();
        } catch (error) {
            toast.error('Failed to set default address');
        }
    };

    const handleSavePhone = async () => {
        if (!editPhoneValue || editPhoneValue.length < 9) {
            toast.error('Please enter a valid phone number (min 9 digits)');
            return;
        }
        setIsSavingPhone(true);
        try {
            const res = await api.put('/auth/me/update/', { phone_number: editPhoneValue });
            setProfile(res.data);
            setIsEditingPhone(false);
            toast.success('Phone number updated successfully!');
        } catch (error) {
            console.error('Failed to update phone number', error);
            toast.error(error.response?.data?.phone_number?.[0] || 'Failed to update phone number');
        } finally {
            setIsSavingPhone(false);
        }
    };


    const handleAddressSave = () => {
        fetchProfile();
    };

    const openAddressModal = (address = null) => {
        setAddressToEdit(address);
        setIsAddressModalOpen(true);
    };

    if (loading) return <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    if (!profile) return <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Please log in.</div>;

    const getIcon = (label) => {
        if (label === 'home') return <Home size={20} color="var(--primary)" />;
        if (label === 'work') return <Briefcase size={20} color="var(--primary)" />;
        return <MapPin size={20} color="var(--primary)" />;
    };

    const getInitials = () => {
        if (profile?.user?.first_name && profile?.user?.last_name) {
            return `${profile.user.first_name[0]}${profile.user.last_name[0]}`.toUpperCase();
        }
        if (profile?.user?.first_name) {
            return profile.user.first_name[0].toUpperCase();
        }
        if (profile?.user?.username) {
            return profile.user.username[0].toUpperCase();
        }
        if (user?.username) {
            return user.username[0].toUpperCase();
        }
        if (profile?.user?.email) {
            return profile.user.email[0].toUpperCase();
        }
        if (user?.email) {
            return user.email[0].toUpperCase();
        }
        return 'U';
    };

    const getFullName = () => {
        if (profile?.user?.first_name) {
            return `${profile.user.first_name} ${profile?.user?.last_name || ''}`.trim();
        }
        return profile?.user?.username || user?.username || 'User';
    };

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
            <style>{`
                .profile-layout {
                    display: flex;
                    gap: 32px;
                    align-items: flex-start;
                }
                .profile-sidebar {
                    width: 280px;
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.04);
                    flex-shrink: 0;
                    position: sticky;
                    top: 100px;
                }
                .profile-main {
                    flex: 1;
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.04);
                }
                .profile-tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 15px;
                    text-align: left;
                    transition: all 0.3s ease;
                }
                .profile-tab-btn:hover:not(.active) {
                    background: #f8f8f8;
                    transform: translateX(4px);
                }
                .profile-tab-btn.active {
                    background: var(--primary-light);
                    color: var(--primary);
                }
                .info-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 24px;
                    border: 1px solid #f0f0f0;
                    border-radius: 16px;
                    transition: all 0.3s ease;
                    background: white;
                }
                .info-card:hover {
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    border-color: #ffe8e0;
                    transform: translateY(-2px);
                }
                .address-card {
                    border-radius: 16px;
                    padding: 24px;
                    position: relative;
                    transition: all 0.3s ease;
                    background: white;
                }
                .address-card:hover {
                    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
                    transform: translateY(-4px);
                }
                .icon-container {
                    background: #f8f8f8;
                    padding: 14px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                .info-card:hover .icon-container {
                    background: var(--primary-light);
                    color: var(--primary);
                }
                @media (max-width: 768px) {
                    .profile-layout {
                        flex-direction: column;
                    }
                    .profile-sidebar {
                        width: 100%;
                        position: static;
                    }
                    .profile-main {
                        padding: 24px;
                    }
                    .info-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .address-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div className="profile-layout">
                    
                    {/* Sidebar */}
                    <div className="profile-sidebar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', padding: '16px', background: 'linear-gradient(135deg, #fff0ed 0%, #fff 100%)', borderRadius: '16px', border: '1px solid #ffe8e0' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #ff8c42 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(255,90,0,0.2)' }}>
                                    {getInitials()}
                                </div>
                                <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '14px', height: '14px', background: '#34c759', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} title="Online"></div>
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getFullName()}</h2>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.user?.email || user?.email || ''}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button 
                                onClick={() => setActiveTab('profile')}
                                className={`profile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                                style={{ color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-main)' }}
                            >
                                <User size={20} /> My Profile
                            </button>
                            <button 
                                onClick={() => setActiveTab('addresses')}
                                className={`profile-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                                style={{ color: activeTab === 'addresses' ? 'var(--primary)' : 'var(--text-main)' }}
                            >
                                <MapPin size={20} /> Saved Addresses
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="profile-main">
                        {activeTab === 'profile' && (
                            <div className="animate-fade-up">
                                <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>My Profile</h1>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>Manage your personal details and account preferences.</p>
                                
                                <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div className="info-card">
                                        <div className="icon-container"><User size={24} color="currentColor" /></div>
                                        <div>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px 0', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Full Name</p>
                                            <p style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>{getFullName()}</p>
                                        </div>
                                    </div>
                                    <div className="info-card">
                                        <div className="icon-container"><Mail size={24} color="currentColor" /></div>
                                        <div>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px 0', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email Address</p>
                                            <p style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: 'var(--text-main)', wordBreak: 'break-all' }}>{profile?.user?.email || user?.email || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="info-card">
                                        <div className="icon-container"><Phone size={24} color="currentColor" /></div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px 0', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Phone Number</p>
                                            {isEditingPhone ? (
                                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                    <input 
                                                        type="tel" 
                                                        value={editPhoneValue} 
                                                        onChange={(e) => setEditPhoneValue(e.target.value)}
                                                        placeholder="Enter phone number"
                                                        style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px', flex: 1, outline: 'none', minWidth: '100px' }}
                                                        autoFocus
                                                    />
                                                    <button disabled={isSavingPhone} onClick={handleSavePhone} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                        {isSavingPhone ? 'Saving...' : 'Save'}
                                                    </button>
                                                    <button onClick={() => setIsEditingPhone(false)} style={{ background: '#f5f5f5', color: 'var(--text-main)', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <p style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: profile.phone_number ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                                        {profile.phone_number || 'Not provided'}
                                                    </p>
                                                    <button 
                                                        onClick={() => {
                                                            setEditPhoneValue(profile?.phone_number || '');
                                                            setIsEditingPhone(true);
                                                        }}
                                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', fontSize: '12px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                                                    >
                                                        {profile?.phone_number ? 'EDIT' : 'ADD'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="info-card">
                                        <div className="icon-container"><Clock size={24} color="currentColor" /></div>
                                        <div>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px 0', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Member Since</p>
                                            <p style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>{profile?.user?.date_joined ? new Date(profile.user.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="animate-fade-up">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Saved Addresses</h1>
                                    <button 
                                        onClick={() => openAddressModal()}
                                        className="btn-primary"
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', boxShadow: '0 4px 12px rgba(255,90,0,0.2)' }}
                                    >
                                        <Plus size={18} /> Add New
                                    </button>
                                </div>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>Manage your delivery locations for a faster checkout.</p>

                                {(!Array.isArray(profile?.addresses) || profile.addresses.length === 0) ? (
                                    <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fafafa', borderRadius: '16px', border: '1px dashed #e0e0e0' }}>
                                        <div style={{ width: '100px', height: '100px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                                            <MapPin size={40} color="var(--primary)" />
                                        </div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)' }}>No Saved Addresses</h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '300px', margin: '0 auto 32px', lineHeight: '1.6' }}>Add a home or work address to enjoy seamless and lightning-fast food delivery.</p>
                                        <button onClick={() => openAddressModal()} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                            <Plus size={18} /> Add Your First Address
                                        </button>
                                    </div>
                                ) : (
                                    <div className="address-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                                        {profile.addresses.map(address => (
                                            <div key={address.id} className="address-card" style={{ border: `1px solid ${address.is_default ? '#ffe8e0' : '#f0f0f0'}`, background: address.is_default ? '#fffdfc' : 'white', boxShadow: address.is_default ? '0 8px 24px rgba(255,90,0,0.06)' : 'none' }}>
                                                {address.is_default && (
                                                    <span style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>DEFAULT</span>
                                                )}
                                                
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                                                    <div style={{ padding: '12px', background: address.is_default ? 'white' : '#f8f8f8', borderRadius: '12px', color: address.is_default ? 'var(--primary)' : 'var(--text-main)', boxShadow: address.is_default ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}>
                                                        {getIcon(address.label)}
                                                    </div>
                                                    <div style={{ flex: 1, paddingRight: address.is_default ? '60px' : '0' }}>
                                                        <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: '800', textTransform: 'capitalize' }}>{address.label}</h3>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6', fontWeight: '500' }}>
                                                            {address.house_no ? `${address.house_no}, ` : ''}{address.street}
                                                        </p>
                                                        {address.landmark && <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-muted)' }}>Landmark: {address.landmark}</p>}
                                                        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-muted)' }}>{address.city}, {address.state} - {address.pincode}</p>
                                                        {address.phone_number && <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', fontWeight: '600' }}>Phone: {address.phone_number}</p>}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '12px', borderTop: '1px dashed #f0f0f0', paddingTop: '20px' }}>
                                                    {!address.is_default && (
                                                        <button 
                                                            onClick={() => handleSetDefault(address.id)}
                                                            style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #e0e0e0', borderRadius: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s' }}
                                                            onMouseOver={e => { e.target.style.background = '#f8f8f8'; e.target.style.borderColor = '#d0d0d0'; }}
                                                            onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#e0e0e0'; }}
                                                        >
                                                            Set Default
                                                        </button>
                                                    )}
                                                    <div style={{ display: 'flex', gap: '12px', flex: address.is_default ? 1 : 0, justifyContent: address.is_default ? 'flex-start' : 'center' }}>
                                                        <button 
                                                            onClick={() => openAddressModal(address)}
                                                            style={{ flex: address.is_default ? 1 : 'none', padding: '10px 16px', background: 'transparent', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '600', fontSize: '13px', color: 'var(--text-main)', transition: 'all 0.2s' }}
                                                            onMouseOver={e => { e.currentTarget.style.background = '#f8f8f8'; }}
                                                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                                                        >
                                                            <Edit2 size={14} /> {address.is_default && 'Edit'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteAddress(address.id)}
                                                            style={{ padding: '10px 16px', background: '#fff1f0', border: '1px solid #ffccc7', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                                            title="Delete"
                                                            onMouseOver={e => { e.currentTarget.style.background = '#ffccc7'; }}
                                                            onMouseOut={e => { e.currentTarget.style.background = '#fff1f0'; }}
                                                        >
                                                            <Trash2 size={16} color="#ff4d4f" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddressModal 
                isOpen={isAddressModalOpen} 
                onClose={() => setIsAddressModalOpen(false)} 
                addressToEdit={addressToEdit}
                onSave={handleAddressSave}
            />
        </div>
    );
};

export default Profile;
