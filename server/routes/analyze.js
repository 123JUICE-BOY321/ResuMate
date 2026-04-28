const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

router.post('/', auth, async (req, res) => {
    try {
        const { resumeText } = req.body;
        if (!resumeText) return res.status(400).json({ msg: 'No text provided' });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const promptText = `
        Analyze the following resume text and evaluate its quality based on ATS compatibility, keyword match, readability, formatting, and structure.
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
            "ats": { "score": number, "label": "ATS Compatibility", "color": "text-emerald-400", "icon": "ShieldCheck" },
            "keywords": { "score": number, "label": "Keyword Match", "color": "text-pink-400", "icon": "FileSearch" },
            "readability": { "score": number, "label": "Readability", "color": "text-indigo-400", "icon": "BookOpen" },
            "formatting": { "score": number, "label": "Formatting", "color": "text-purple-400", "icon": "Layout" },
            "structure": { "score": number, "label": "Structure", "color": "text-amber-400", "icon": "LayoutList" }
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
        Provide at least 4 highlights covering weak sentences, generic phrases, or good points. "text" MUST be an exact substring from the resume text provided below.
        Here is the resume text:
        ${resumeText}
        `;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: promptText }] }],
            systemInstruction: "You are an expert technical recruiter and ATS system analyst. Provide accurate, exact substring matches for highlights.",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const responseText = result.response.text();
        const jsonText = responseText.replace(/```json\n?|```/g, '').trim();
        const parsedResult = JSON.parse(jsonText);

        res.json(parsedResult);
    } catch (err) {
        console.error("Gemini API Error:", err.message);
        res.status(500).json({ msg: 'Failed to analyze resume' });
    }
});

module.exports = router;
