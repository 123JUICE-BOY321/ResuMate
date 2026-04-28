import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const PdfHighlighter = ({ file, highlights, savedCoords, imagePreview, activeHighlightId, setActiveHighlightId }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      let isMounted = true;
      const renderPdf = async () => {
          // If we have saved coordinates and no real file object with arrayBuffer, 
          // we can render using the imagePreview as a fallback for the first page.
          if (savedCoords && savedCoords.length > 0 && (!file || typeof file.arrayBuffer !== 'function')) {
              const pagesFromCoords = [];
              // We'll group by page number
              const pageNumbers = [...new Set(savedCoords.map(c => c.pageNumber))];
              
              pageNumbers.forEach(num => {
                  const firstCoordForPage = savedCoords.find(c => c.pageNumber === num);
                  pagesFromCoords.push({
                      id: num,
                      dataUrl: num === 1 ? imagePreview : null, // We only have image for page 1 usually
                      width: firstCoordForPage.pageWidth,
                      height: firstCoordForPage.pageHeight,
                      savedHighlights: savedCoords.filter(c => c.pageNumber === num),
                      isFallback: true
                  });
              });
              
              if (isMounted) {
                  setPages(pagesFromCoords);
                  setLoading(false);
              }
              return;
          }

          if (!file || typeof file.arrayBuffer !== 'function') {
              if (isMounted) setLoading(false);
              return;
          }

          try {
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
                      let tx = item.transform;
                      try {
                          if (window.pdfjsLib?.Util?.transform) {
                              tx = window.pdfjsLib.Util.transform(viewport.transform, item.transform);
                          }
                      } catch (e) {
                          console.warn("PDF transform failed:", e);
                      }
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
                  {page.isFallback ? (
                      // Render from saved coordinates
                      page.savedHighlights.map((sh, shIdx) => {
                          const hl = (highlights || []).find(h => String(h.id) === String(sh.highlightId));
                          if (!hl) return null;
                          const isActive = activeHighlightId === hl.id;
                          let bg = 'bg-amber-400/40 border-amber-400/60';
                          if (hl.color === 'red') bg = 'bg-red-400/40 border-red-400/60';
                          if (hl.color === 'green') bg = 'bg-emerald-400/40 border-emerald-400/60';

                          return (sh.rects || []).map((rect, i) => (
                              <div 
                                  key={`saved-${hl.id}-${i}-${shIdx}`}
                                  onMouseEnter={() => setActiveHighlightId(hl.id)}
                                  onMouseLeave={() => setActiveHighlightId(null)}
                                  className={`absolute cursor-pointer transition-all mix-blend-multiply rounded-sm px-[2px] py-[1px] -ml-[2px] -mt-[1px] ${bg} ${isActive ? 'ring-2 ring-sky-500 z-30 brightness-110 shadow-lg' : 'border-transparent z-20'}`}
                                  style={{
                                      left: `${rect.left}%`,
                                      top: `${rect.top}%`,
                                      width: `${rect.width}%`,
                                      height: `${rect.height}%`,
                                      borderBottomWidth: isActive ? '2px' : '0px'
                                  }}
                              />
                          ));
                      })
                   ) : (
                      // Render by searching text (Original logic)
                      Array.isArray(highlights) && highlights.map((hl, hlIndex) => {
                          if (!hl.text) return null;
                          let matchIdx = page.pageText.indexOf(hl.text);
                          let matchEnd = -1;
                          
                          if (matchIdx === -1) {
                              const cleanPageText = page.pageText.replace(/\s+/g, '');
                              const cleanHlText = hl.text.replace(/\s+/g, '');
                              const cleanMatchIdx = cleanPageText.indexOf(cleanHlText);
                              
                              if (cleanMatchIdx !== -1) {
                                  let cleanCounter = 0;
                                  for (let j = 0; j < page.pageText.length; j++) {
                                      if (page.pageText[j].trim() !== '') {
                                          if (cleanCounter === cleanMatchIdx) matchIdx = j;
                                          if (cleanCounter === cleanMatchIdx + cleanHlText.length) matchEnd = j;
                                          cleanCounter++;
                                      }
                                  }
                              }
                          } else {
                              matchEnd = matchIdx + hl.text.length;
                          }

                          if (matchIdx === -1 || matchEnd === -1) return null;
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
                      })
                   )}
              </div>
          ))}
      </div>
  );
};

export default PdfHighlighter;
