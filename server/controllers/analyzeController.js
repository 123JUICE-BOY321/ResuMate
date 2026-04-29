const { GoogleGenAI } = require('@google/genai');

exports.analyzeResume = async (req, res) => {
    try {
        const { resumeText, jdText } = req.body;
        if (!resumeText) return res.status(400).json({ msg: 'No text provided' });

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const promptText = `
        Analyze the following resume text. 
        ${jdText ? `CRITICAL CONTEXT: You MUST heavily weight this Job Description when scoring Keyword Match, ATS Compatibility, generating missing keywords, and inferring the Job Role. Here is the Job Description:\n"""\n${jdText}\n"""\n\n` : ''}
        Evaluate its quality based on ATS compatibility, keyword match, readability, formatting, and structure.
        Return a structured JSON object exactly like this schema:
        {
          "overallScore": number (0 to 100),
          "jobRole": "Inferred Target Role (e.g., Frontend Developer)",
          "extractedData": {
            "skills": [array of up to 6 top skills found],
            "experienceLevel": "Entry / Mid / Senior",
            "education": [
              {
                "degree": "string",
                "institution": "string",
                "year": "string"
              }
            ]
          },
          "metrics": {
            "ats": { "score": number },
            "keywords": { "score": number },
            "readability": { "score": number },
            "formatting": { "score": number },
            "structure": { "score": number }
          },
          "missingKeywords": [array of 5 important missing skills or industry keywords],
          "weakSections": [array of weak or missing sections (e.g., "Summary", "Projects")],
          "highlights": [
            {
              "id": number (e.g. 1, 2, 3),
              "text": "exact resume text substring from the document to highlight",
              "issueType": "weak-summary | missing-keywords | formatting | weak-impact | success",
              "severity": "critical | warning | success",
              "color": "red | yellow | green",
              "fix": "short improvement suggestion"
            }
          ]
        }
        Provide at least 6 to 8 highlights covering weak sentences, generic phrases, formatting issues, or good points. 
        CRITICAL: "text" MUST be an exact verbatim substring from the resume text provided below.
        CRITICAL: "fix" MUST NOT be empty. You must provide a specific, actionable improvement suggestion for EVERY single highlight.
        Here is the resume text:
        ${resumeText}
        `;

        // Removed strict responseSchema to match ResuMate.txt behavior

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: promptText }]
                }
            ],
            systemInstruction: {
                parts: [{ text: "You are an expert technical recruiter and ATS system analyst. Provide accurate, exact substring matches for highlights. Return only valid JSON." }]
            },
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0,
                maxOutputTokens: 8192
            }
        });

        let text = response.text;
        
        // Robustly extract JSON from markdown code blocks if present
        const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            text = jsonMatch[1].trim();
        } else {
            // Fallback: if no code blocks, try to find the first { and last }
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                text = text.substring(firstBrace, lastBrace + 1);
            }
        }

        const parsedResult = JSON.parse(text);
        res.json(parsedResult);
    } catch (err) {
        console.error("Gemini API Error:", err.message);
        res.status(500).json({ msg: 'Failed to analyze resume' });
    }
};
