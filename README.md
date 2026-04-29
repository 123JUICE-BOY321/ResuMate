# ResuMate 🚀

ResuMate is a premium, AI-powered resume analysis and ATS scoring platform. It helps job seekers optimize their resumes by providing deep insights, keyword matching, and actionable feedback using state-of-the-art LLMs (Google Gemini).

## ✨ Features

- **AI Scoring Engine**: Get an instant ATS compatibility score based on industry standards.
- **Interactive PDF Highlighting**: See exactly where your resume needs improvement with visual markers directly on the document.
- **Keyword Match Analysis**: Identify critical missing skills and industry keywords to bypass automated filters.
- **Detailed Feedback**: Receive specific, actionable suggestions for improving your summary, experience, and formatting.
- **Profile Extraction**: Automatically detects your target role, experience level, and education.
- **Report History**: Save and manage multiple versions of your resume analysis in a sleek dashboard.
- **Premium Aesthetics**: A modern, dark-themed UI built with performance and user experience in mind.

## 🛠️ Technology Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** (Custom Design System)
- **Lucide React** (Iconography)
- **PDF.js** (Native document rendering and highlighting)
- **Mammoth.js** (DOCX to text conversion)
- **Axios** (API communication)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Database)
- **Google Gemini AI** (Analysis Engine)
- **JWT & Bcrypt** (Authentication)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or Local)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ResuMate.git
   cd ResuMate
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running Locally

1. **Start the Server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Client**
   ```bash
   cd client
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## 📁 Project Structure

```text
ResuMate/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # AppContext for state management
│   │   ├── pages/       # Main view components
│   │   └── api/         # Axios configuration
├── server/              # Express Backend
│   ├── models/          # Mongoose schemas (User, Report)
│   ├── routes/          # API endpoints
│   ├── controllers/     # Business logic
│   └── middleware/      # Auth & Error handling
└── README.md
```

## 🔒 Security

- **Environment Variables**: Sensitive keys (API keys, DB strings) are managed via `.env` and excluded from Git.
- **Data Privacy**: Resume text is processed securely and only stored if the user chooses to save the report.
- **Authentication**: Secure password hashing and JWT-based session management.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Built with ❤️ by the ResuMate Team.
