# ⚖️ AI Legal Clause Analyzer

An AI-powered web app that analyzes legal clauses for risks, missing terms, and provides plain-English summaries using Claude AI.

**Live Demo**: [Deploy to Vercel](#deployment)
**Built with**: React + TypeScript + Tailwind CSS + Claude API

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/ai-legal-analyzer.git
cd ai-legal-analyzer
npm install
```

### 2. Set up API Key
```bash
cp .env.example .env
```
Open `.env` and add your Claude API key:
```
VITE_CLAUDE_API_KEY=your_claude_api_key_here
```
Get your key at: https://console.anthropic.com/

### 3. Run Locally
```bash
npm run dev
```
Open http://localhost:5173

---

## 📦 Deployment to Vercel

```bash
npm install -g vercel
vercel
```
When prompted, add environment variable:
- Key: `VITE_CLAUDE_API_KEY`
- Value: your Claude API key

Or deploy via Vercel dashboard → Settings → Environment Variables.

---

## 🔧 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Claude API | AI analysis |
| Vite | Build tool |
| Vercel | Deployment |

---

## ⚠️ Disclaimer
This tool is for informational purposes only and does not constitute legal advice.
