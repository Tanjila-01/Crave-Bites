import { useState, useContext } from 'react';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import AuthContext from '../context/AuthContext';

function Login() {
    const { loginUser, registerUser } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            loginUser(username, password);
        } else {
            registerUser(username, email, password);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '24px' }}>
            <div style={{ background: 'var(--surface)', width: '100%', maxWidth: '440px', padding: '48px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
                        {isLogin ? 'Welcome Back' : 'Join CraveBites'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? 'Sign in to track your orders and quickly reorder your favorites.' : 'Create an account to start your food journey.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <UserIcon size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            required 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '16px 16px 16px 48px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '16px', background: '#FAFAFA' }}
                        />
                    </div>

                    {!isLogin && (
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '16px 16px 16px 48px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '16px', background: '#FAFAFA' }}
                            />
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '16px 16px 16px 48px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '16px', background: '#FAFAFA' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '18px', marginTop: '8px' }}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
                        <span 
                            onClick={() => setIsLogin(!isLogin)} 
                            style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
