# 🚀 TaskMaster AI - Intelligent Task Management & Planning Platform

[![CI/CD Pipeline](https://github.com/RohithSV2/AI-task-manager/actions/workflows/deploy.yml/badge.svg)](https://github.com/RohithSV2/AI-task-manager/actions/workflows/deploy.yml)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat&logo=vercel&logoColor=white)](https://ai-task-manager-nine-eta.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Live Production Deployment:** [https://ai-task-manager-nine-eta.vercel.app](https://ai-task-manager-nine-eta.vercel.app)  
**GitHub Repository:** [https://github.com/RohithSV2/AI-task-manager](https://github.com/RohithSV2/AI-task-manager)

**TaskMaster AI** is an intelligent, modern task management application built for individuals, students, developers, and teams. It pairs a sleek Kanban and Eisenhower Matrix workflow with AI-driven natural language task creation, automated subtask breakdowns, intelligent urgency prioritization, and personal productivity coaching.

---

## 🌟 Key Features

### 1. 🤖 Smart AI Task Engine
- **Natural Language & Voice Input**: Type tasks in plain English like *"Prepare investor slide deck by Friday 3pm with high priority and 3 subtasks"* or *"Schedule dental checkup tomorrow morning"*. The AI automatically extracts the task title, category, priority, due date, estimated duration, and sub-actions.
- **Automated Milestone Breakdown**: Complex projects can be decomposed with a single click into manageable, time-estimated subtasks.
- **Eisenhower Matrix Auto-Sorting**: Automatically evaluates tasks across 4 focus quadrants (*Q1: Do First*, *Q2: Schedule / Focus*, *Q3: Delegate / Quick Wins*, *Q4: Eliminate*) to maximize daily output.
- **AI Task Copilot**: An interactive productivity assistant for daily standup briefings, sprint planning, and actionable time-management advice.

### 2. 📋 Flexible Task Management Views
- **Kanban Board**: Drag-and-drop / 1-click status transitions across 5 columns (*Backlog*, *To Do*, *In Progress*, *Review*, *Completed*).
- **Eisenhower Decision Matrix**: Visual 2x2 grid sorting tasks by urgency and importance.
- **Productivity Analytics**: Real-time velocity tracking, completion percentages, time logging, and category distribution charts.

### 3. 🎯 Versatile Categories
Built for all aspects of daily life and work:
- 💼 **Work**: Strategic goals, meetings, client deliverables.
- 💻 **Development**: Code refactoring, bug fixes, features.
- 🎨 **Design**: UI/UX wireframes, branding, prototypes.
- 📚 **Study**: Exam preparation, assignments, reading.
- 🏃 **Health**: Fitness routines, workouts, wellness.
- 👤 **Personal**: Travel plans, home errands, leisure.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend & APIs**: Next.js Serverless Route Handlers (`/api/tasks`, `/api/ai/parse`, `/api/ai/breakdown`, `/api/ai/prioritize`, `/api/ai/chat`).
- **AI Engine**: Google Gemini 1.5 Flash API with built-in heuristic rule-based fallback for 100% offline reliability.
- **State & Storage**: Client-side LocalStorage persistence with Serverless REST datastore synchronization.
- **Deployment & CI/CD**: Vercel Edge Serverless Deployment + GitHub Actions CI/CD pipeline.

---

## 🚀 Getting Started (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/RohithSV2/AI-task-manager.git
cd AI-task-manager

# 2. Install dependencies
npm install

# 3. (Optional) Configure Gemini API Key
# If omitted, the app uses its built-in heuristic AI engine
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment

### Push to GitHub (Automated Vercel Deployment)
```bash
git add .
git commit -m "feat: enhance AI task manager"
git push origin main
```

Every push to `main` automatically triggers deployment on Vercel and runs the GitHub Actions test workflow.

---

## 📜 License
Distributed under the MIT License.
