import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { CreditCard, Smartphone, CheckCircle } from 'lucide-react';

function Payment() {
    const { user, authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Fallback if they hit /payment directly without cart
    const cart = location.state?.cart || [];
    const totalAmount = location.state?.totalAmount || 0;
    
    const [method, setMethod] = useState('card'); // 'card' or 'upi'
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

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
        
        // Simulate network delay
        setTimeout(async () => {
            try {
                const payload = {
                    user_name: user?.username || 'Guest',
                    user_address: "Default Delivery Address",
                    items: cart.map(item => ({
                        menu_item_id: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                };
                await axios.post('http://localhost:8000/api/orders/place_order/', payload, {
                    headers: { 'Authorization': `Bearer ${authTokens?.access}` }
                });
                setIsProcessing(false);
                setSuccess(true);
                window.dispatchEvent(new Event('clearCart'));
                
                // Allow user to see success checkmark, then redirect
                setTimeout(() => navigate('/home'), 3000);
            } catch (err) {
                setIsProcessing(false);
                alert("Payment Failed - Server Error");
            }
        }, 1500);
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
                            {isProcessing ? 'Processing Transaction...' : `Pay ₹${totalAmount.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Order Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span>{item.quantity}x {item.name}</span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                        <span>Item Total</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '16px', color: 'var(--text-muted)' }}>
                        <span>Delivery Fee</span>
                        <span>₹40.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700' }}>
                        <span>To Pay</span>
                        <span>₹{(totalAmount + 40).toFixed(2)}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Payment;
