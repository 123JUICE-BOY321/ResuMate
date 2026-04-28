import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Reports from './pages/Reports';
import Scan from './pages/Scan';
import Loader from './components/Loader';
import Analysis from './pages/Analysis';
import Settings from './pages/Settings';
import { setAuthToken, analyzeResume, saveReport } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      // In a real app, you might want to fetch user data with this token
      // For this 1-to-1 recreation, we assume user object is stored or we keep it simple.
      // But we need the user object. Let's just set a dummy user if token exists, 
      // or ideally we would have a /api/auth/me endpoint.
      // Since we didn't add /me, the user state is lost on refresh. 
      // Let's add user data to localStorage on login.
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    navigate('/');
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setSelectedFile(file);
    navigate('/analyzing');
    setAnalyzingStep(0); // Load Dependencies
    setExtractedText('');

    try {
        if (!window.pdfjsLib) {
            const script1 = document.createElement('script');
            script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            await new Promise(r => { script1.onload = r; document.head.appendChild(script1); });
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        if (!window.mammoth) {
            const script2 = document.createElement('script');
            script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
            await new Promise(r => { script2.onload = r; document.head.appendChild(script2); });
        }

        setAnalyzingStep(1); // Extract Text

        let resumeText = '';
        if (file.type === 'application/pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const pdf = await window.pdfjsLib.getDocument({ data: uint8Array }).promise;
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                let pageText = "";
                content.items.forEach(item => { pageText += item.str + " "; });
                resumeText += pageText + "\n";
            }
        } else if (file.name.endsWith('.docx')) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await window.mammoth.extractRawText({ arrayBuffer });
            resumeText = result.value;
        } else {
            resumeText = await file.text();
        }
        
        if (!resumeText || resumeText.trim().length < 20) {
            resumeText = "Error: Document appears to be heavily image-based or blank. ATS cannot parse this structure properly.";
        }

        setExtractedText(resumeText); 
        setAnalyzingStep(2); // AI Analysis

        const resultObj = await analyzeResume(resumeText);
        
        resultObj.fileName = file.name;
        resultObj.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        setAnalyzingStep(3); // Finalize DB save
        setAnalysisResult(resultObj);
        
        if (user) {
            await saveReport({
                fileName: file.name,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                score: resultObj.overallScore,
                result: resultObj,
                rawText: resumeText
            });
        }
        
        setTimeout(() => navigate('/results'), 1000);

    } catch (err) {
        console.error("Error analyzing:", err);
        setTimeout(() => navigate('/results'), 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-50 overflow-x-hidden selection:bg-sky-500/30 relative bg-[radial-gradient(rgba(56,189,248,0.25)_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_0%,#000000_100%)] bg-[size:40px_40px,100%_100%] bg-fixed">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[45%] h-[45%] rounded-full bg-sky-900/20 blur-[130px] animate-[pulse-glow_4s_ease-in-out_infinite]"></div>
        <div className="absolute top-[30%] right-[10%] w-[35%] h-[55%] rounded-full bg-blue-900/20 blur-[120px] animate-[pulse-glow_4s_ease-in-out_infinite]" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-slate-800/30 blur-[150px] animate-[pulse-glow_4s_ease-in-out_infinite]" style={{animationDelay: '2s'}}></div>
      </div>

      <NavBar user={user} handleLogout={handleLogout} />

      <main className="relative flex-grow flex flex-col items-center w-full">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/auth" element={<Login setUser={setUser} />} />
          <Route path="/dashboard" element={<Reports user={user} setAnalysisResult={setAnalysisResult} setExtractedText={setExtractedText} setSelectedFile={setSelectedFile} />} />
          <Route path="/upload" element={<Scan user={user} handleFileUpload={handleFileUpload} />} />
          <Route path="/analyzing" element={<Loader analyzingStep={analyzingStep} />} />
          <Route path="/results" element={<Analysis analysisResult={analysisResult} extractedText={extractedText} selectedFile={selectedFile} />} />
          <Route path="/settings" element={<Settings user={user} setUser={setUser} handleLogout={handleLogout} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
