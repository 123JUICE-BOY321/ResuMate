import React from 'react';
import { BrainCircuit, Settings, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const NavBar = () => {
  const { user, handleLogout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const view = location.pathname.substring(1) || 'landing';

  const activeClass = "text-white bg-white/10 shadow-sm border border-white/20 shadow-white/5";
  const inactiveClass = "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent";

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <svg width="0" height="0" className="absolute">
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="#38bdf8" offset="0%" />
                  <stop stopColor="#2563eb" offset="100%" />
                </linearGradient>
              </svg>
              <div className="absolute inset-0 bg-sky-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full scale-125"></div>
              <BrainCircuit style={{ stroke: "url(#logo-gradient)" }} className="w-10 h-10 relative z-10" strokeWidth={2} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-xl text-white tracking-wide leading-none">ResuMate</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">AI Resume Scorer</span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-2 bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-white/10">
            <Link 
              to="/" 
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${view === 'landing' ? activeClass : inactiveClass}`}
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${view === 'upload' || view === 'analyzing' ? activeClass : inactiveClass}`}
            >
              Scan
            </Link>
            <Link 
              to="/dashboard" 
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${view === 'dashboard' || view === 'results' ? activeClass : inactiveClass}`}
            >
              Reports
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/20 backdrop-blur-md bg-white/5">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-400 leading-none mt-1">@{user.username}</p>
                  </div>
                  <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20 bg-slate-800" />
                </button>
                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block">
                  <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 overflow-hidden">
                    <Link to="/settings" className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm text-slate-300 transition-colors flex items-center gap-2 border-b border-white/5">
                        <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/auth"
                className="px-5 py-2 rounded-full bg-sky-400/10 border border-sky-400/50 backdrop-blur-md text-sky-400 font-bold text-sm hover:bg-sky-400/20 transition-all shadow-lg shadow-sky-400/10"
              >
                Log In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;
