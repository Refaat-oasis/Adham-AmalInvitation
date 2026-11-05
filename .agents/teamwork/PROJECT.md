# Project: Generic Invitations & Kind Words System + React Wedding Invitation

## Architecture
- **Backend**: ASP.NET Core Web API (`Invitations.Api`, `net10.0`) with Entity Framework Core and SQL Server.
  - Multi-tenant / Multi-invitation generic schema: `Invitations` table uniquely keyed by `Slug`, and `GuestMessages` table foreign-keyed to `InvitationId` with cascading delete.
  - Thin Controller / Minimal Endpoint architecture: `InvitationEndpoints.cs` maps route endpoints strictly as the HTTP transport layer, delegating all database operations, validation, and slug normalization to `IInvitationService` (`InvitationService.cs`).
  - Strict Isolation: Messages for Invitation A are never accessible or mixed with Invitation B.
  - CORS policy allows local React frontend (e.g., `http://localhost:5173`) and production domains.
- **Frontend**: Modern React (Vite + TypeScript + Tailwind CSS) in `weddingInvitations\adham and amal`.
  - Preserves 100% of the visual styling, luxury gold aesthetics, animations, and typography of `adham_aml_wedding_invitation.html`.
  - 12 comprehensive sections: Ambient golden sparkles canvas, Sticky top bar with equalizer, 3D Heavenly Doors overlay, Hero section with Quranic verse and calligraphy switcher, Live countdown timer, Photo gallery, Graphite pencil architectural sketch of Grand Star 2, Venue location & route diagram, Interactive Kind Words guestbook form & wall, Web Audio API synthesizer, and Footer.
  - Dynamic API integration with `Invitations.Api` for fetching invitation data and posting/listing guest kind words.
