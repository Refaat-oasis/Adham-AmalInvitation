# Frontend Assets Exploration & React Migration Architecture Report
**Target Location**: `weddingInvitations/adham and amal`  
**Original HTML**: `adham_aml_wedding_invitation.html`  
**Report Date**: 2026-11-05  
**Author**: Teamwork Frontend Assets Explorer  

---

## 1. Observation

### 1.1 Local Workspace Survey
- **Current Directory**: `C:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal`
- **Existing Files in Directory**:
  - `adham_aml_wedding_invitation.html` (104,907 bytes, 1,842 lines)
  - `.agents/` directory (agent orchestration metadata only)
  - **No existing React setup, `package.json`, or node_modules** currently exists in `adham and amal`.
- **System Environment**:
  - Node.js: `v24.21.0`
  - npm: `11.19.0`
  - Bun: `1.4.2`
- **Related Workspace Projects**:
  - `C:\Users\ahta6\OneDrive\Desktop\invitations website\Farhetna`: Vite + React + TanStack platform proxying to `http://localhost:5101`.
  - `C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api`: ASP.NET Core Web API running on `http://localhost:5101` (`https://localhost:7264`).
  - `C:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\1\gilded-unfold-experience`: Vite + React template with Tailwind CSS v4.

---

### 1.2 Inventory of `adham_aml_wedding_invitation.html`

#### A. Document Head, Fonts & Typography (Lines 1–13)
- **HTML Settings**: `<html lang="ar" dir="rtl" class="scroll-smooth">`
- **Tailwind CDN**: Loaded via `<script src="https://cdn.tailwindcss.com"></script>`
- **Google Fonts Imported**:
  - `Amiri` (`ital,wght@0,400;0,700;1,400;1,700`): Classical Quranic verses and ceremonial Arabic text (`font-arabic`).
  - `Cairo` (`wght@400;500;600;700`): Modern Arabic UI typography (`font-ui-ar`).
  - `Aref Ruqaa` (`wght@400;700`): Arabic calligraphy for names and plaques (`font-ruqaa`).
  - `Great Vibes` & `Alex Brush`: Flowing English calligraphic cursive script (`name-italic-script`).
  - `Playfair Display` & `Cormorant Garamond`: High-contrast serif for royal/editorial headings (`name-italic-royal`, `name-italic-editorial`).

#### B. CSS Tokens & Custom Animations (Lines 14–279)
- **CSS Custom Properties**:
  - `--gold-light: #fbe6a2`
  - `--gold-mid: #d4af37`
  - `--gold-deep: #99741c`
  - `--ivory-bg: #fdfbf7`
  - `--celestial-dark: #070b14`
- **Keyframe Animations**:
  - `goldShimmer`: 6s linear infinite gradient movement across `.gold-foil-text`.
  - `medallionFloat`: 3.4s floating animation with glowing amber drop-shadow on the center door medallion.
  - `bloomFlashFade`: Radial flash expander when doors open.
  - `eqBounce`: Music equalizer bar heights (4px to 14px alternate).
  - `drawPencilStroke`: SVG stroke dashoffset animation (2200 to 0) simulating real-time pencil sketching of Grand Star 2.

#### C. Visual & Interactive Sections Detailed
1. **Celestial Sparkles Canvas** (Lines 285–287, 1794–1834):
   - Background `<canvas id="celestialCanvas">` with 48 floating golden particles with smooth Brownian drift and wrap-around physics.
2. **Sticky Top Bar** (Lines 290–340):
   - Monogram badge `A&A`, cursive couple title `Adham & Aml`.
   - Arabic navigation anchors: `العروسين`, `العد التنازلي`, `ألبوم الصور`, `رسم القاعة`, `موقع الفرح`, `التهاني`.
   - Music toggle button with 3-bar animated equalizer.
   - Replay Heaven Doors button (`replayHeavenDoors()`).
3. **Floating Mobile Music Toggle** (Lines 342–351):
   - Fixed bottom-left button for quick mobile audio control.
4. **3D Heavenly Doors Entrance Overlay** (Lines 353–468, 1504–1562):
   - 3D perspective stage (`perspective: 2400px; direction: ltr`).
   - Left door: Inscription "العريس", cursive "Adham", Ruqaa "أدهم", gold filigree SVG, rotates `rotateY(-112deg)` on click.
   - Right door: Inscription "العروسة", cursive "Aml", Ruqaa "أمل", mirrored filigree SVG, rotates `rotateY(112deg)` on click.
   - Center golden interactive medallion button with crown emblem, rotating dashed accent ring, and CTA button "اضغط لفتح أبواب الدعوة".
   - Soft heavenly cloud layers at the bottom (`.cloud-left`, `.cloud-right`).
   - Clicking triggers doors open animation, starts background music, unveils the main content, and triggers the pencil sketch animation.
