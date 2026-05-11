import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LocationContext from '../context/LocationContext';
import { api } from '../services/api';
import { CreditCard, Smartphone, CheckCircle, MapPin, Plus, Home, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import AddressModal from '../components/AddressModal';

function Payment() {
    const { user, authTokens } = useContext(AuthContext);
    const { userLocation } = useContext(LocationContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Fallback if they hit /payment directly without cart
    const cart = location.state?.cart || [];
    const itemTotal = location.state?.totalAmount || 0;
    const deliveryFee = itemTotal > 0 ? 40 : 0;
    const taxes = itemTotal * 0.05;
    const grandTotal = itemTotal + deliveryFee + taxes;
    
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const restaurants = new Set(cart.map(item => item.restaurant_id)).size || 1;
    
    const [method, setMethod] = useState('card'); // 'card' or 'upi'
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isChangingAddress, setIsChangingAddress] = useState(false);

    // Fetch user profile to get saved addresses
    useState(() => {
        if (user) {
            api.get('/auth/me/').then(res => {
                const fetchedAddresses = res.data.addresses || [];
                setAddresses(fetchedAddresses);
                const defaultAddr = fetchedAddresses.find(a => a.is_default);
                if (defaultAddr) {
                    setSelectedAddress(defaultAddr);
                } else if (fetchedAddresses.length > 0) {
                    setSelectedAddress(fetchedAddresses[0]);
                }
            }).catch(err => console.error(err));
        }
    }, [user]);

    const handleAddressSave = () => {
        api.get('/auth/me/').then(res => {
            const fetchedAddresses = res.data.addresses || [];
            setAddresses(fetchedAddresses);
            const defaultAddr = fetchedAddresses.find(a => a.is_default);
            if (defaultAddr) {
                setSelectedAddress(defaultAddr);
            } else if (fetchedAddresses.length > 0) {
                setSelectedAddress(fetchedAddresses[fetchedAddresses.length - 1]);
            }
        });
    };

    if (cart.length === 0 && !success) {
        return (
            <div style={{ paddingTop: '100px', textAlign: 'center' }}>
                <h2>No items to checkout!</h2>
                <button className="btn-primary" onClick={() => navigate('/home')} style={{ marginTop: '24px' }}>Back to Home</button>
            </div>
        );
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        try {
            const deliveryAddressStr = selectedAddress 
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}` 
                : (userLocation || "Default Delivery Address");

            // 1. Convert Cart into an Order natively from backend
            const { data: order } = await api.post('/orders/place_order/', {
                user_name: user?.username || 'Guest',
                user_address: deliveryAddressStr,
                user_phone: user ? 'user_phone_detect' : ''
            });
            
            if (method === 'cod') {
                setSuccess(true);
                window.dispatchEvent(new Event('clearCart'));
                setTimeout(() => navigate('/home'), 3000);
                return;
            }

            // 2. Initialize Razorpay Payment
            const { data: rzpay } = await api.post('/payment/create/', { order_id: order.id });

            if (rzpay.key_id === 'fake_key_id') {
                // Mock verification for dummy keys
                await api.post('/payment/verify/', {
                    razorpay_order_id: rzpay.razorpay_order_id,
                    razorpay_payment_id: "fake_payment_id",
                    razorpay_signature: "fake_signature"
                });
                setSuccess(true);
                window.dispatchEvent(new Event('clearCart'));
                setTimeout(() => navigate('/home'), 3000);
                return;
            }

            // 3. Open Razorpay Overlay
            const options = {
                key: rzpay.key_id,
                amount: rzpay.amount,
                currency: rzpay.currency,
                order_id: rzpay.razorpay_order_id,
                name: "CraveBites",
                description: "Food Order Payment",
                handler: async function (response) {
                    try {
                        // 4. Verify Payment securely
                        await api.post('/payment/verify/', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        setSuccess(true);
                        window.dispatchEvent(new Event('clearCart'));
                        setTimeout(() => navigate('/home'), 3000);
                    } catch (verifyError) {
                        toast.error(verifyError.response?.data?.error || "Payment Verification Failed");
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                    }
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
            
        } catch (err) {
            setIsProcessing(false);
            toast.error(err.response?.data?.error || "Transaction Initialization Failed");
        }
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <CheckCircle size={80} color="#34C759" className="animate-fade-up" />
                <h1 style={{ marginTop: '24px', fontSize: '32px', fontWeight: '800' }}>Payment Successful!</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Your food is being prepared. Redirecting to home...</p>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--background)' }}>
            <div className="container" style={{ maxWidth: '800px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
                
                {/* Payment Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Delivery Address Section */}
                    <div style={{ background: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Delivery Address</h2>
                            {addresses.length > 0 && !isChangingAddress && (
                                <button onClick={() => setIsChangingAddress(true)} style={{ color: 'var(--primary)', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}>CHANGE</button>
                            )}
                        </div>

                        {isChangingAddress ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {addresses.map(addr => (
                                    <div 
                                        key={addr.id} 
                                        onClick={() => { setSelectedAddress(addr); setIsChangingAddress(false); }}
                                        style={{ border: `1px solid ${selectedAddress?.id === addr.id ? 'var(--primary)' : 'var(--border)'}`, padding: '16px', borderRadius: '12px', cursor: 'pointer', background: selectedAddress?.id === addr.id ? '#fff0ed' : 'white' }}
                                    >
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <div style={{ marginTop: '2px' }}>
                                                {addr.label === 'home' ? <Home size={20} color={selectedAddress?.id === addr.id ? 'var(--primary)' : 'var(--text-muted)'} /> : addr.label === 'work' ? <Briefcase size={20} color={selectedAddress?.id === addr.id ? 'var(--primary)' : 'var(--text-muted)'} /> : <MapPin size={20} color={selectedAddress?.id === addr.id ? 'var(--primary)' : 'var(--text-muted)'} />}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: '0 0 4px 0', textTransform: 'capitalize', color: selectedAddress?.id === addr.id ? 'var(--primary)' : 'var(--text-main)' }}>{addr.label}</h4>
                                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>{addr.street}, {addr.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => setIsAddressModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', background: 'transparent', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', justifyContent: 'center' }}>
                                    <Plus size={18} /> Add New Address
                                </button>
                                <button onClick={() => setIsChangingAddress(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '600', marginTop: '8px' }}>Cancel</button>
                            </div>
                        ) : selectedAddress ? (
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '50%' }}>
                                    {selectedAddress.label === 'home' ? <Home size={24} color="var(--text-main)" /> : selectedAddress.label === 'work' ? <Briefcase size={24} color="var(--text-main)" /> : <MapPin size={24} color="var(--text-main)" />}
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', textTransform: 'capitalize' }}>{selectedAddress.label}</h3>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{selectedAddress.street}</p>
                                    <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-muted)' }}>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No delivery address selected.</p>
                                <button onClick={() => setIsAddressModalOpen(true)} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <Plus size={18} /> Add Delivery Address
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Choose Payment Method</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        <div 
                            onClick={() => setMethod('card')}
                            style={{ border: `2px solid ${method === 'card' ? 'var(--primary)' : 'var(--border)'}`, padding: '16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: method === 'card' ? 'var(--primary-light)' : 'white' }}>
                            <CreditCard size={20} color={method === 'card' ? 'var(--primary)' : 'var(--text-muted)'} />
                            <span style={{ fontWeight: '600', fontSize: '14px', color: method === 'card' ? 'var(--primary)' : 'var(--text-main)' }}>Card</span>
                        </div>
                        <div 
                            onClick={() => setMethod('upi')}
                            style={{ border: `2px solid ${method === 'upi' ? 'var(--primary)' : 'var(--border)'}`, padding: '16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: method === 'upi' ? 'var(--primary-light)' : 'white' }}>
                            <Smartphone size={20} color={method === 'upi' ? 'var(--primary)' : 'var(--text-muted)'} />
                            <span style={{ fontWeight: '600', fontSize: '14px', color: method === 'upi' ? 'var(--primary)' : 'var(--text-main)' }}>UPI</span>
                        </div>
                        <div 
                            onClick={() => setMethod('cod')}
                            style={{ border: `2px solid ${method === 'cod' ? 'var(--primary)' : 'var(--border)'}`, padding: '16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: method === 'cod' ? 'var(--primary-light)' : 'white' }}>
                            <span style={{ fontWeight: '800', fontSize: '14px', color: method === 'cod' ? 'var(--primary)' : 'var(--text-muted)' }}>💵</span>
                            <span style={{ fontWeight: '600', fontSize: '14px', color: method === 'cod' ? 'var(--primary)' : 'var(--text-main)' }}>COD</span>
                        </div>
                    </div>

                    <form onSubmit={handlePayment}>
                        {method === 'card' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input type="text" placeholder="Card Number (Dummy)" required style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: '#FAFAFA', fontSize: '16px' }} />
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <input type="text" placeholder="MM/YY" required style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: '#FAFAFA', fontSize: '16px' }} />
                                    <input type="text" placeholder="CVV" required style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: '#FAFAFA', fontSize: '16px' }} />
                                </div>
                                <input type="text" placeholder="Cardholder Name" required style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: '#FAFAFA', fontSize: '16px' }} />
                            </div>
                        )}
                        {method === 'upi' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input type="text" placeholder="Enter UPI ID (Dummy)" required style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: '#FAFAFA', fontSize: '16px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>A payment request will be simulated.</p>
                            </div>
                        )}
                        {method === 'cod' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '24px', background: '#FAFAFA', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <p style={{ color: 'var(--text-main)', fontSize: '16px', fontWeight: '500' }}>You selected Cash on Delivery.</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Please keep exact change ready upon delivery.</p>
                            </div>
                        )}
                        
                        <button type="submit" disabled={isProcessing} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '18px', marginTop: '32px', opacity: isProcessing ? 0.7 : 1 }}>
                            {isProcessing ? 'Processing Transaction...' : `Pay ₹${grandTotal.toFixed(2)}`}
                        </button>
                    </form>
                </div>
                </div>

                {/* Order Summary Sidebar */}
                <div style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Order Summary</h3>
                    {userLocation && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', background: 'var(--primary-light)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)' }}>Delivering to: {userLocation}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span>{item.quantity}x {item.name}</span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ paddingBottom: '16px', borderBottom: '1px dashed var(--border)', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                            <span>Item Total ({itemCount} items)</span>
                            <span>₹{itemTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
                            <span>Taxes & Charges (5%)</span>
                            <span>₹{taxes.toFixed(2)}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                        <span>To Pay</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>

            </div>
            
            <AddressModal 
                isOpen={isAddressModalOpen} 
                onClose={() => setIsAddressModalOpen(false)} 
                onSave={handleAddressSave}
            />
        </div>
    );
}

export default Payment;
