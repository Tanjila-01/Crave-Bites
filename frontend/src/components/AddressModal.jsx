import React, { useState, useEffect } from 'react';
import { X, MapPin, Home, Briefcase, Navigation } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AddressModal = ({ isOpen, onClose, addressToEdit, onSave, autoDetectLocation }) => {
    const [formData, setFormData] = useState({
        label: 'home',
        house_no: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        phone_number: '',
        latitude: 12.9716, // Default Bangalore
        longitude: 77.5946,
        is_default: false
    });
    const [isDetecting, setIsDetecting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (addressToEdit) {
                setFormData(addressToEdit);
            } else {
                setFormData({
                    label: 'home',
                    house_no: '',
                    street: '',
                    landmark: '',
                    city: autoDetectLocation ? autoDetectLocation.city || '' : '',
                    state: '',
                    pincode: '',
                    phone_number: '',
                    latitude: 12.9716,
                    longitude: 77.5946,
                    is_default: false
                });
            }
        }
    }, [isOpen, addressToEdit, autoDetectLocation]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({ ...prev, latitude, longitude }));
                
                try {
                    // Reverse geocoding (mocked or simple fetch could be used here)
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    
                    if (data && data.address) {
                        setFormData(prev => ({
                            ...prev,
                            street: prev.street || data.address.road || data.address.suburb || '',
                            city: data.address.city || data.address.state_district || '',
                            state: data.address.state || '',
                            pincode: data.address.postcode || ''
                        }));
                        toast.success('Location detected!');
                    }
                } catch (error) {
                    toast.error('Could not detect address details. Please enter manually.');
                } finally {
                    setIsDetecting(false);
                }
            },
            () => {
                toast.error('Unable to retrieve your location');
                setIsDetecting(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic Validation
        if (!formData.street || !formData.city || !formData.state || !formData.pincode) {
            toast.error('Please fill all required fields');
            return;
        }
        if (formData.pincode.length < 5 || formData.pincode.length > 10) {
            toast.error('Please enter a valid pincode');
            return;
        }
        if (formData.phone_number && formData.phone_number.length < 9) {
            toast.error('Please enter a valid phone number');
            return;
        }
        
        try {
            if (addressToEdit) {
                const res = await api.put(`/auth/addresses/${addressToEdit.id}/`, formData);
                toast.success('Address updated!');
                onSave(res.data);
            } else {
                const res = await api.post('/auth/addresses/', formData);
                toast.success('Address saved!');
                onSave(res.data);
            }
            onClose();
        } catch (error) {
            toast.error('Failed to save address');
            console.error(error);
        }
    };

    return (
        <>
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={onClose}></div>
            <div style={{ 
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                background: 'white', width: '90%', maxWidth: '500px', borderRadius: '16px', 
                zIndex: 1001, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' 
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>{addressToEdit ? 'Edit Address' : 'Add New Address'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="var(--text-muted)" /></button>
                </div>

                <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
                    <button 
                        type="button" 
                        onClick={handleDetectLocation}
                        disabled={isDetecting}
                        style={{ 
                            width: '100%', padding: '12px', background: '#fff0ed', color: 'var(--primary)', 
                            border: '1px solid var(--primary-light)', borderRadius: '8px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            fontWeight: '600', cursor: 'pointer', marginBottom: '24px'
                        }}
                    >
                        <Navigation size={18} />
                        {isDetecting ? 'Detecting...' : 'Use Current Location'}
                    </button>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>House / Flat / Block No.</label>
                                <input 
                                    name="house_no"
                                    value={formData.house_no || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. Flat 302"
                                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '15px' }}
                                />
                            </div>
                            <div style={{ flex: 2 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Street / Area *</label>
                                <input 
                                    required
                                    name="street"
                                    value={formData.street || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. Green Residency, HSR Layout"
                                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '15px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Landmark (Optional)</label>
                            <input 
                                name="landmark"
                                value={formData.landmark || ''}
                                onChange={handleChange}
                                placeholder="e.g. Near Apollo Hospital"
                                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '15px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>City</label>
                                <input 
                                    required
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="e.g. Bangalore"
                                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '15px' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>State</label>
                                <input 
                                    required
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="e.g. Karnataka"
                                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '15px' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Pincode *</label>
                                <input 
                                    required
                                    name="pincode"
                                    value={formData.pincode || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. 560102"
                                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '15px' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Phone Number</label>
                                <input 
                                    name="phone_number"
                                    value={formData.phone_number || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. 9876543210"
                                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '15px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '14px' }}>Save As</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {['home', 'work', 'other'].map(type => (
                                    <label key={type} style={{ 
                                        flex: 1, padding: '12px', border: `1px solid ${formData.label === type ? 'var(--primary)' : 'var(--border)'}`, 
                                        borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                                        background: formData.label === type ? '#fff0ed' : 'white',
                                        color: formData.label === type ? 'var(--primary)' : 'var(--text-main)',
                                        fontWeight: formData.label === type ? '700' : '500'
                                    }}>
                                        <input 
                                            type="radio" 
                                            name="label" 
                                            value={type} 
                                            checked={formData.label === type} 
                                            onChange={handleChange}
                                            style={{ display: 'none' }}
                                        />
                                        {type === 'home' ? <Home size={18} /> : type === 'work' ? <Briefcase size={18} /> : <MapPin size={18} />}
                                        <span style={{ textTransform: 'capitalize' }}>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '8px' }}>
                            <input 
                                type="checkbox" 
                                name="is_default"
                                checked={formData.is_default}
                                onChange={handleChange}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                            />
                            <span style={{ fontWeight: '500' }}>Make this my default address</span>
                        </label>

                        <button type="submit" style={{ 
                            width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', 
                            border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', 
                            cursor: 'pointer', marginTop: '16px' 
                        }}>
                            Save Address
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddressModal;