5. **Hero Section** (Lines 474–574):
   - Quranic Verse: Surah Ar-Rum 21 in classical Amiri font.
   - Massive gold foil names: "Adham" & "Aml" with ornate SVG divider, Arabic "أدهم ♡ أمل".
   - Live Italic Style Switcher: 3 pills to switch font between Script (`Great Vibes`), Royal (`Playfair Display`), and Editorial (`Cormorant Garamond`).
   - Arabic invitation narrative.
   - Event summary badges: Date (Monday 8:00 PM), Hall (Grand Star 2), Location (Manqabad -> Bani Ghaleb Road, Asyut).
6. **Live Countdown Section** (Lines 576–649, 1588–1669):
   - Live countdown calculating time to upcoming Monday at 8:00 PM (`getNextMondayAt8PM()`).
   - 4 luxury cards (days, hours, minutes, seconds).
   - Date Adjuster box (`dateAdjusterBox`) with datetime picker, "حفظ الموعد", and reset button.
   - Dynamic celebratory status note on zero diff.
7. **Photo Gallery Section** (Lines 650–752, 1671–1686):
   - 4-card romantic grid (3:4 aspect ratio) with golden borders.
   - Each card contains an interactive "تغيير الصورة" file input allowing guests/admins to preview custom local photos via `FileReader.readAsDataURL`.
8. **Architectural Sketch Section — Grand Star 2** (Lines 754–1145, 1688–1714):
   - Custom hand-drawn vector sketch of the Grand Star 2 facade (840x780 SVG).
   - SVG filters: `realisticGraphite` turbulence filter, cross-hatch pattern, fluted columns, grand archway with lamp glow, floral arches, overhanging leaf blades.
   - Paper Switcher: Parchment mode (`sketch-parchment-paper`) vs Night golden ink (`sketch-night-paper`).
   - Redraw Sketch button (`replaySketchDrawing()`).
9. **Venue Location & Route Section** (Lines 1147–1285, 1716–1732):
   - 3-step visual route flow: Manqabad Road -> Manqabad-Bani Ghaleb Road -> Grand Star 2.
   - Plus Code: `52PV+MP, Bani Ghaleb, Asyut, Assiut Governorate`.
   - Google Maps external navigation button (`https://www.google.com/maps/search/?api=1&query=52PV%2BMP%2C+Bani+Ghaleb%2C+Asyut%2C+Assiut+Governorate`).
   - Copy address button with clipboard API and toast feedback.
   - Stylized route diagram SVG with animated radar pulse pin.
10. **Guestbook & RSVP Section** (Lines 1287–1356, 1734–1775):
    - Form: Name input, Attendance dropdown ("سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨" / "أرسل أجمل التهاني 🤍"), Message textarea.
    - Pre-populated wishes list.
    - Original behavior is purely client-side DOM prepending without persistent API integration.
11. **Footer** (Lines 1358–1370):
    - Monogram, names, venue and date summary.
12. **Toast Notification** (Lines 1372–1379, 1779–1791):
    - Fixed bottom-right toast with checkmark for user actions.
13. **Continuous Audio Synthesizer** (Lines 1383–1502):
    - Pure browser Web Audio API: Uses `AudioContext`, dual oscillators (sine and triangle), exponential attack/decay gains.
    - Plays a 4-chord romantic arpeggio progression (Fmaj7 -> G6 -> Em7 -> Am9) every 2.6s.
    - Zero external MP3 network dependencies.

---

## 2. Logic Chain: React Architecture & Component Decomposition

### 2.1 Technical Stack Selection
- **Build Tool**: Vite (matching Farhetna and gilded-unfold-experience in the same workspace).
- **Language**: TypeScript (`.tsx`, `.ts`).
- **Styling**: Tailwind CSS + custom CSS tokens (`index.css`) preserving exact colors, gradients, filters, and 3D transforms.
- **Network / Proxy**: Vite reverse proxy forwarding `/api` to `http://localhost:5101` (ASP.NET Core Web API).

