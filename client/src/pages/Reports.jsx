import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LayoutDashboard, FileUp, Activity, BarChart2, Trophy, History as HistoryIcon, FileSearch, FileText, Calendar, ArrowRight } from 'lucide-react';
import CircularProgress from '../components/CircularProgress';
import { getReports } from '../api';

const Reports = ({ user, setAnalysisResult, setExtractedText, setSelectedFile }) => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getReports().then(data => {
        setReports(data);
        setLoading(false);
      }).catch(err => {
        console.error("Failed to load reports", err);
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center pt-48 pb-32 px-6 w-full z-10 relative text-center min-h-[85vh]">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-12 flex flex-col items-center max-w-md w-full">
          <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Login Required</h2>
          <p className="text-slate-400 mb-8">You need to be logged in to access your personal Resume scans.</p>
          <button onClick={() => navigate('/auth')} className="px-8 py-3 bg-sky-400/20 text-sky-400 border border-sky-400/50 rounded-full font-bold hover:bg-sky-400/30 backdrop-blur-md transition-all shadow-lg shadow-sky-400/10 w-full">
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const totalScans = reports.length;
  const averageScore = totalScans > 0 
    ? Math.round(reports.reduce((acc, report) => acc + report.score, 0) / totalScans) 
    : 0;
  const highestScore = totalScans > 0
    ? Math.max(...reports.map(report => report.score))
    : 0;

  return (
    <div className="flex-grow pt-32 pb-12 px-6 max-w-7xl mx-auto w-full z-10 relative flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-sky-400" />
            My Reports
          </h1>
          <p className="text-slate-400">Your curated collection of resume scans.</p>
        </div>
        <button 
          onClick={() => navigate('/upload')}
          className="flex items-center px-6 py-3 bg-sky-400/10 border border-sky-400/50 text-sky-400 rounded-full font-bold hover:bg-sky-400/20 backdrop-blur-md transition-all shadow-lg shadow-sky-400/10"
        >
          <FileUp className="w-5 h-5 mr-2" />
          New Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-sky-400/50 transition-all duration-300 shadow-2xl hover:shadow-sky-400/10 hover:-translate-y-1">
          <div className="text-slate-400 mb-2 flex items-center font-medium"><Activity className="w-4 h-4 mr-2 text-purple-400"/> Total Scans</div>
          <div className="text-4xl font-bold text-white tracking-tight">{totalScans}</div>
        </div>
        <div className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-sky-400/50 transition-all duration-300 shadow-2xl hover:shadow-sky-400/10 hover:-translate-y-1">
          <div className="text-slate-400 mb-2 flex items-center font-medium"><BarChart2 className="w-4 h-4 mr-2 text-indigo-400"/> Average Score</div>
          <div className="text-4xl font-bold text-indigo-400 tracking-tight">{averageScore}</div>
        </div>
        <div className="p-6 bg-slate-900/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-sky-400/50 transition-all duration-300 shadow-2xl hover:shadow-sky-400/10 hover:-translate-y-1">
          <div className="text-slate-400 mb-2 flex items-center font-medium"><Trophy className="w-4 h-4 mr-2 text-amber-400"/> Highest Score</div>
          <div className="text-4xl font-bold text-amber-400 tracking-tight">{highestScore}</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <HistoryIcon className="w-5 h-5 text-sky-400" />
        Recent Scans
      </h2>
      
      {loading ? (
        <div className="text-white text-center">Loading reports...</div>
      ) : totalScans === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center w-full">
           <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-12 flex flex-col items-center max-w-md w-full mx-auto transition-all">
              <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
                 <FileSearch className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">No reports yet</h3>
              <p className="text-slate-400 mb-8 text-base leading-relaxed">Upload your first resume to see the magic happen.</p>
              <button onClick={() => navigate('/upload')} className="px-8 py-3 bg-sky-400/20 text-sky-400 border border-sky-400/50 rounded-full font-bold hover:bg-sky-400/30 backdrop-blur-md transition-all shadow-lg shadow-sky-400/10 flex items-center justify-center w-full">
                Start New Scan <ArrowRight className="ml-2 w-5 h-5" />
              </button>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
          <div key={report._id} onClick={() => { 
              const fullResult = { ...report.result, fileName: report.fileName, date: report.date };
              setAnalysisResult(fullResult); 
              setExtractedText(report.rawText || ""); 
              setSelectedFile({ name: report.fileName, type: report.fileName.endsWith('.pdf') ? 'application/pdf' : '' }); 
              navigate('/results'); 
            }} className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-sky-400/50 transition-all duration-300 shadow-2xl hover:shadow-sky-400/10 cursor-pointer group flex flex-col justify-between">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-black/40 text-sky-400 flex items-center justify-center border border-white/5 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <div className="transform scale-75 origin-top-right group-hover:scale-90 transition-transform duration-300">
                 <CircularProgress value={Number(report.score) || 0} size="sm" color={(Number(report.score) || 0) > 70 ? "text-emerald-400" : "text-amber-400"} />
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1 group-hover:text-sky-400 transition-colors truncate" title={report.fileName}>{String(report.fileName)}</h3>
              <p className="text-sm text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500"/> {String(report.date)}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default Reports;
