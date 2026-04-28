import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, FileText, Calendar, User, AlignLeft, File, Lightbulb, AlertTriangle, ShieldCheck, FileSearch, BookOpen, Layout, LayoutList, CheckCircle, Briefcase, GraduationCap, Cpu } from 'lucide-react';
import CircularProgress from '../components/CircularProgress';
import PdfHighlighter from '../components/PdfHighlighter';
import { useApp } from '../context/AppContext';

const METRIC_CONFIG = {
  ats: { label: "ATS Compatibility", color: "text-emerald-400", icon: "ShieldCheck" },
  keywords: { label: "Keyword Match", color: "text-pink-400", icon: "FileSearch" },
  readability: { label: "Readability", color: "text-indigo-400", icon: "BookOpen" },
  formatting: { label: "Formatting", color: "text-purple-400", icon: "Layout" },
  structure: { label: "Structure", color: "text-amber-400", icon: "LayoutList" }
};

const getIconComponent = (iconName) => {
  const icons = { ShieldCheck, FileSearch, BookOpen, Layout, LayoutList };
  const IconComponent = icons[iconName] || CheckCircle;
  return <IconComponent className="w-5 h-5" />;
};

const renderHighlightedText = (text, highlights = [], activeId, setActiveId) => {
  if (!text) return null;
  if (!Array.isArray(highlights) || highlights.length === 0) return <p className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">{text}</p>;

  let elements = [];
  let currentIndex = 0;
  const matches = [];

  highlights.forEach(h => {
      if (!h.text) return;
      const idx = text.indexOf(h.text);
      if (idx !== -1) {
          matches.push({ start: idx, end: idx + h.text.length, ...h });
      }
  });

  matches.sort((a, b) => a.start - b.start);

  const validMatches = [];
  let lastEnd = 0;
  matches.forEach(m => {
      if (m.start >= lastEnd) {
          validMatches.push(m);
          lastEnd = m.end;
      }
  });

  validMatches.forEach((match, i) => {
      if (match.start > currentIndex) {
          elements.push(<span key={`text-${i}`}>{text.slice(currentIndex, match.start)}</span>);
      }

      const isActive = activeId === match.id;
      const colorStyles = {
          red: 'bg-red-500/30 text-red-200 border-red-500/50 hover:bg-red-500/50',
          yellow: 'bg-amber-500/30 text-amber-200 border-amber-500/50 hover:bg-amber-500/50',
          green: 'bg-emerald-500/30 text-emerald-200 border-emerald-500/50 hover:bg-emerald-500/50'
      };
      const baseColor = colorStyles[match.color] || colorStyles.yellow;

      elements.push(
          <mark
              key={`mark-${i}`}
              className={`cursor-pointer rounded px-1 border-b-2 transition-all duration-200 ${baseColor} ${isActive ? 'ring-2 ring-white scale-[1.02] inline-block shadow-lg brightness-125' : ''}`}
              onClick={() => setActiveId(match.id)}
              onMouseEnter={() => setActiveId(match.id)}
              onMouseLeave={() => setActiveId(null)}
          >
              {text.slice(match.start, match.end)}
          </mark>
      );
      currentIndex = match.end;
  });

  if (currentIndex < text.length) {
      elements.push(<span key="text-end">{text.slice(currentIndex)}</span>);
  }

  return <div className="whitespace-pre-wrap text-slate-300 font-mono text-[13px] leading-relaxed tracking-wide">{elements}</div>;
};

