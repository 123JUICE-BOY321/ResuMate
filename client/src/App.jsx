import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Reports from './pages/Reports';
import Scan from './pages/Scan';
import Loader from './components/Loader';
import Analysis from './pages/Analysis';
import Settings from './pages/Settings';
import Background from './components/Background';

export default function App() {
  return (
    <AppContextProvider>
      <div className="min-h-screen flex flex-col font-sans text-slate-50 overflow-x-hidden selection:bg-sky-500/30 relative bg-slate-950">
        <Background />
        <Navbar />
        <main className="relative flex-grow flex flex-col items-center w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/dashboard" element={<Reports />} />
            <Route path="/upload" element={<Scan />} />
            <Route path="/analyzing" element={<Loader />} />
            <Route path="/results" element={<Analysis />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppContextProvider>
  );
}
