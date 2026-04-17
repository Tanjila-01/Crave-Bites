import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Package } from 'lucide-react';
import AuthContext from '../context/AuthContext';

function Orders() {
    const { authTokens } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/orders/', {
                    headers: { 'Authorization': `Bearer ${authTokens?.access}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        if (authTokens) fetchOrders();
    }, [authTokens]);

    if (loading) {
        return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading orders...</div>;
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
                        {orders.map(order => (
                            <div key={order.id} style={{ background: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '18px' }}>Order #{order.id}</p>
                                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleString()}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '18px' }}>₹{order.total_amount}</p>
                                        <span style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '700', marginTop: '8px' }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                                    {order.items.map(item => (
                                        <div key={item.id} style={{ minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ width: '100%', height: '80px', borderRadius: '8px', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                <img 
                                                    src={item.menu_item_detail?.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    alt={item.menu_item_detail?.name}
                                                />
                                            </div>
                                            <p style={{ fontSize: '14px', fontWeight: '600' }}><span style={{ color: 'var(--primary)' }}>{item.quantity}x</span> {item.menu_item_detail?.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;
