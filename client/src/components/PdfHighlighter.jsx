import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const PdfHighlighter = ({ file, highlights, activeHighlightId, setActiveHighlightId }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      let isMounted = true;
      const renderPdf = async () => {
          try {
              if (!window.pdfjsLib) {
                  const script = document.createElement('script');
                  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                  await new Promise(resolve => {
                      script.onload = resolve;
                      document.head.appendChild(script);
                  });
                  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
              }

              const arrayBuffer = await file.arrayBuffer();
              const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
              const loadedPages = [];

              for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const viewport = page.getViewport({ scale: 1.5 });
                  
                  const canvas = document.createElement('canvas');
                  const context = canvas.getContext('2d');
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;
                  
                  await page.render({ canvasContext: context, viewport }).promise;
                  
                  const textContent = await page.getTextContent();
                  let pageText = "";
                  
                  const itemsMeta = textContent.items.map(item => {
                      const tx = window.pdfjsLib.Util.transform(viewport.transform, item.transform);
                      const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
                      
                      const left = tx[4];
                      const top = tx[5] - fontHeight;
                      const width = item.width * viewport.scale;
                      
                      const start = pageText.length;
                      pageText += item.str + " ";
                      const end = pageText.length - 1;
                      
                      return { left, top, width, height: fontHeight, start, end, str: item.str };
                  });
                  
                  loadedPages.push({
                      id: i,
                      dataUrl: canvas.toDataURL(),
                      width: viewport.width,
                      height: viewport.height,
                      items: itemsMeta,
                      pageText: pageText
                  });
              }
              if (isMounted) {
                  setPages(loadedPages);
                  setLoading(false);
              }
          } catch(e) {
              console.error(e);
              if (isMounted) setLoading(false);
          }
      };
      if (file) renderPdf();
      return () => { isMounted = false; };
  }, [file]);

  if (loading) {
      return (
          <div className="h-full flex flex-col items-center justify-center text-sky-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm font-mono text-slate-400 uppercase tracking-widest">Rendering Document View...</p>
          </div>
      );
  }

  return (
      <div className="flex flex-col gap-6 items-center w-full p-4">
          {pages.map(page => (
              <div key={page.id} className="relative bg-white shadow-2xl rounded mx-auto" style={{ width: '100%', maxWidth: `${page.width}px` }}>
                  <img src={page.dataUrl} className="w-full h-auto block rounded" alt={`Page ${page.id}`} />
                  
                  {highlights?.map((hl, hlIndex) => {
                      if (!hl.text) return null;
                      const matchIdx = page.pageText.indexOf(hl.text);
                      if (matchIdx === -1) return null; // Text not found on this page
                      
                      const matchEnd = matchIdx + hl.text.length;
                      const overlaps = page.items.filter(item => item.end >= matchIdx && item.start <= matchEnd);
                      
                      const isActive = activeHighlightId === hl.id;
                      let bg = 'bg-amber-400/40 border-amber-400/60';
                      if (hl.color === 'red') bg = 'bg-red-400/40 border-red-400/60';
                      if (hl.color === 'green') bg = 'bg-emerald-400/40 border-emerald-400/60';

                      return overlaps.map((item, i) => (
                          <div 
                              key={`${hl.id}-${i}-${hlIndex}`}
                              onMouseEnter={() => setActiveHighlightId(hl.id)}
                              onMouseLeave={() => setActiveHighlightId(null)}
                              className={`absolute cursor-pointer transition-all mix-blend-multiply rounded-sm px-[2px] py-[1px] -ml-[2px] -mt-[1px] ${bg} ${isActive ? 'ring-2 ring-sky-500 z-10 brightness-110 shadow-lg' : 'border-transparent'}`}
                              style={{
                                  left: `${(item.left / page.width) * 100}%`,
                                  top: `${(item.top / page.height) * 100}%`,
                                  width: `${(item.width / page.width) * 100}%`,
                                  height: `${(item.height / page.height) * 100}%`,
                                  borderBottomWidth: isActive ? '2px' : '0px'
                              }}
                          />
                      ));
                  })}
              </div>
          ))}
      </div>
  );
};

export default PdfHighlighter;
