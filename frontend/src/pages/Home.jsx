import { useState } from 'react';
import { ArrowRight, Star, Clock, Plus, Minus } from 'lucide-react';

function Home({ categories, restaurants, addToCart, cart, updateQuantity }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredRestaurants = selectedCategory 
        ? restaurants.filter(r => r.menu_items && r.menu_items.some(item => item.category === selectedCategory))
        : restaurants;
    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-grid">
                <div className="hero-content animate-fade-up">
                    <h1>It's not just Food, It's an <span className="text-gradient">Experience</span>.</h1>
                    <p>Discover the best food & drinks in your city. Delivered to your doorstep with precision and care.</p>
                    
                    <div style={{ display: 'flex', gap: '16px' }}>
                    <a href="#restaurants" className="btn-primary" style={{ padding: '16px 32px' }}>
                        Order Now <ArrowRight size={20} />
                    </a>
                    <a href="#restaurants" className="btn-primary" style={{ background: '#F2F2F7', color: 'var(--text-main)', boxShadow: 'none' }}>
                        Explore Menu
                    </a>
                    </div>
                </div>
                <div className="hero-image animate-float">
                    <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" alt="Delicious Food" />
                </div>
                </div>
            </section>

            {/* Categories */}
            <section className="categories container">
                <h2 className="section-title">What's on your mind?</h2>
                <div className="category-slider">
                {categories.map(cat => (
                    <div 
                        className="category-card" 
                        key={cat.id} 
                        onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                        style={{ cursor: 'pointer', opacity: selectedCategory && selectedCategory !== cat.id ? 0.5 : 1, transform: selectedCategory === cat.id ? 'scale(1.05)' : 'none', transition: 'all 0.3s ease' }}
                    >
                    <div className="category-img-wrapper" style={{ border: selectedCategory === cat.id ? '4px solid var(--primary)' : 'none' }}>
                        <img src={cat.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"} alt={cat.name} />
                    </div>
                    <span className="category-name" style={{ color: selectedCategory === cat.id ? 'var(--primary)' : 'var(--text-main)', fontWeight: selectedCategory === cat.id ? '800' : '600' }}>{cat.name}</span>
                    </div>
                ))}
                </div>
            </section>

            {/* Restaurants */}
            <section id="restaurants" className="restaurants-section container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 className="section-title" style={{ marginBottom: 0 }}>
                        {selectedCategory ? `Restaurants serving ${categories.find(c => c.id === selectedCategory)?.name}` : 'Top restaurant chains in your city'}
                    </h2>
                    {selectedCategory && (
                        <button onClick={() => setSelectedCategory(null)} style={{ background: 'var(--primary-light)', border: 'none', color: 'var(--primary)', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Clear Filter</button>
                    )}
                </div>
                
                <div className="restaurants-grid">
                {filteredRestaurants.map(rest => {
                    // If filtered by category, show ALL items belonging to that category first.
                    // Otherwise just slice 3 items for Highlights.
                    let displayItems = rest.menu_items || [];
                    if (selectedCategory) {
                        displayItems = displayItems.filter(i => i.category === selectedCategory);
                    } else {
                        displayItems = displayItems.slice(0, 3);
                    }

                    return (
                    <div className="restaurant-card" key={rest.id}>
                    <div className="restaurant-image">
                        <img src={rest.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80"} alt={rest.name} />
                        <div className="restaurant-badge">
                        <Star size={14} color="var(--primary)" fill="var(--primary)" /> {rest.rating}
                        </div>
                    </div>
                    <div className="restaurant-info">
                        <h3>{rest.name}</h3>
                        <p className="restaurant-tags">{rest.tags}</p>
                        
                        <div className="restaurant-meta">
                        <div className="meta-item">
                            <Clock size={16} /> {rest.delivery_time}
                        </div>
                        <div className="meta-item">
                            ₹{rest.cost_for_two} for two
                        </div>
                        </div>

                        {displayItems && displayItems.length > 0 && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                            <p style={{ fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>{selectedCategory ? 'Matching Items' : 'Menu Highlights'}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {displayItems.map(item => {
                                const cartItem = cart && cart.find(i => i.id === item.id);
                                return (
                                <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#FAFAFA' }}>
                                        <img src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                            <div style={{ width: '12px', height: '12px', border: `1px solid ${item.is_veg ? 'green' : 'red'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', flexShrink: 0, marginTop: '3px' }}>
                                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: item.is_veg ? 'green' : 'red' }}></div>
                                            </div>
                                            <p style={{ fontSize: '14px', fontWeight: '600', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                                        </div>
                                        <p style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '4px', fontWeight: '500', paddingLeft: '18px' }}>₹{item.price}</p>
                                    </div>
                                    {cartItem ? (
                                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)', overflow: 'hidden', flexShrink: 0 }}>
                                            <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }} style={{ padding: '6px 10px', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Minus size={14}/></button>
                                            <span style={{ fontWeight: '700', fontSize: '12px', color: 'var(--primary)', minWidth: '16px', textAlign: 'center' }}>{cartItem.quantity}</span>
                                            <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }} style={{ padding: '6px 10px', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Plus size={14}/></button>
                                        </div>
                                    ) : (
                                        <button 
                                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                        style={{ padding: '8px 16px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', fontWeight: '700', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>
                                        ADD
                                        </button>
                                    )}
                                </div>
                                )})}
                            </div>
                            </div>
                        )}
                    </div>
                    </div>
                    );
                })}
                </div>
                {filteredRestaurants.length === 0 && (
                    <div style={{ padding: '64px', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-lg)' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>No restaurants found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>We couldn't find any restaurants serving {categories.find(c => c.id === selectedCategory)?.name} near you.</p>
                        <button className="btn-primary" onClick={() => setSelectedCategory(null)} style={{ marginTop: '24px' }}>Browse All Places</button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;
