import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, CheckCircle, FileSearch, FileText, Activity, ArrowRight } from 'lucide-react';
import Paper3D from '../components/Paper3D';
import { useApp } from '../context/AppContext';

const features = [
  { icon: Zap, label: 'Instant resume scoring', color: 'text-amber-400' },
  { icon: CheckCircle, label: 'ATS compatibility check', color: 'text-emerald-400' },
  { icon: FileSearch, label: 'Keyword improvement suggestions', color: 'text-purple-400' },
  { icon: FileText, label: 'Formatting and readability analysis', color: 'text-indigo-400' },
  { icon: Activity, label: 'Actionable feedback to improve your resume', color: 'text-rose-400' },
];

const Home = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex items-center justify-start pt-32 pb-12 px-6 max-w-7xl mx-auto w-full relative z-10 min-h-[90vh]">
      <div className="w-full lg:w-[55%] text-left space-y-6 relative z-20 mt-10 lg:mt-0">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 text-slate-300 text-sm font-semibold border border-white/10 backdrop-blur-xl shadow-inner">
          <Sparkles className="w-4 h-4 mr-2 text-slate-400" />
          AI-Powered Resume Scoring
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
          Your Resume's <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
            Smartest Mate.
          </span>
        </h1>

        <ul className="space-y-4 text-slate-300 text-lg md:text-xl font-medium mt-6 mb-8">
          {features.map(({ icon: Icon, label, color }, i) => (
            <li key={i} className="flex items-center gap-3">
              <Icon className={`w-6 h-6 ${color} flex-shrink-0`} />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate(user ? '/upload' : '/auth')}
          className="px-8 py-4 bg-sky-400/20 text-sky-400 border border-sky-400/50 hover:bg-sky-400/30 rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center justify-center shadow-lg shadow-sky-400/20 backdrop-blur-md w-max"
        >
          Check your Score <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-[-5%] w-[60%] h-[1100px] pointer-events-none z-10 hidden lg:block">
        <div className="w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing">
          <Paper3D />
        </div>
      </div>
    </div>
  );
};

export default Home;