import { useState, useContext, useMemo } from 'react';
import { ArrowRight, Star, Clock, Plus, Minus, MapPin, ArrowLeft, Search, Filter, Leaf } from 'lucide-react';
import LocationContext from '../context/LocationContext';

function Home({ categories, restaurants, addToCart, cart, updateQuantity, isLoadingData }) {
    const { userLocation } = useContext(LocationContext);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expandedRestaurant, setExpandedRestaurant] = useState(null);
    
    // Feature 4: Search & Filters state
    const [searchQuery, setSearchQuery] = useState('');
    const [vegOnly, setVegOnly] = useState(false);
    const [rating4Plus, setRating4Plus] = useState(false);
    const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);

    const filteredRestaurants = useMemo(() => {
        let result = restaurants;

        // 1. Category Filter
        if (selectedCategory) {
            result = result.filter(r => r.menu_items?.some(item => item.category === selectedCategory));
        }

        // 2. Veg Only Filter (Restaurant has at least one veg item, and we'll filter items later)
        if (vegOnly) {
            result = result.filter(r => r.menu_items?.some(item => item.is_veg));
        }

        // 3. Rating 4+ Filter
        if (rating4Plus) {
            result = result.filter(r => r.rating >= 4.0);
        }

        // 4. Fast Delivery (< 30 mins)
        if (fastDeliveryOnly) {
            result = result.filter(r => parseInt(r.delivery_time) < 30);
        }

        // 5. Global Search Filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(r => {
                const matchName = r.name.toLowerCase().includes(query);
                const matchTags = r.tags && r.tags.toLowerCase().includes(query);
                const matchItems = r.menu_items?.some(item => item.name.toLowerCase().includes(query));
                return matchName || matchTags || matchItems;
            });
        }
        
        return result;
    }, [restaurants, selectedCategory, vegOnly, rating4Plus, fastDeliveryOnly, searchQuery]);

    const topRated = [...filteredRestaurants].sort((a,b) => b.rating - a.rating).slice(0, 4);
    const fastDelivery = [...filteredRestaurants].sort((a,b) => parseInt(a.delivery_time) - parseInt(b.delivery_time)).slice(0, 4);

    const renderRestaurantCard = (rest, showHighlights = false) => {
        let displayItems = rest.menu_items || [];
        
        // If vegOnly is active, only show veg items in the highlights
        if (vegOnly) {
            displayItems = displayItems.filter(i => i.is_veg);
        }

        if (selectedCategory) {
            displayItems = displayItems.filter(i => i.category === selectedCategory);
        } else if (showHighlights) {
            displayItems = displayItems.slice(0, 3);
        } else {
            displayItems = [];
        }

        return (
            <div className="restaurant-card" key={rest.id} onClick={() => setExpandedRestaurant(rest)} style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}>
                <div className="restaurant-image">
                    <img src={getOptimizedUrl(rest.image_url)} alt={rest.name} loading="lazy" onError={handleImageError} />
                    <div className="restaurant-badge">
                        <Star size={14} color="var(--primary)" fill="var(--primary)" /> {rest.rating}
                    </div>
                </div>
                <div className="restaurant-info" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{rest.name}</h3>
                    <p className="restaurant-tags" style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rest.tags}</p>
                    
                    <div className="restaurant-meta" style={{ display: 'flex', gap: '16px', color: 'var(--text-main)', fontSize: '14px', fontWeight: '600' }}>
                        <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={16} color="var(--primary)" /> {rest.delivery_time}
                        </div>
                        <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ccc' }}></div>
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
                            <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflow: 'hidden' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: '#FAFAFA' }}>
                                        <img src={getOptimizedUrl(item.image_url, 200)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} loading="lazy" onError={handleImageError} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '14px', height: '14px', border: `1px solid ${item.is_veg ? 'green' : 'red'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', borderRadius: '2px', flexShrink: 0 }}>
                                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: item.is_veg ? 'green' : 'red' }}></div>
                                            </div>
                                            <h4 style={{ fontSize: '15px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{item.name}</h4>
                                        </div>
                                        <p style={{ fontSize: '14px', color: 'var(--text-main)', marginTop: '6px', fontWeight: '600', margin: 0 }}>₹{item.price}</p>
                                    </div>
                                </div>
                                <div style={{ flexShrink: 0 }}>
                                    {cartItem ? (
                                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--primary-light)', borderRadius: '6px', border: '1px solid var(--primary)', overflow: 'hidden', height: '32px' }}>
                                            <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }} style={{ padding: '0 8px', height: '100%', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Minus size={14}/></button>
                                            <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--primary)', minWidth: '20px', textAlign: 'center' }}>{cartItem.quantity}</span>
                                            <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }} style={{ padding: '0 8px', height: '100%', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Plus size={14}/></button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                            style={{ height: '32px', padding: '0 16px', background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(255, 90, 0, 0.1)', transition: 'background 0.2s' }}
                                            onMouseEnter={(e) => e.target.style.background = 'var(--primary-light)'}
                                            onMouseLeave={(e) => e.target.style.background = 'white'}
                                        >
                                            ADD
                                        </button>
                                    )}
                                </div>
                            </div>
                            )})}
                        </div>
                        </div>
                    )}
                    
                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px dashed var(--border)' }}>
                        <button style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: '700', fontSize: '14px', cursor: 'pointer', textAlign: 'center' }}>
                            VIEW MENU
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
    };

    const getOptimizedUrl = (url, width=500) => {
        if (!url) return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=${width}&q=80`;
        if (url.includes('unsplash.com') && !url.includes('?')) {
            return `${url}?w=${width}&q=80&auto=format`;
        }
        return url;
    };

    if (isLoadingData) {
        return (
            <div className="container" style={{ padding: '64px 24px' }}>
                <div style={{ height: '400px', background: '#f0f0f0', borderRadius: '16px', marginBottom: '40px', animation: 'pulse 1.5s infinite' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{ height: '300px', background: '#f0f0f0', borderRadius: '16px', animation: 'pulse 1.5s infinite' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    if (expandedRestaurant) {
        return (
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', animation: 'fadeUp 0.3s ease' }}>
                <button onClick={() => setExpandedRestaurant(null)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
                    <ArrowLeft size={20} /> Back to restaurants
                </button>
                <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap', background: 'white', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                    <img src={getOptimizedUrl(expandedRestaurant.image_url, 800)} style={{ width: '300px', height: '250px', objectFit: 'cover', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }} />
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>{expandedRestaurant.name}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '24px' }}>{expandedRestaurant.tags}</p>
                        <div style={{ display: 'flex', gap: '24px', fontSize: '16px', fontWeight: '600', padding: '16px', background: '#FAFAFA', borderRadius: '12px', border: '1px solid var(--border)', display: 'inline-flex' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={20} color="var(--primary)" fill="var(--primary)" /> {expandedRestaurant.rating} Rating</div>
                            <div style={{ width: '1px', background: 'var(--border)' }}></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={20} color="var(--text-main)" /> {expandedRestaurant.delivery_time}</div>
                            <div style={{ width: '1px', background: 'var(--border)' }}></div>
                            <div>₹{expandedRestaurant.cost_for_two} for two</div>
                        </div>
                    </div>
                </div>
                
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '48px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid var(--border)' }}>Full Menu</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {expandedRestaurant.menu_items?.map(item => {
                        const cartItem = cart && cart.find(i => i.id === item.id);
                        return (
                            <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                                <div style={{ width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                                    <img src={getOptimizedUrl(item.image_url, 300)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} loading="lazy" onError={handleImageError} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <div style={{ width: '16px', height: '16px', border: `1.5px solid ${item.is_veg ? 'green' : 'red'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', borderRadius: '2px' }}>
                                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: item.is_veg ? 'green' : 'red' }}></div>
                                            </div>
                                            <h4 style={{ fontSize: '18px', fontWeight: '800', lineHeight: '1.2' }}>{item.name}</h4>
                                        </div>
                                        <p style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '16px', marginTop: '8px' }}>₹{item.price}</p>
                                    </div>
                                    <div style={{ marginTop: '16px', alignSelf: 'flex-start' }}>
                                        {cartItem ? (
                                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--primary-light)', borderRadius: '8px', border: '1px solid var(--primary)', overflow: 'hidden', height: '36px' }}>
                                                <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0 12px', height: '100%', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Minus size={16}/></button>
                                                <span style={{ fontWeight: '800', fontSize: '14px', color: 'var(--primary)', minWidth: '24px', textAlign: 'center' }}>{cartItem.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0 12px', height: '100%', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Plus size={16}/></button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => addToCart(item)} 
                                                style={{ height: '36px', padding: '0 32px', background: 'white', color: 'var(--primary)', border: '1.5px solid var(--primary)', borderRadius: '8px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(255, 90, 0, 0.15)', transition: 'background 0.2s' }}
                                                onMouseEnter={(e) => e.target.style.background = 'var(--primary-light)'}
                                                onMouseLeave={(e) => e.target.style.background = 'white'}
                                            >
                                                ADD
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

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
                    <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" alt="Delicious Food" loading="lazy" onError={handleImageError} />
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
                        <img src={getOptimizedUrl(cat.image_url)} alt={cat.name} loading="lazy" onError={handleImageError} />
                    </div>
                    <span className="category-name" style={{ color: selectedCategory === cat.id ? 'var(--primary)' : 'var(--text-main)', fontWeight: selectedCategory === cat.id ? '800' : '600' }}>{cat.name}</span>
                    </div>
                ))}
                </div>
            </section>

            {/* Top Rated & Fast Delivery Sections (Only show if not filtering at all) */}
            {(!selectedCategory && !searchQuery && !vegOnly && !rating4Plus && !fastDeliveryOnly) && filteredRestaurants.length > 0 && (
                <>
                    <section className="restaurants-section container" style={{ paddingTop: '24px' }}>
                        <h2 className="section-title">Top Rated in {userLocation || 'your area'}</h2>
                        <div className="restaurants-grid">
                            {topRated.map(rest => renderRestaurantCard(rest, false))}
                        </div>
                    </section>

                    <section className="restaurants-section container" style={{ paddingTop: '24px' }}>
                        <h2 className="section-title">Fast Delivery in {userLocation || 'your area'}</h2>
                        <div className="restaurants-grid">
                            {fastDelivery.map(rest => renderRestaurantCard(rest, false))}
                        </div>
                    </section>
                </>
            )}

            {/* Global Search and Filters */}
            <section className="container" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            placeholder="Search for restaurants, cuisines, or dishes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '16px', border: '1px solid var(--border)', fontSize: '16px', boxShadow: 'var(--shadow-sm)', outline: 'none', background: 'white' }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button 
                            onClick={() => setVegOnly(!vegOnly)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 'var(--radius-full)', border: vegOnly ? '1px solid var(--primary)' : '1px solid var(--border)', background: vegOnly ? 'var(--primary-light)' : 'white', color: vegOnly ? 'var(--primary)' : 'var(--text-main)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <Leaf size={16} color={vegOnly ? 'green' : 'currentColor'} /> Pure Veg
                        </button>
                        <button 
                            onClick={() => setRating4Plus(!rating4Plus)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 'var(--radius-full)', border: rating4Plus ? '1px solid var(--primary)' : '1px solid var(--border)', background: rating4Plus ? 'var(--primary-light)' : 'white', color: rating4Plus ? 'var(--primary)' : 'var(--text-main)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            Rating 4.0+
                        </button>
                        <button 
                            onClick={() => setFastDeliveryOnly(!fastDeliveryOnly)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 'var(--radius-full)', border: fastDeliveryOnly ? '1px solid var(--primary)' : '1px solid var(--border)', background: fastDeliveryOnly ? 'var(--primary-light)' : 'white', color: fastDeliveryOnly ? 'var(--primary)' : 'var(--text-main)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            Fast Delivery
                        </button>
                        {(searchQuery || vegOnly || rating4Plus || fastDeliveryOnly || selectedCategory) && (
                            <button 
                                onClick={() => { setSearchQuery(''); setVegOnly(false); setRating4Plus(false); setFastDeliveryOnly(false); setSelectedCategory(null); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 'var(--radius-full)', border: 'none', background: 'transparent', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
            </section>


            {/* All Restaurants / Filtered Restaurants */}
            <section id="restaurants" className="restaurants-section container" style={{ paddingTop: !selectedCategory ? '24px' : '64px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 className="section-title" style={{ marginBottom: 0 }}>
                        {selectedCategory ? `Restaurants serving ${categories.find(c => c.id === selectedCategory)?.name}` : `Popular restaurants in ${userLocation || 'your area'}`}
                    </h2>
                    {selectedCategory && (
                        <button onClick={() => setSelectedCategory(null)} style={{ background: 'var(--primary-light)', border: 'none', color: 'var(--primary)', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Clear Filter</button>
                    )}
                </div>
                
                <div className="restaurants-grid">
                    {filteredRestaurants.map(rest => renderRestaurantCard(rest, true))}
                </div>
                {filteredRestaurants.length === 0 && (
                    <div style={{ padding: '64px', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-lg)' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>No restaurants found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>We couldn't find any restaurants {selectedCategory ? `serving ${categories.find(c => c.id === selectedCategory)?.name}` : ''} {userLocation ? `in ${userLocation}` : 'near you'}.</p>
                        <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            {selectedCategory && (
                                <button className="btn-primary" onClick={() => setSelectedCategory(null)}>Clear Category Filter</button>
                            )}
                            <button className="btn-primary" style={{ background: '#F2F2F7', color: 'var(--text-main)', boxShadow: 'none' }} onClick={() => window.location.href = '/'}>Change Location</button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;
