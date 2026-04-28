import mammoth from 'mammoth';

export const parseFile = async (file) => {
    let resumeText = '';
    let imagePreview = null;
    
    if (file.type === 'application/pdf') {
        const arrayBuffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
        const uint8Array = new Uint8Array(arrayBuffer);
        const pdf = await window.pdfjsLib.getDocument({ data: uint8Array }).promise;
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            
            if (i === 1) {
                const viewport = page.getViewport({ scale: 1.2 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
                imagePreview = canvas.toDataURL('image/jpeg', 0.7);
            }

            const content = await page.getTextContent();
            let pageText = "";
            content.items.forEach(item => { pageText += item.str + " "; });
            resumeText += pageText + "\n";
        }
    } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        resumeText = result.value;
    } else {
        resumeText = await file.text();
    }
    
    if (!resumeText || resumeText.trim().length < 20) {
        resumeText = "Error: Document appears to be heavily image-based or blank. ATS cannot parse this structure properly.";
    }

    return { text: resumeText, imagePreview };
};
