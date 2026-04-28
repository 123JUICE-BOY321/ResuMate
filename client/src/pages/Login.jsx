import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup, setAuthToken } from '../api';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      let data;
      if (isLogin) {
        data = await login(authEmail, authPassword);
      } else {
        const username = (authName || "New User").toLowerCase().replace(/\s/g, '');
        data = await signup(authName, authEmail, authPassword, username);
      }
      
      setAuthToken(data.token);
      setUser(data.user);
      navigate('/upload');
    } catch (err) {
      setAuthError(err.response?.data?.msg || 'Authentication failed');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 z-10 relative pt-32 pb-12 w-full">
      <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-tight">
          {isLogin ? "Welcome Back" : "Join ResuMate"}
        </h2>
        
        <div className="flex mb-6 bg-black/40 rounded-full p-1 backdrop-blur-sm border border-white/5">
          <button 
            onClick={() => { setIsLogin(true); setAuthError(''); }} 
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${isLogin ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-slate-400 hover:text-white border border-transparent'}`}
          >
            Log In
          </button>
          <button 
            onClick={() => { setIsLogin(false); setAuthError(''); }} 
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${!isLogin ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-slate-400 hover:text-white border border-transparent'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {authError && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl text-sm font-bold text-center">
              {authError}
            </div>
          )}
          
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Display Name</label>
              <input 
                type="text" 
                required 
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none focus:ring-1 focus:ring-sky-500/50 transition-all placeholder-slate-500" 
                placeholder="e.g. John Doe" 
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{isLogin ? 'Email' : 'Email'}</label>
            <input 
              type="email" 
              required 
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none focus:ring-1 focus:ring-sky-500/50 transition-all placeholder-slate-500" 
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none focus:ring-1 focus:ring-sky-500/50 transition-all placeholder-slate-500" 
              placeholder="••••••••" 
            />
          </div>
          
          {isLogin ? (
            <button type="submit" className="w-full bg-sky-400/20 text-sky-400 border border-sky-400/50 backdrop-blur-md font-bold py-3.5 rounded-full hover:bg-sky-400/30 transition-all mt-8 shadow-lg shadow-sky-400/10">
              Log In
            </button>
          ) : (
            <button type="submit" className="w-full bg-white/10 text-white border border-white/20 backdrop-blur-md font-bold py-3.5 rounded-full hover:bg-white/20 transition-all mt-8">
              Create Account
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
