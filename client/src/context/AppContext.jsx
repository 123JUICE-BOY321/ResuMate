import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAuthToken, analyzeResume, saveReport } from '../api';
import { parseFile } from '../utils/fileParser';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const navigate = useNavigate();

  const loadDependencies = async () => {
    if (!window.pdfjsLib) {
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    }
    loadDependencies();
  }, []);

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

  const handleFileUpload = async (resumeFile, jdFile = null) => {
    if (!resumeFile) return;
    
    setSelectedFile(resumeFile);
    navigate('/analyzing');
    setAnalyzingStep(1); // Extract Text
    setExtractedText('');

    try {
        const { text: resumeText, imagePreview } = await parseFile(resumeFile);
        
        let jdText = "";
        if (jdFile) {
            const parsedJd = await parseFile(jdFile);
            jdText = parsedJd.text;
        }

        setExtractedText(resumeText); 
        setAnalyzingStep(2); // AI Analysis

        const resultObj = await analyzeResume(resumeText, jdText);
        
        resultObj.fileName = resumeFile.name;
        resultObj.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        resultObj.imagePreview = imagePreview;
        
        setAnalyzingStep(3); // Finalize DB save
        setAnalysisResult(resultObj);
        
        if (user) {
            await saveReport({
                fileName: resumeFile.name,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                score: resultObj.overallScore,
                result: resultObj,
                rawText: resumeText,
                imagePreview: imagePreview
            });
        }
        
        setTimeout(() => navigate('/results'), 1000);

    } catch (err) {
        console.error("Error analyzing:", err);
        setExtractedText('Analysis failed: Server error or Gemini API limit reached.');
        setAnalyzingStep(0);
        navigate('/upload'); 
    }
  };

  const value = {
    user,
    setUser,
    selectedFile,
    setSelectedFile,
    analyzingStep,
    setAnalyzingStep,
    analysisResult,
    setAnalysisResult,
    extractedText,
    setExtractedText,
    handleLogout,
    handleFileUpload
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