### 2.2 Component Hierarchy
```text
src/
├── index.css                    # CSS variables, animations, 3D doors, sketch filters
├── main.tsx                     # React root
├── App.tsx                      # Master layout, door-unlock state, global coordination
├── types/
│   └── invitation.ts            # Data models: Invitation, KindWord, GuestFormState
├── services/
│   └── api.ts                   # Fetch client for GET /api/invitations/{slug}, GET/POST messages
├── hooks/
│   ├── useWeddingMusic.ts       # Web Audio API arpeggio synthesizer, eq state, toggle
│   ├── useCountdown.ts          # Target Monday 8:00 PM calculation & live tick
│   ├── useKindWords.ts          # Fetching, optimistic posting, error rollback for guestbook
│   └── useToast.ts              # Global notification toast controller
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx           # Floating navigation & header controls
│   │   ├── FloatingMusicBtn.tsx # Bottom-left mobile music button
│   │   └── Footer.tsx           # Monogram and event details footer
│   ├── entrance/
│   │   └── HeavenDoorsOverlay.tsx # 3D door panels, medallion seal, clouds, animations
│   ├── sections/
│   │   ├── HeroSection.tsx      # Verse, gold-foil names, font switcher pills
│   │   ├── CountdownSection.tsx # 4 luxury cards, date adjuster popover
│   │   ├── GallerySection.tsx   # 4 photo cards with file upload replacement
│   │   ├── VenueSketchSection.tsx # Neoclassical SVG sketch, paper modes, redraw trigger
│   │   ├── LocationSection.tsx  # Route flow, map SVG, Plus code, copy & open buttons
│   │   └── GuestbookSection.tsx # Kind Words interactive form & dynamic live messages list
│   └── ui/
│       ├── CelestialCanvas.tsx  # Floating golden particle canvas
│       └── ToastNotification.tsx# Floating feedback toast
```

### 2.3 State Management Strategy
- **Door & Unlock State**: Managed in `App.tsx` (`isUnlocked: boolean`). When unlocked:
  - Header appears (`opacity-100 translate-y-0`).
  - Staggered reveals triggered.
  - Sketch drawing animation triggers.
  - Synthesizer music initiates.
- **Audio Synthesizer State**: Centralized in `useWeddingMusic` custom hook to sync the TopBar equalizer, TopBar toggle button, and Floating Mobile toggle button simultaneously.
- **Italic Style Preference**: Local state (`'script' | 'royal' | 'editorial'`) in `HeroSection.tsx`.
- **Sketch Paper Mode**: Local state (`'parchment' | 'night'`) in `VenueSketchSection.tsx`.
- **Kind Words State**: Encapsulated in `useKindWords` custom hook for server sync and optimistic updates.

---

## 3. Kind Words / Guestbook UX & API Integration Design

### 3.1 Backend Contract Alignment
- **Invitation Slug**: `adham-amal`
- **Endpoints**:
  1. `GET /api/invitations/adham-amal`: Returns invitation metadata (`title`, `slug`, `eventDate`, `venueName`, `isActive`).
  2. `GET /api/invitations/adham-amal/messages`: Returns array of approved kind words.
  3. `POST /api/invitations/adham-amal/messages`: Submits new kind word message.

### 3.2 Expected Payload Structure
- **POST Request**:
  ```json
  {
    "guestName": "المهندس محمود والعائلة",
    "attendanceStatus": "سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨",
    "message": "بارك الله لكما وبارك عليكما وجمع بينكما في خير..."
  }
  ```
- **Response**: `201 Created` with created message record:
  ```json
  {
    "id": 42,
    "invitationSlug": "adham-amal",
    "guestName": "المهندس محمود والعائلة",
    "attendanceStatus": "سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨",
    "message": "بارك الله لكما وبارك عليكما وجمع بينكما في خير...",
    "createdAt": "2026-11-05T15:20:00Z"
  }
  ```

### 3.3 UX/UI Behavior Specifications
1. **Validation**:
   - `guestName`: Min 2 characters, max 100 characters. Trim whitespace. Required.
   - `message`: Min 5 characters, max 1000 characters. Trim whitespace. Required.
   - `attendanceStatus`: Select option (`سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨` or `أرسل أجمل التهاني والمباركات 🤍`).
   - Clear Arabic validation feedback inline if inputs are invalid.
2. **Optimistic Updates**:
   - On valid submit, generate a temporary optimistic item with `isOptimistic: true`, immediately prepend to the list.
   - Show a subtle animated glowing border or badge "جارٍ الإرسال...".
3. **Loading & Submitting States**:
   - Initial fetch: Display 2 subtle skeleton card placeholders with shimmer.
   - Submitting: Submit button enters disabled loading state with spinner and text "جارٍ إرسال التهنئة...".
4. **Error Handling & Rollback**:
   - If `POST` fails (network drop or 5xx/4xx):
     - Roll back optimistic message from list.
     - Keep user's entered text in form inputs so data is not lost.
     - Display clear error toast / banner: "عذراً، تعذر إرسال التهنئة. يرجى المحاولة مرة أخرى."