- **E2E Testing Track**: Automated integration test project `Invitations.Api.Tests` using `Microsoft.AspNetCore.Mvc.Testing` (`WebApplicationFactory<Program>`) and EF Core in-memory database, covering 4 tiers of tests (Feature coverage, Boundary & corner cases, Cross-invitation isolation, and Real-world workflow).

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Generic Invitation Schema | `Invitation` entity with Id, unique indexed `Slug`, Arabic & English couple names, event date, venue details, config, timestamps | M1 | survey (backend/integration) |
| 2 | Guest Kind Words Schema | `GuestMessage` entity with Id, `InvitationId` FK (cascade delete), `GuestName`, `AttendanceStatus`, `Message`, `IsApproved`, `CreatedAt` | M1 | survey (backend/integration) |
| 3 | EF Core Relational Config & Migration | `AppDbContext` configuration, unique index on `Slug`, compound index on `(InvitationId, CreatedAt)`, and EF Core migration script | M1 | survey (backend) |
| 4 | Database Seeder | `DbSeeder.cs` idempotent DDL self-healing and seeding of `adham-amal` wedding record with initial kind words | M1 | survey (backend) |
| 5 | Thin Endpoint Architecture | `InvitationEndpoints.cs` HTTP transport layer delegating to `IInvitationService`, zero DB queries in endpoints | M2 | survey (backend/integration) |
| 6 | Service Layer & Multi-Invitation Isolation | `IInvitationService` & `InvitationService` enforcing strict query isolation by normalized `Slug`, returning 404 for non-existent slugs | M2 | survey (backend/integration) |
| 7 | Invitation REST Endpoints | `GET /api/invitations/{slug}`, `POST /api/invitations`, `PUT /api/invitations/{slug}` | M2 | survey (backend/integration) |
| 8 | Kind Words REST Endpoints | `GET /api/invitations/{slug}/messages` (returns 404 if slug not found), `POST /api/invitations/{slug}/messages` (associates message with slug) | M2 | survey (backend/integration) |
| 9 | Test Infrastructure & Program Hook | Add `public partial class Program { }` in `Program.cs` and scaffold `Invitations.Api.Tests` with `WebApplicationFactory` | M-E2E | survey (integration) |
| 10 | Tier 1 Tests (Feature Coverage) | CRUD invitations, submit kind words, list kind words | M-E2E | survey (integration) |
| 11 | Tier 2 Tests (Boundary & Corner Cases) | Non-existent slug returns 404, empty name/message returns 400, long strings, whitespace trimming | M-E2E | survey (integration) |
| 12 | Tier 3 Tests (Cross-Invitation Isolation) | Messages posted to Invitation A never appear in queries for Invitation B | M-E2E | survey (integration) |
| 13 | Tier 4 Tests (Real-World Guest Workflow) | Full user flow: load invitation, submit message, retrieve updated feed | M-E2E | survey (integration) |
| 14 | React Project Setup & Tooling | Vite + React + TypeScript + Tailwind CSS configured in `weddingInvitations\adham and amal` with dev proxy to `Invitations.Api` | M3 | survey (frontend) |
| 15 | 3D Heavenly Doors Entrance Overlay | 3D doors ("Adham" left, "Aml" right, center gold medallion, click-to-open animation, music start trigger) | M3 | survey (frontend) |
| 16 | Audio Synthesizer & Sticky Top Bar | Web Audio API romantic chord synthesizer, 3-bar animated equalizer, responsive nav | M3 | survey (frontend) |
| 17 | Hero Section & Typography | Classical Amiri Quranic verse, gold foil calligraphy, dynamic font switcher (Script/Royal/Editorial) | M3 | survey (frontend) |
| 18 | Live Countdown Timer | Dynamic countdown to wedding date with adjustable target date | M3 | survey (frontend) |
| 19 | Couple Photo Gallery | 4-photo grid with preview/file change capability | M3 | survey (frontend) |
| 20 | Architectural Pencil Sketch | Realistic SVG graphite pencil sketch of Grand Star 2 with dual paper modes (parchment vs night) and stroke animation | M3 | survey (frontend) |
| 21 | Venue Location & Directions | Route steps, Plus Code copy button with toast feedback, and Google Maps link | M3 | survey (frontend) |
| 22 | Interactive Kind Words Component | Form (Name, Attendance, Message) with client validation, submission spinner, error rollback, and optimistic updates | M4 | survey (frontend) |
| 23 | Dynamic Kind Words Wall | Live feed displaying guest name, attendance status, and message loaded from `Invitations.Api` | M4 | survey (frontend) |
| 24 | E2E Integration & Verification | Full verification: backend tests pass, React app builds cleanly, end-to-end integration verified | M-Final | survey (all) |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M-E2E | E2E Testing Track | Scaffold `Invitations.Api.Tests`, write Tier 1-4 tests, publish `TEST_READY.md` | none | DONE |
| M1 | Backend Schema & Seeding | Models, DbContext configuration, EF Core Migration, DbSeeder self-healing | none | DONE |
| M2 | Backend Thin Endpoints & Service Layer | `IInvitationService`, `InvitationService`, `InvitationEndpoints`, Program.cs wiring, 404 on missing slug | M1 | DONE |
| M3 | React Frontend Core Conversion | Vite setup, Tailwind tokens, 3D doors, audio synth, hero, countdown, sketch, gallery, location | none | DONE |
| M4 | Frontend Kind Words & Guestbook Integration | Interactive Kind Words form & wall, API client integration, validation, state management | M2, M3 | DONE |
| M-Final | Final Milestone: Full Verification & Hardening | Run 100% E2E test suite, adversarial testing, zero-error solution build, layout compliance | M-E2E, M4 | DONE |

---

## Interface Contracts

