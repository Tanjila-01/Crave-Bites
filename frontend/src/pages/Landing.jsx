import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

function Landing() {
    const navigate = useNavigate();
    const [wordIndex, setWordIndex] = useState(0);
    const words = ["Hungry?", "Unexpected guests?", "Movie night?", "Late working?"];

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <div style={{ minHeight: '100vh', background: '#FAFAFA', overflowX: 'hidden' }}>
            {/* HERO SECTION - Dark Premium */}
            <div style={{ background: '#111111', color: 'white', padding: '160px 24px 100px', overflow: 'hidden', position: 'relative' }}>
                {/* Decorative glowing orbs */}
                <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(255,90,0,0.15) 0%, rgba(255,90,0,0) 70%)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', left: '-20%', bottom: '-40%', width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(255,90,0,0.1) 0%, rgba(255,90,0,0) 70%)', borderRadius: '50%' }}></div>
                
                <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                    
                    <div style={{ maxWidth: '600px' }}>
                        <div style={{ minHeight: '160px', marginBottom: '16px' }}>
                            <h1 style={{ fontSize: '72px', fontWeight: '900', lineHeight: 1.1, color: 'var(--primary)' }} className="animate-fade-up">
                                {words[wordIndex]}
                            </h1>
                        </div>
                        <h2 style={{ fontSize: '36px', fontWeight: '400', marginBottom: '48px', color: '#DDDDDD', lineHeight: 1.3 }}>
                            Get the best food from top restaurants delivered to your door in <span style={{ color: 'white', fontWeight: '700' }}>minutes.</span>
                        </h2>
                        
                        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: 'var(--radius-full)', display: 'flex', maxWidth: '500px', backdropFilter: 'blur(10px)' }}>
                            <input type="text" placeholder="Enter your delivery location..." style={{ flex: 1, border: 'none', background: 'transparent', padding: '0 24px', fontSize: '18px', outline: 'none', color: 'white' }} />
                            <button onClick={() => navigate('/login')} style={{ background: 'var(--primary)', color: 'white', padding: '20px 40px', borderRadius: 'var(--radius-full)', fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '18px', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.05)' } }}>
                                Find Food
                            </button>
                        </div>
                        <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '24px', color: '#AAAAAA' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><p>Popular cities in India</p></div>
                            <div style={{ display: 'flex', gap: '16px', fontWeight: '600', color: '#CCCCCC' }}>
                                <span>Bangalore</span>
                                <span>Mumbai</span>
                                <span>Delhi</span>
                            </div>
                        </div>
                    </div>

                    <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, border: '2px dashed rgba(255,90,0,0.3)', borderRadius: '50%', transform: 'scale(1.1)', animation: 'spin 20s linear infinite' }}></div>
                        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80" style={{ width: '480px', height: '480px', objectFit: 'cover', borderRadius: '50%', border: '12px solid #222', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }} alt="Hero" />
                        
                        {/* Floating Badges */}
                        <div style={{ position: 'absolute', top: '10%', right: '-5%', background: 'white', color: 'black', padding: '16px 24px', borderRadius: 'var(--radius-full)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                            <div style={{ width: '12px', height: '12px', background: '#00C853', borderRadius: '50%' }}></div>
                            4.9/5 Rating
                        </div>
                        <div style={{ position: 'absolute', bottom: '15%', left: '-10%', background: 'white', color: 'black', padding: '16px 24px', borderRadius: 'var(--radius-full)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                            <Clock fill="var(--primary)" color="white" />
                            25 Mins Avg
                        </div>
                    </div>
                </div>
            </div>

            {/* FEATURES */}
            <div className="container" style={{ padding: '120px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>No Minimum Order.</h2>
                    <p style={{ fontSize: '20px', color: 'var(--text-muted)' }}>Order in for yourself or for the group, with no restrictions.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                    <div style={{ padding: '48px', background: 'white', borderRadius: '32px', border: '1px solid var(--border)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ width: '80px', height: '80px', background: 'var(--primary-light)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                            <Zap size={40} color="var(--primary)" fill="var(--primary)" />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>Lightning Fast</h3>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.6' }}>Experience our superfast delivery for food delivered fresh & on time, every time.</p>
                    </div>
                    <div style={{ padding: '48px', background: 'white', borderRadius: '32px', border: '1px solid var(--border)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(0,200,83,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                            <ShieldCheck size={40} color="#00C853" />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>100% Quality Assured</h3>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.6' }}>We exclusively partner with restaurants who maintain perfect safety guidelines.</p>
                    </div>
                    <div style={{ padding: '48px', background: 'white', borderRadius: '32px', border: '1px solid var(--border)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(100,100,255,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                            <MapPin size={40} color="#6464FF" fill="#6464FF" />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>Live Order Tracking</h3>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.6' }}>Know where your order is at all times, from the restaurant to your doorstep.</p>
                    </div>
                </div>
            </div>

            {/* BANNER SECTION */}
            <div style={{ background: 'var(--primary)', padding: '80px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                    <div>
                        <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px' }}>Restaurants in your pocket</h2>
                        <p style={{ fontSize: '20px', opacity: 0.9, maxWidth: '500px' }}>Order from your favorite restaurants & track on the go, with the all-new CraveBites app.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ background: 'black', color: 'white', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 32px', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
                            <Smartphone size={32} />
                            <div>
                                <div style={{ fontSize: '12px', opacity: 0.7 }}>Download on the</div>
                                <div style={{ fontSize: '24px', fontWeight: '700' }}>App Store</div>
                            </div>
                        </div>
                        <div style={{ background: 'black', color: 'white', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 32px', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
                            <Smartphone size={32} />
                            <div>
                                <div style={{ fontSize: '12px', opacity: 0.7 }}>GET IT ON</div>
                                <div style={{ fontSize: '24px', fontWeight: '700' }}>Google Play</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div style={{ background: '#111111', color: 'white', padding: '100px 24px 40px' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr 1fr 1fr', gap: '60px', marginBottom: '80px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
                                <path d="M12 8v4"></path>
                                <path d="M12 16h.01"></path>
                            </svg>
                            <span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>CraveBites.</span>
                        </div>
                        <p style={{ color: '#888888', fontSize: '16px', lineHeight: '1.6' }}>© 2026 CraveBites Technologies Pvt. Ltd.<br/>Delivering happiness, one meal at a time.</p>
                    </div>
                    
                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Company</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', color: '#888888' }}>
                            <li style={{ cursor: 'pointer' }}>About us</li>
                            <li style={{ cursor: 'pointer' }}>Team</li>
                            <li style={{ cursor: 'pointer' }}>Careers</li>
                            <li style={{ cursor: 'pointer' }}>Blog</li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Contact</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', color: '#888888' }}>
                            <li style={{ cursor: 'pointer' }}>Help & Support</li>
                            <li style={{ cursor: 'pointer' }}>Partner with us</li>
                            <li style={{ cursor: 'pointer' }}>Ride with us</li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', color: '#888888' }}>
                            <li style={{ cursor: 'pointer' }}>Terms & Conditions</li>
                            <li style={{ cursor: 'pointer' }}>Refund & Cancellation</li>
                            <li style={{ cursor: 'pointer' }}>Privacy Policy</li>
                            <li style={{ cursor: 'pointer' }}>Cookie Policy</li>
                        </ul>
                    </div>
                </div>
                
                <div className="container" style={{ borderTop: '1px solid #333', paddingTop: '40px', display: 'flex', justifyContent: 'center' }}>
                    <h1 style={{ fontSize: '120px', fontWeight: '900', letterSpacing: '-4px', opacity: 0.1, margin: 0 }}>CRAVEBITES</h1>
                </div>
            </div>
        </div>
    );
}

export default Landing;
