# TaskFlow AI — Integrated Workplace Productivity Hub

TaskFlow AI is a unified, AI-powered workplace operations dashboard designed to eliminate context switching and automate everyday professional workflows. Built with a modern responsive UI, the platform transforms unstructured meeting notes, rough bullets, and task backlogs into execution-ready assets.

---

## 📌 Project Overview
Modern workplace productivity is fragmented across single-purpose tools. TaskFlow AI consolidates executive communication, meeting synthesis, task prioritization, and on-demand workflow support into a single dashboard. 

The platform leverages structured JSON prompt engineering and streaming LLM pipelines to provide reliable, formatted outputs while enforcing human-in-the-loop validation.

---

## 🚀 Key Features

* **Meeting Notes Summarizer:** Ingests raw meeting transcripts or bullet points and extracts:
  * A concise 2–3 sentence Executive Summary.
  * Categorized Key Decisions.
  * An interactive Action Items Table (`Owner`, `Task`, `Priority`, `Deadline`).
* **Smart Email Generator:** Converts rough notes into tone-adjusted professional emails (*Formal*, *Friendly*, *Persuasive*, *Assertive*) with 3 suggested subject lines, an editable draft window, and one-click clipboard copying.
* **AI Task Planner & Scheduler:** Applies the Eisenhower Matrix (Urgent/Important) to classify tasks and generates an optimized daily time-blocked schedule with automated workload limit tracking.
* **Workplace Assistant Chatbot:** A streaming conversational interface with starter prompt chips designed to assist with ad-hoc workflow planning and cross-module drafting.

---

## 🛠️ Tools & Tech Stack

* **Frontend Framework:** React 18, Vite, TypeScript
* **UI & Styling:** Tailwind CSS, Shadcn UI, Lucide React Icons
* **AI Integration:** AI SDK (`@ai-sdk/react`), Lovable AI Gateway Engine
* **Rapid Prototyping & Backend:** Lovable.dev, Supabase Edge Functions
* **Version Control & Hosting:** GitHub, Lovable Cloud Deploy / Vercel

---

## 🛡️ Responsible AI & Guardrails

* **Persistent Safety Banner:** A global disclaimer visible on all screens reminding users that outputs are AI-generated and require human verification.
* **Human-in-the-Loop:** All drafts, scheduled items, and generated action items require explicit user approval and remain fully editable.
* **Client-Side Data Sanitization:** Input forms include client-side regex checks to detect and warn users against pasting sensitive credentials or payment data.

---

## ⚙️ Setup & Local Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/AI-Productivity-Assistant.git](https://github.com/your-username/AI-Productivity-Assistant.git)
   cd AI-Productivity-Assistant
