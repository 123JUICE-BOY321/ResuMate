import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, UploadCloud, FileText, Briefcase, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Scan = () => {
  const { user, handleFileUpload } = useApp();
  const resumeInputRef = useRef(null);
  const jdInputRef = useRef(null);
  const navigate = useNavigate();
  
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);

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

  const startAnalysis = () => {
      if (resumeFile) {
          handleFileUpload(resumeFile, jdFile);
      }
  };

  return (
    <div className="flex-grow pt-32 pb-12 px-6 max-w-5xl mx-auto w-full z-10 relative flex flex-col items-center justify-start">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Upload your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Documents</span>
        </h1>
        <p className="text-slate-400 text-lg flex items-center justify-center gap-2 font-medium">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Privacy Guaranteed
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        
        {/* Resume Dropzone */}
        <div 
            onClick={() => resumeInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) setResumeFile(e.dataTransfer.files[0]); }}
            className={`w-full border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[300px] group relative overflow-hidden ${resumeFile ? 'bg-sky-500/10 border-sky-400/50 shadow-sky-500/20 shadow-lg' : 'bg-slate-900/40 border-slate-600/50 hover:border-sky-400/50 hover:bg-slate-800/60'}`}
        >
          <input ref={resumeInputRef} type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => { if (e.target.files[0]) setResumeFile(e.target.files[0]); }} />
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform duration-500 ${resumeFile ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-400'}`}>
              <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Resume (Required)</h3>
          {resumeFile ? (
              <p className="text-sky-400 font-medium break-all">{resumeFile.name}</p>
          ) : (
              <p className="text-slate-400 text-sm">Drag & drop or <span className="text-sky-400">browse</span></p>
          )}
        </div>

        {/* Job Description Dropzone */}
        <div 
            onClick={() => jdInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) setJdFile(e.dataTransfer.files[0]); }}
            className={`w-full border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[300px] group relative overflow-hidden ${jdFile ? 'bg-sky-500/10 border-sky-400/50 shadow-sky-500/20 shadow-lg' : 'bg-slate-900/40 border-slate-600/50 hover:border-sky-400/50 hover:bg-slate-800/60'}`}
        >
          <input ref={jdInputRef} type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => { if (e.target.files[0]) setJdFile(e.target.files[0]); }} />
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform duration-500 ${jdFile ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-400'}`}>
              <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Job Description (Optional)</h3>
          {jdFile ? (
              <p className="text-sky-400 font-medium break-all">{jdFile.name}</p>
          ) : (
              <p className="text-slate-400 text-sm">Compare against a specific role</p>
          )}
        </div>

      </div>

      <button 
        onClick={startAnalysis}
        disabled={!resumeFile}
        className={`px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center transition-all w-full md:w-auto shadow-xl ${resumeFile ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-sky-500/20 transform hover:-translate-y-1' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
      >
          <Play className="w-5 h-5 mr-2" /> Start Analysis
      </button>

    </div>
  );
};

export default Scan;
