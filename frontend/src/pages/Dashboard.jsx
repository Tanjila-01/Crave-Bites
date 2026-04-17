import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { User, LogOut, Package, MapPin } from 'lucide-react';
import AuthContext from '../context/AuthContext';

function Dashboard() {
    const { user, authTokens, logoutUser } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/orders/', {
                    headers: { 'Authorization': `Bearer ${authTokens?.access}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };
        if (authTokens) {
            fetchOrders();
        }
    }, [authTokens]);

    return (
        <div style={{ paddingTop: '100px', minHeight: '80vh' }} className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 className="section-title">My Dashboard</h1>
                <button onClick={logoutUser} className="btn-primary" style={{ background: '#F2F2F7', color: 'var(--text-main)', boxShadow: 'none' }}>
                    <LogOut size={20} /> Logout
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '40px' }}>
                {/* Profile Card */}
                <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', height: 'fit-content' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF5A00, #FF0055)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '16px' }}>
                            <User size={40} />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{user?.username}</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Registered Foodie</p>
                    </div>
                    <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Package size={18} color="var(--primary)"/> {orders.length} Total Orders</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><MapPin size={18} color="var(--primary)"/> Default Address</li>
                    </ul>
                </div>

                {/* Orders */}
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Order History</h2>
                    {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}>
                            <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {orders.map(order => (
                                <div key={order.id} style={{ background: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                                        <div>
                                            <p style={{ fontWeight: '700' }}>Order #{order.id}</p>
                                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleString()}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{order.total_amount}</p>
                                            <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '600', marginTop: '8px' }}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
                                        {order.items.map(item => (
                                            <div key={item.id} style={{ minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <img src={item.menu_item_detail?.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                                                <p style={{ fontSize: '12px', fontWeight: '600' }}>{item.quantity}x {item.menu_item_detail?.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
