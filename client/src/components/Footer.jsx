import React from 'react';
import { Globe } from 'lucide-react';

const Footer = () => (
  <footer className="relative z-10 pt-24 overflow-hidden mt-auto w-full">
      <div className="flex flex-col items-center gap-6">
          <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5 backdrop-blur-md group">
              <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </a>

          <div className="text-slate-500 text-xs font-medium tracking-wide">
              &copy; {new Date().getFullYear()} RESUMATE
          </div>

          <h1 className="text-[18vw] leading-none font-bold text-white/5 tracking-tighter select-none pointer-events-none mt-8">
              RESUMATE
          </h1>
      </div>
  </footer>
);

export default Footer;