const Analysis = () => {
  const { analysisResult, extractedText, selectedFile } = useApp();
  const [activeHighlightId, setActiveHighlightId] = useState(null);
  const navigate = useNavigate();
  const data = analysisResult || {};
  const normalizedExtractedData = Object.keys(data.extractedData || {}).reduce((acc, k) => {
    acc[k.toLowerCase()] = data.extractedData[k];
    return acc;
  }, {});
  
  const isPdf = selectedFile && selectedFile.type === 'application/pdf' && typeof selectedFile.arrayBuffer === 'function';

  return (
    <div className="flex-grow pt-32 pb-12 px-4 md:px-8 max-w-[90rem] mx-auto w-full z-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div className="flex flex-col items-start">
          <button onClick={() => navigate('/dashboard')} className="text-slate-400 text-sm mb-3 hover:text-white flex items-center transition bg-white/5 border border-white/10 px-4 py-1.5 rounded-full w-max">
            &larr; Back to Reports
          </button>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-3 flex items-center gap-3">
            <Target className="w-8 h-8 text-sky-400" />
            Analysis Report
          </h1>
          <div className="flex items-center gap-3 text-slate-400 text-sm font-medium flex-wrap">
             <span className="flex items-center gap-1.5 bg-slate-800/50 py-1 px-3 rounded-full border border-white/5">
                <FileText className="w-4 h-4 text-sky-400"/> 
                {data.fileName || selectedFile?.name || 'Resume_Document'}
             </span>
             <span className="flex items-center gap-1.5 bg-slate-800/50 py-1 px-3 rounded-full border border-white/5">
                <Calendar className="w-4 h-4 text-sky-400"/> 
                {data.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
             </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[75vh]">
        
        {/* Left Column - Metrics & Text */}
        <div className="lg:col-span-4 flex flex-col gap-8 h-full">
          
          {/* Header Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500"></div>
             <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Total Score</h2>
             
             <div className="relative w-32 h-32 rounded-full flex items-center justify-center border-[6px] border-slate-800 shadow-inner bg-slate-950">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="46%" className="stroke-slate-800 fill-none" strokeWidth="8"></circle>
                  <circle cx="50%" cy="50%" r="46%" className="stroke-sky-500 fill-none transition-all duration-1000 ease-out" strokeWidth="8" strokeDasharray="300" strokeDashoffset={300 - (300 * (data.overallScore || 0)) / 100} strokeLinecap="round"></circle>
                </svg>
                <div className="text-5xl font-black text-white">
                  {data.overallScore}
                </div>
            </div>
         </div>

        {['ats', 'keywords', 'readability', 'formatting', 'structure'].map((key, idx) => {
          const normalizedMetrics = Object.keys(data.metrics || {}).reduce((acc, k) => {
            acc[k.toLowerCase()] = data.metrics[k];
            return acc;
          }, {});
          const metric = normalizedMetrics[key.toLowerCase()] || { score: 0 };
          const config = METRIC_CONFIG[key];
          return (
            <div key={key} className="col-span-1 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex flex-col items-center justify-center shadow-2xl hover:bg-slate-800/90 transition-colors group">
              <CircularProgress value={Number(metric.score) || 0} size="md" color={config.color} />
              <div className={`mt-3 flex flex-col items-center gap-1.5 ${config.color}`}>
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {getIconComponent(config.icon)}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-center leading-tight">{config.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Column - Details */}
      <div className="lg:col-span-4 flex flex-col gap-6">
         
         {/* Profile Snippet */}
         <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
         <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
           <User className="w-5 h-5 text-teal-400"/> Profile
         </h3>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row flex-wrap items-start gap-x-12 gap-y-6 w-full">
                  {data.jobRole && (
                    <div>
                       <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Target Role</p>
                       <p className="text-white font-medium">{data.jobRole}</p>
                    </div>
                  )}

                  <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Experience</p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded text-white text-xs">
                          {normalizedExtractedData?.experiencelevel || 'Not detected'}
                      </div>
                  </div>

                 {normalizedExtractedData?.education?.[0] && (
                  <div className="flex-1 min-w-[200px]">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Education</p>
                      <p className="text-white text-sm font-bold truncate" title={normalizedExtractedData.education[0].degree}>
                         {normalizedExtractedData.education[0].degree}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5 truncate pl-5.5">{normalizedExtractedData.education[0].institution}</p>
                      <p className="text-slate-500 text-xs mt-0.5 pl-5.5">{normalizedExtractedData.education[0].year}</p>
                  </div>
                 )}
             </div>

             <div className="w-full">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Top Skills Detected</p>
                <div className="flex flex-wrap gap-2">
                   {Array.isArray(normalizedExtractedData?.skills) && normalizedExtractedData.skills.map((skill, idx) => {
                      const skillText = typeof skill === 'string' ? skill : (skill?.name || skill?.skill || skill?.keyword || JSON.stringify(skill));
                      return (
                        <span key={idx} className="px-2 py-1 bg-sky-900/30 border border-sky-400/20 text-sky-300 text-xs rounded-md">
                          {String(skillText)}
                        </span>
                      )
                   })}
                </div>
             </div>
         </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl relative flex flex-col h-[850px]">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                  {isPdf ? <File className="w-5 h-5 text-violet-400 mr-2"/> : <AlignLeft className="w-5 h-5 text-violet-400 mr-2"/>} 
                  {isPdf ? 'Resume Preview' : 'Parsed Resume Text'}
              </h3>
              <span className="text-xs text-slate-500 font-mono uppercase bg-black/30 px-2 py-1 rounded border border-white/5">Hover cards to highlight</span>
           </div>
           
           <div className={`flex-1 rounded-xl overflow-y-auto custom-scrollbar shadow-inner relative ${isPdf ? 'bg-slate-800/50' : 'bg-white/5 border border-white/10 p-6'}`}>
               {isPdf && (selectedFile?.arrayBuffer || (data.highlightCoords && data.highlightCoords.length > 0)) ? (
                   <PdfHighlighter 
                      file={selectedFile} 
                      highlights={data.highlights} 
                      savedCoords={data.highlightCoords}
                      imagePreview={data.imagePreview}
                      activeHighlightId={activeHighlightId} 
                      setActiveHighlightId={setActiveHighlightId} 
                   />
               ) : data.imagePreview ? (
                   <img src={data.imagePreview} className="w-full h-auto object-contain rounded" alt="Resume Preview" />
               ) : extractedText ? (
                   renderHighlightedText(extractedText, data.highlights, activeHighlightId, setActiveHighlightId)
               ) : (
                   <div className="h-full flex items-center justify-center text-slate-500 italic">No document data available.</div>
               )}
           </div>
        </div>

        <div className="lg:col-span-1 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl flex flex-col h-[850px]">
           <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-fuchsia-400"/> Feedback
           </h3>
           <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-3 pl-2 -ml-2 py-2 flex-1">
             {Array.isArray(data.highlights) && data.highlights.map((hl, idx) => {
               const isActive = activeHighlightId === hl.id;
               
               let borderColor = 'border-white/5';
               let dotColor = 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.8)]';
               if (hl.color === 'red') { borderColor = 'hover:border-red-400/50'; dotColor = 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'; }
               else if (hl.color === 'yellow') { borderColor = 'hover:border-amber-400/50'; dotColor = 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'; }
               else if (hl.color === 'green') { borderColor = 'hover:border-emerald-400/50'; dotColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'; }

               return (
                 <div 
                    key={hl?.id || idx} 
                    onMouseEnter={() => setActiveHighlightId(hl.id)}
                    onMouseLeave={() => setActiveHighlightId(null)}
                    className={`flex flex-col p-4 bg-slate-950/40 backdrop-blur-md rounded-xl border transition-all cursor-default ${borderColor} ${isActive ? 'ring-1 ring-sky-400/50 bg-black/50 scale-[1.02]' : 'border-white/5'}`}
                 >
                    <div className="flex items-center gap-2 mb-2">
                       <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
                       <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{hl.issueType || "Highlight"}</span>
                    </div>
                    
                    <p className="text-slate-300 text-[13px] leading-relaxed mb-3 italic border-l-2 border-slate-600 pl-3 py-1">
                       "{String(hl?.text || '')}"
                    </p>
                    
                    <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-2.5 mt-auto">
                      <p className="text-sky-100 text-[12px] font-medium leading-relaxed">
                         <span className="text-sky-400 font-bold mr-1">Fix:</span>
                         {String(hl?.fix || '')}
                      </p>
                    </div>
                 </div>
               );
             })}
             
             {(!data.highlights || data.highlights.length === 0) && (
               <div className="py-8 flex items-center justify-center text-slate-500 italic text-sm">No highlights returned by AI.</div>
             )}
           </div>
        </div>

      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
         <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
           <AlertTriangle className="w-5 h-5 text-amber-400"/> Optimization
         </h3>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {Array.isArray(data.weakSections) && data.weakSections.length > 0 && (
                <div>
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3">Sections to Improve</p>
                   <div className="flex flex-wrap gap-2">
                     {data.weakSections.map((sec, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-medium">
                          {sec}
                        </span>
                     ))}
                   </div>
                </div>
             )}

             <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3">Missing Keywords for ATS</p>
                <div className="flex flex-wrap gap-2">
                   {Array.isArray(data.missingKeywords) && data.missingKeywords.map((kw, idx) => {
                     const keywordText = typeof kw === 'string' ? kw : (kw?.keyword || kw?.skill || kw?.name || JSON.stringify(kw));
                     return (
                       <span key={idx} className="px-3 py-1.5 bg-sky-400/10 text-sky-400 border border-sky-400/30 rounded-full text-xs font-bold transition cursor-default">
                         + {String(keywordText)}
                       </span>
                     )
                   })}
                </div>
             </div>
         </div>
      </div>

    </div>
  );
};

export default Analysis;
