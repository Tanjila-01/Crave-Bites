import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Package, RotateCcw } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

function Orders() {
    const { authTokens } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reorderingId, setReorderingId] = useState(null);
    const navigate = useNavigate();

    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80';
    };

    const getSimulatedStatus = (createdAt) => {
        const diffMins = (new Date() - new Date(createdAt)) / 60000;
        if (diffMins < 2) return { text: 'CONFIRMING', color: '#ff9800', bg: '#fff3e0', step: 1 };
        if (diffMins < 10) return { text: 'PREPARING', color: '#fbc02d', bg: '#fff9c4', step: 2 };
        if (diffMins < 20) return { text: 'OUT FOR DELIVERY', color: '#2196f3', bg: '#e3f2fd', step: 3 };
        return { text: 'DELIVERED', color: '#4caf50', bg: '#e8f5e9', step: 4 };
    };

    const trackerSteps = ['Confirmed', 'Preparing', 'On the Way', 'Delivered'];

    const handleReorder = async (order) => {
        setReorderingId(order.id);
        try {
            for (const item of order.items) {
                // Add exact quantity directly to cart
                for(let i=0; i<item.quantity; i++) {
                    await api.post('/cart/add_item/', { menu_item_id: item.menu_item_detail?.id, quantity: 1 });
                }
            }
            window.dispatchEvent(new Event('clearCart'));
            toast.success("Items added to cart!");
            navigate('/home');
            setTimeout(() => { document.querySelector('.btn-primary')?.click() }, 500); // Opens cart overlay
        } catch (e) {
            toast.error("Failed to reorder items");
        } finally {
            setReorderingId(null);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/');
                setOrders(response.data.results);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        if (authTokens) fetchOrders();
    }, [authTokens]);

    if (loading) {
        return (
            <div style={{ paddingTop: '100px', minHeight: '80vh', background: 'var(--background)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Package size={32} color="var(--primary)" /> My Orders
                    </h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ height: '200px', background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', animation: 'pulse 1.5s infinite', border: '1px solid var(--border)' }}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '100px', minHeight: '80vh', background: 'var(--background)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Package size={32} color="var(--primary)" /> My Orders
                </h1>
                
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet. Time to grab some food!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {orders.map(order => {
                            const simStatus = getSimulatedStatus(order.created_at);
                            const formattedOrderId = `CRV-${new Date(order.created_at).getFullYear()}-${String(order.id).padStart(4, '0')}`;
                            return (
                            <div key={order.id} style={{ background: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                            <p style={{ fontWeight: '800', fontSize: '18px', margin: 0 }}>Order #{formattedOrderId}</p>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', background: simStatus.bg, color: simStatus.color, borderRadius: '6px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>
                                                {simStatus.text}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '20px', margin: '0 0 4px 0' }}>₹{order.total_amount}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontWeight: '600' }}>PAID VIA SECURE GATEWAY</p>
                                    </div>
                                </div>

                                {simStatus.step < 4 && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', padding: '0 16px' }}>
                                        {trackerSteps.map((step, idx) => {
                                            const isActive = simStatus.step >= idx + 1;
                                            return (
                                                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                                                    {idx !== trackerSteps.length - 1 && (
                                                        <div style={{ position: 'absolute', top: '12px', left: '50%', width: '100%', height: '4px', background: isActive ? 'var(--primary)' : '#f0f0f0', zIndex: 0, transition: 'background 0.3s' }}></div>
                                                    )}
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isActive ? 'var(--primary)' : '#f0f0f0', color: isActive ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, fontSize: '12px', fontWeight: 'bold', transition: 'all 0.3s' }}>
                                                        {isActive ? '✓' : idx + 1}
                                                    </div>
                                                    <span style={{ fontSize: '12px', marginTop: '8px', color: isActive ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isActive ? '600' : '500', textAlign: 'center' }}>{step}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                                    {order.items.map(item => {
                                        const imgUrl = item.menu_item_detail?.image_url;
                                        const optimizedUrl = imgUrl && imgUrl.includes('unsplash.com') && !imgUrl.includes('?') 
                                            ? `${imgUrl}?w=200&q=80&auto=format` 
                                            : (imgUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80");
                                        return (
                                        <div key={item.id} style={{ minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ width: '100%', height: '80px', borderRadius: '8px', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                <img 
                                                    src={optimizedUrl} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    alt={item.menu_item_detail?.name}
                                                    loading="lazy"
                                                    onError={handleImageError}
                                                />
                                            </div>
                                            <p style={{ fontSize: '14px', fontWeight: '600' }}><span style={{ color: 'var(--primary)' }}>{item.quantity}x</span> {item.menu_item_detail?.name}</p>
                                        </div>
                                    )})}
                                </div>
                                
                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flex: 1, paddingRight: '16px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>DELIVERED TO:</span>
                                        <span style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.5' }}>
                                            {order.user_address || "Default Address"}
                                        </span>
                                    </div>
                                    {simStatus.step === 4 && (
                                        <button 
                                            onClick={() => handleReorder(order)} 
                                            disabled={reorderingId === order.id}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff0ed', color: 'var(--primary)', border: '1px solid var(--primary-light)', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                                        >
                                            <RotateCcw size={16} />
                                            {reorderingId === order.id ? 'Reordering...' : 'REORDER'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )})}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;