### 1. `GET /api/invitations/{slug}`
- **Request**: Path parameter `slug` (string, case-insensitive, e.g. `adham-amal`)
- **Response 200 OK**:
  ```json
  {
    "id": 1,
    "slug": "adham-amal",
    "groomNameAr": "أدهم",
    "groomNameEn": "Adham",
    "brideNameAr": "أمل",
    "brideNameEn": "Aml",
    "titleAr": "حفل زفاف أدهم وأمل",
    "titleEn": "Wedding of Adham & Aml",
    "eventDate": "2026-11-09T20:00:00",
    "venueNameAr": "قاعة جراند ستار 2",
    "venueNameEn": "Grand Star 2 Hall",
    "venueAddress": "طريق منقباد - بني غالب، أسيوط",
    "venueMapUrl": "https://www.google.com/maps/search/?api=1&query=52PV%2BMP%2C+Bani+Ghaleb%2C+Asyut%2C+Assiut+Governorate",
    "configJson": "{}",
    "isActive": true,
    "createdAt": "2026-11-05T12:00:00Z",
    "approvedMessagesCount": 3
  }
  ```
- **Response 404 Not Found**:
  ```json
  { "error": "Invitation with slug 'xyz' was not found." }
  ```

### 2. `GET /api/invitations/{slug}/messages`
- **Request**: Path parameter `slug`
- **Response 200 OK**: Array of approved guest messages ordered descending by `createdAt`:
  ```json
  [
    {
      "id": 1,
      "invitationId": 1,
      "guestName": "عائلة النجار",
      "attendanceStatus": "سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨",
      "message": "بارك الله لكما وبارك عليكما وجمع بينكما في خير...",
      "createdAt": "2026-11-05T12:05:00Z"
    }
  ]
  ```
- **Response 404 Not Found** (if invitation slug does not exist):
  ```json
  { "error": "Invitation with slug 'xyz' was not found." }
  ```

### 3. `POST /api/invitations/{slug}/messages`
- **Request**: Path parameter `slug`, Body:
  ```json
  {
    "guestName": "أحمد محمد",
    "attendanceStatus": "سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨",
    "message": "ألف ألف مبروك يا أدهم ويا أمل، ربي يتمم لكم على خير!"
  }
  ```
- **Response 201 Created**:
  ```json
  {
    "id": 4,
    "invitationId": 1,
    "guestName": "أحمد محمد",
    "attendanceStatus": "سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨",
    "message": "ألف ألف مبروك يا أدهم ويا أمل، ربي يتمم لكم على خير!",
    "createdAt": "2026-11-05T13:45:00Z"
  }
  ```
- **Response 400 Bad Request**: Validation failure (empty guest name or message).
- **Response 404 Not Found**: Invitation slug does not exist.

---

## Code Layout
- Backend:
  - `Invitations.Api/Models/Invitation.cs`
  - `Invitations.Api/Models/GuestMessage.cs`
  - `Invitations.Api/Data/AppDbContext.cs`
  - `Invitations.Api/Data/DbSeeder.cs`
  - `Invitations.Api/Services/IInvitationService.cs`
  - `Invitations.Api/Services/InvitationService.cs`
  - `Invitations.Api/Endpoints/InvitationEndpoints.cs`
  - `Invitations.Api/Program.cs`
- Integration Tests:
  - `Invitations.Api.Tests/Invitations.Api.Tests.csproj`
  - `Invitations.Api.Tests/CustomWebApplicationFactory.cs`
  - `Invitations.Api.Tests/Tier1_FeatureCoverageTests.cs`
  - `Invitations.Api.Tests/Tier2_BoundaryCornerTests.cs`
  - `Invitations.Api.Tests/Tier3_MultiInvitationIsolationTests.cs`
  - `Invitations.Api.Tests/Tier4_RealWorldWorkflowTests.cs`
- Frontend:
  - `weddingInvitations/adham and amal/package.json`
  - `weddingInvitations/adham and amal/vite.config.ts`
  - `weddingInvitations/adham and amal/index.html`
  - `weddingInvitations/adham and amal/src/App.tsx`
  - `weddingInvitations/adham and amal/src/components/...`
  - `weddingInvitations/adham and amal/src/services/api.ts`
