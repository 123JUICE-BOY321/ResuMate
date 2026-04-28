
/**
 * Extracts coordinates for text highlights from a PDF file.
 * This is used to save highlight positions in the database for future re-rendering
 * without needing the original PDF file object.
 */
export const getPdfHighlightCoords = async (file, highlights) => {
    if (!file || !highlights || highlights.length === 0) return [];

    try {
        const arrayBuffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
        const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        const allSavedCoords = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            const textContent = await page.getTextContent();
            
            let pageText = "";
            const itemsMeta = textContent.items.map(item => {
                let tx = item.transform;
                if (window.pdfjsLib?.Util?.transform) {
                    tx = window.pdfjsLib.Util.transform(viewport.transform, item.transform);
                }
                const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
                const left = tx[4];
                const top = tx[5] - fontHeight;
                const width = item.width * viewport.scale;
                
                const start = pageText.length;
                pageText += item.str + " ";
                const end = pageText.length - 1;
                
                return { left, top, width, height: fontHeight, start, end };
            });

            highlights.forEach(hl => {
                if (!hl.text) return;
                let matchIdx = pageText.indexOf(hl.text);
                let matchEnd = -1;
                
                // Fallback: If exact match fails, try ignoring all spaces
                if (matchIdx === -1) {
                    const cleanPageText = pageText.replace(/\s+/g, '');
                    const cleanHlText = hl.text.replace(/\s+/g, '');
                    const cleanMatchIdx = cleanPageText.indexOf(cleanHlText);
                    
                    if (cleanMatchIdx !== -1) {
                        // Map the clean index back to the original text with spaces
                        let cleanCounter = 0;
                        for (let j = 0; j < pageText.length; j++) {
                            if (pageText[j].trim() !== '') {
                                if (cleanCounter === cleanMatchIdx) matchIdx = j;
                                if (cleanCounter === cleanMatchIdx + cleanHlText.length) matchEnd = j;
                                cleanCounter++;
                            }
                        }
                    }
                } else {
                    matchEnd = matchIdx + hl.text.length;
                }

                if (matchIdx !== -1 && matchEnd !== -1) {
                    const overlaps = itemsMeta.filter(item => item.end >= matchIdx && item.start <= matchEnd);
                    
                    if (overlaps.length > 0) {
                        allSavedCoords.push({
                            highlightId: hl.id,
                            pageNumber: i,
                            pageWidth: viewport.width,
                            pageHeight: viewport.height,
                            rects: overlaps.map(o => ({
                                left: (o.left / viewport.width) * 100,
                                top: (o.top / viewport.height) * 100,
                                width: (o.width / viewport.width) * 100,
                                height: (o.height / viewport.height) * 100
                            }))
                        });
                    }
                }
            });
        }
        return allSavedCoords;
    } catch (err) {
        console.error("Error extracting PDF coordinates:", err);
        return [];
    }
};
