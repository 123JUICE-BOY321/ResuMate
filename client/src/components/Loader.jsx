import React from 'react';

const Loader = ({ analyzingStep }) => {
  const steps = [
    "Preparing secure parser...",
    "Extracting document text...",
    "Analyzing your resume...",
    "Finalizing your report..."
  ];

  return (
    <div className="flex-grow flex flex-col items-center justify-center pt-48 pb-32 w-full z-10 relative min-h-[85vh]">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-sky-500/20 blur-2xl rounded-full animate-[pulse-glow_4s_ease-in-out_infinite]"></div>
        
        <div className="relative w-32 h-40 bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/10 flex flex-col items-center shadow-2xl overflow-hidden p-1.5">
           <div className="absolute inset-3 flex flex-col gap-2 opacity-40">
             <div className="h-3 w-1/2 bg-sky-400 mx-auto rounded-full mb-1"></div>
             <div className="h-1.5 w-full bg-slate-400 rounded-full"></div>
             <div className="h-1.5 w-5/6 bg-slate-400 rounded-full"></div>
             <div className="h-1.5 w-full bg-slate-400 rounded-full"></div>
             <div className="h-1.5 w-2/3 bg-slate-400 rounded-full"></div>
             <div className="h-1.5 w-full bg-slate-400 rounded-full mt-2"></div>
             <div className="h-1.5 w-4/5 bg-slate-400 rounded-full"></div>
             <div className="h-1.5 w-full bg-slate-400 rounded-full"></div>
           </div>
           
           <div className="absolute left-0 right-0 h-[2px] bg-sky-400 shadow-[0_0_15px_3px_rgba(56,189,248,1)] animate-[scanline_2.5s_cubic-bezier(0.4,0,0.2,1)_infinite] z-20"></div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Processing Resume</h2>
      <div className="h-6 overflow-hidden">
        <p className="text-slate-400 animate-pulse text-lg tracking-wide font-medium" key={analyzingStep}>
          {steps[Math.min(analyzingStep, steps.length - 1)]}
        </p>
      </div>
    </div>
  );
};

export default Loader;
