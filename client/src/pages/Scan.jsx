import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, UploadCloud } from 'lucide-react';

const Scan = ({ user, handleFileUpload }) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center pt-48 pb-32 px-6 w-full z-10 relative text-center min-h-[85vh]">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-12 flex flex-col items-center max-w-md w-full">
          <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Login Required</h2>
          <p className="text-slate-400 mb-8">You need to be logged in to scan and analyze your resume.</p>
          <button onClick={() => navigate('/auth')} className="px-8 py-3 bg-sky-400/20 text-sky-400 border border-sky-400/50 rounded-full font-bold hover:bg-sky-400/30 backdrop-blur-md transition-all shadow-lg shadow-sky-400/10 w-full">
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex-grow pt-32 pb-12 px-6 max-w-4xl mx-auto w-full z-10 relative flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Upload your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Resume</span>
        </h1>
        <p className="text-slate-400 text-lg flex items-center justify-center gap-2 font-medium">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Privacy Guaranteed
        </p>
      </div>

      <div className="w-full flex flex-col items-center">
        <div 
            onClick={handleBoxClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full bg-slate-900/40 border-2 border-dashed border-sky-400/30 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center transition-all hover:border-sky-400 hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-sky-400/10 group backdrop-blur-xl shadow-2xl relative overflow-hidden min-h-[350px] cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept=".pdf,.docx,.txt" 
            onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                }
            }}
          />
          
          <div className="w-20 h-20 bg-sky-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner border border-sky-400/20 group-hover:scale-110 transition-transform duration-500 relative z-10">
              <UploadCloud className="w-8 h-8 text-sky-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Drag & Drop your file here</h3>
          <p className="text-slate-400 text-lg relative z-10">
              or <span className="text-sky-400 font-semibold group-hover:underline">click to browse files</span>
          </p>
          <p className="text-slate-500 text-sm mt-4 relative z-10">Supports PDF, DOCX, and TXT (Max 5MB)</p>
        </div>
      </div>
    </div>
  );
};

export default Scan;