5. **Success Feedback**:
   - Reset form fields.
   - Trigger Toast: `شكراً لك يا [الاسم]! تم استلام تهنئتك للعروسين بنجاح 🤍`.
   - Smooth scroll new message into view.
6. **Graceful Fallback**:
   - If backend API is not yet seeded or unreachable, display friendly default wishes with an indicator: `رسائل المباركة الافتراضية` and a "تحديث" (Refresh) button.

---

## 4. Assets & Preservation Checklist

| Asset | Source in HTML | React Destination / Strategy | Preservation Action |
| :--- | :--- | :--- | :--- |
| **Wedding Melodies** | Web Audio API Synthesizer (Oscillators) | `src/hooks/useWeddingMusic.ts` | 100% code ported; zero external files needed. Supports optional MP3 in `public/audio/`. |
| **Couple Photos** | 4 Unsplash URLs with placehold.co fallbacks | `public/assets/images/` or direct URLs | Keep high-res URLs as default; provide local fallback files in `public/assets/images/`. |
| **Pencil Sketch SVG** | Inline 840x780 SVG with turbulence filter | `src/components/sections/VenueSketchSection.tsx` | Preserve full SVG definitions, filters, patterns, and path classes identically. |
| **Door Filigrees** | Inline Left & Right SVG paths | `src/components/entrance/HeavenDoorsOverlay.tsx` | Port inline SVG vector coordinates exactly. |
| **Map Diagram SVG** | Inline 320x200 SVG with ping animation | `src/components/sections/LocationSection.tsx` | Port SVG elements and radar pulse ping animation. |
| **Google Fonts** | Alex Brush, Amiri, Aref Ruqaa, Cairo, Cormorant Garamond, Great Vibes, Playfair Display | `index.html` Google Fonts `<link>` | Retain identical `<link>` tags in React `index.html`. |

---

## 5. Build & Run Requirements

### 5.1 Project Setup Commands
```bash
# In directory: weddingInvitations/adham and amal
npm init -y
npm install react react-dom clsx tailwind-merge lucide-react
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss @tailwindcss/vite
```

### 5.2 `vite.config.ts` Proxy Configuration
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5101',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### 5.3 Scripts in `package.json`
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 6. Caveats & Risks

1. **Browser Audio Autoplay Restrictions**:
   - Modern browsers block `AudioContext` until direct user interaction. The 3D Heaven Doors button (`openHeavenDoors`) acts as the natural user gesture trigger, ensuring seamless audio playback upon entering the invitation.
2. **CORS in Development vs Production**:
   - Vite proxy handles `/api` during `npm run dev`. For production builds, CORS must be allowed on `Invitations.Api` or served from a unified reverse proxy.
3. **Multi-Invitation Data Isolation**:
   - The Kind Words component must strictly parameterize its calls with the slug `adham-amal` (`/api/invitations/adham-amal/messages`) to prevent message leakage to or from other wedding invitations.
4. **SVG Filter Performance on Low-End Mobile**:
   - The `realisticGraphite` turbulence filter on the sketch SVG can be GPU-heavy on older phones. Hardware acceleration (`will-change: transform`, `transform: translateZ(0)`) should be applied.

---

## 7. Conclusion
The original `adham_aml_wedding_invitation.html` is an exquisitely detailed, self-contained interactive invitation with sophisticated SVG illustrations, Web Audio API synthesis, 3D CSS transforms, and Arabic typography.

Migrating to a **Vite + React (TypeScript) + Tailwind CSS** setup will:
1. Preserve 100% of its visual fidelity, animations, and typography.
2. Upgrade the guest wishes wall into a live, production-grade, validated guestbook connected to `Invitations.Api`.
3. Provide modular, maintainable component code aligned with modern web standards and the project's overall architectural conventions.

---

## 8. Verification Method
1. **File Verification**:
   - Inspect `adham_aml_wedding_invitation.html` at lines 1–1842 to confirm all styles, sections, and scripts match this report.
2. **React Build Verification**:
   - After code generation, run `npm run build` in `weddingInvitations/adham and amal` to ensure zero TypeScript or bundling errors.
3. **Interactive & Visual Regression**:
   - Verify 3D door opening animation, audio start, countdown timer accuracy, sketch redraw, and Google Maps link.
4. **API Integration Verification**:
   - Submit a test wish through the form and verify that `POST /api/invitations/adham-amal/messages` succeeds and updates the list dynamically.
