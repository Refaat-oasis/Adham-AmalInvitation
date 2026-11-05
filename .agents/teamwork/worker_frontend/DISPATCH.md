## 2026-11-05T13:41:18Z
You are a Worker subagent in a multi-agent engineering team.
Your Role: Frontend React Migration Worker
Your Working Directory: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\worker_frontend
Original Request File: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\ORIGINAL_REQUEST.md
Project Scope File: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\PROJECT.md
Frontend Survey Report: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\explorer_survey_frontend\handoff.md
Domain Skill: C:\Users\ahta6\.gemini\config\skills\react-patterns\SKILL.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE OWNERSHIP:
You own all application files in `C:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\**`.
DO NOT modify `adham_aml_wedding_invitation.html` (treat it as the read-only authoritative visual reference).
DO NOT touch any files in `.agents\` (metadata folder) or outside `weddingInvitations\adham and amal`.

TASKS FOR MILESTONES M3 & M4:
1. Scaffold Vite + React (TypeScript) in `weddingInvitations\adham and amal`:
   - Initialize package.json, vite.config.ts, tsconfig.json, tailwindcss configuration.
   - Configure vite.config.ts proxy:
     ```ts
     server: {
       port: 5173,
       proxy: {
         '/api': {
           target: 'http://localhost:5101',
           changeOrigin: true
         }
       }
     }
     ```
   - In `index.html`: set `dir="rtl"`, `lang="ar"`, include Google Fonts (`Amiri`, `Cairo`, `Aref Ruqaa`, `Great Vibes`, `Alex Brush`, `Playfair Display`, `Cormorant Garamond`).
2. Migrate all visual sections and interactive behaviors from `adham_aml_wedding_invitation.html` with 100% fidelity:
   - Sparkles Canvas background with 48 floating golden particles.
   - Fixed top navigation bar with 3-bar animated equalizer, audio toggle, and doors replay button.
   - 3D Heavenly Doors entrance overlay with rotating left door ("Adham"), right door ("Aml"), central golden medallion button with crown emblem, cloud layers, and smooth unveil.
   - Hero section with Surah Ar-Rum 21, gold foil typography, live calligraphy font switcher (Script, Royal, Editorial).
   - Live Countdown Timer targeting Monday 8:00 PM with date adjustment controls.
   - Couple Photo Gallery with 4-card romantic grid and custom photo replacement capability.
   - Grand Star 2 Architectural Pencil Sketch with SVG graphite turbulence filters, dual paper modes (parchment vs night), and stroke drawing animation.
   - Venue Location & Route Section with route steps, Google Maps button, and Plus Code clipboard copy with toast feedback.
   - Web Audio API romantic synthesizer reproducing the harp/piano arpeggio melody without needing external MP3 files.
   - Footer.
3. Interactive Kind Words Component & API Integration (Milestone M4):
   - Service client in `src/services/api.ts` connecting to `/api/invitations/{slug}` and `/api/invitations/{slug}/messages` (default slug: `adham-amal`).
   - Interactive form: Guest Name, Attendance Status dropdown ("سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨" / "أرسل أجمل التهاني 🤍"), Message textarea.
   - Client-side validation: non-empty name, non-empty message, character counters.
   - Dynamic Wishes Wall: loading state, empty state, live message cards showing guest name, attendance badge, timestamp, and message.
   - Optimistic update on submit: append new message to state immediately, with spinner, toast notification, and error rollback preserving form content if the API fails.
4. Build verification:
   - Run `npm install` (or `bun install`) and `npm run build` (or `bun run build`) to ensure the application builds cleanly with 0 TypeScript or bundler errors.

DELIVERABLE:
Write a detailed handoff report to:
`c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\worker_frontend\handoff.md`
