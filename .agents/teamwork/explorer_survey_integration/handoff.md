# Architecture & Integration Exploration Report: Generic Invitations, Kind Words & 4-Tier Test Suite

## Executive Summary
This report provides the architectural blueprint and end-to-end integration analysis for extending **`Invitations.Api`** (`C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api`) to generically manage wedding invitations and guest kind words (messages) in SQL Server with strict multi-invitation isolation, and migrating the static HTML wedding invitation in **`weddingInvitations\adham and amal`** to a connected React web application.

---

## 1. Observation

### 1.1. Backend State (`Invitations.Api`)
- **Framework & Target**: `Invitations.Api.csproj` targets `net10.0` with EF Core SQL Server (`Microsoft.EntityFrameworkCore.SqlServer` version `10.0.13`).
- **Database Context & Missing Entities**:
  - `Data\AppDbContext.cs` currently exposes only `MediaFiles`, `Occasions`, `Designs`, `Reviews`, `CountriesServed`, `Users`, and `SiteSettings`.
  - There are currently **NO** entities for `Invitation` or `GuestMessage` (or `KindWord`).
  - `DbSeeder.cs` runs `EnsureCreatedAsync()` and applies dynamic SQL schema alterations, but contains no seed data for specific wedding invitations.
- **Controller / Endpoint Patterns**:
  - `Program.cs` (1,061 lines) hosts all API routes via ASP.NET Core Minimal APIs. Many existing endpoints query `AppDbContext` directly inside route handlers.
  - Applying User Rule `RULE[user_global]` (Thin Controllers Principle) and Requirement R2 requires extracting invitation and kind words logic into a dedicated service layer (`IInvitationService`), ensuring endpoint handlers act strictly as the HTTP transport layer.
  - The bottom of `Program.cs` currently lacks `public partial class Program { }`, which is required for `WebApplicationFactory<Program>` in integration testing.
- **Port & Hosting**:
  - `Properties\launchSettings.json` configures the backend on `http://localhost:5101` and `https://localhost:7264`.
- **Existing Test Infrastructure**:
  - No test projects exist in the entire repository (`0` `.sln` or `*Test*.csproj` files).

### 1.2. Cross-Origin Resource Sharing (CORS) Setup
- In `Program.cs` (lines 88–123):
  ```csharp
  builder.Services.AddCors(options =>
  {
      options.AddPolicy("AllowFrontend", policy =>
      {
          policy.SetIsOriginAllowed(origin =>
          {
              if (string.IsNullOrWhiteSpace(origin)) return false;
              if (Uri.TryCreate(origin, UriKind.Absolute, out var uri))
              {
                  // Localhost in development
                  if (uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase)
                      || uri.Host.Equals("127.0.0.1", StringComparison.OrdinalIgnoreCase))
                      return true;

                  // Vercel deployment domains (*.vercel.app)
                  if (uri.Host.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase))
                      return true;

                  // Custom configured domain (e.g. farhetna.com)
                  if (customOrigins.Any(o => ...)) return true;
              }
              return false;
          })
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
      });
  });
  ```
  - **Verdict on CORS**: `uri.Host.Equals("localhost")` evaluates true for **any port**. Therefore, a React frontend running on Vite (e.g. `http://localhost:5173` or `http://localhost:3000`) is permitted immediately without code alterations. For staging/production, `*.vercel.app` and any origins defined in `AllowedOrigins` configuration are supported.

### 1.3. Frontend State (`weddingInvitations\adham and amal`)
- **Current Artifact**: `adham_aml_wedding_invitation.html` (1,842 lines).
- **Core Sections**:
  1. 3D Heavenly Doors Entrance Overlay (`#entranceOverlay`)
  2. Fixed Audio Control Header (`#topBar`, Romantic Harp/Piano chord synthesizers)
  3. Hero Section (`#heroSection`, Golden calligraphy: "Adham & Aml", "أدهم ♡ أمل", Quranic ayah)
  4. Live Wedding Countdown (`#countdownSection`, dynamically targeting Monday 8:00 PM)
  5. Photo Gallery Slider (`#gallerySection`)
  6. Parchment Venue Sketch (`#sketchSection`, "قاعة جراند ستار 2 - Grand Star 2")
  7. Location & Directions (`#locationSection`, Beni Ghalib, Asyut, GPS coordinates)
  8. Guestbook & Wishes Section (`#rsvpSection`, lines 1304–1355):
     - Form: `#guestNameInput`, `#guestStatusInput` ("سأحضر بإذن الله ✨" / "أرسل أجمل التهاني 🤍"), `#guestMessageInput`.
     - Feed: `#wishesWall` dynamically displaying guest name, attendance status, and wish text.

---

## 2. Logic Chain

### 2.1. Relational Database Design & Multi-Tenant / Multi-Invitation Isolation
To guarantee complete isolation between invitations (e.g. Adham & Amal vs. any other invitation), isolation must be enforced across three architectural layers:

```
[ HTTP Request: /api/invitations/{slug}/messages ]
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│ 1. TRANSPORT LAYER (Minimal API / Controller)          │
│    - Extracts {slug} from route                        │
│    - Validates DTO (lengths, non-empty, schema)        │
│    - Dispatches to IInvitationService                  │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│ 2. SERVICE LAYER (IInvitationService)                  │
│    - Resolves Invitation by normalized Slug            │
│    - Rejects request with 404 if Invitation not found  │
│    - Enforces FK: sets Message.InvitationId = Inv.Id   │
│    - Queries: .Where(m => m.InvitationId == Inv.Id)    │
└──────────────────────┬─────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│ 3. DATA LAYER (EF Core & SQL Server)                   │
│    - Foreign Key Constraint (Cascade Delete)           │
│    - Unique Index: IX_Invitations_Slug                 │
│    - Compound Index: IX_GuestMessages_InvId_CreatedAt  │
└────────────────────────────────────────────────────────┘
```

#### Layer 1: Database Isolation (Schema Level)
- `Invitation` Entity:
  - `Guid Id` (Primary Key)
  - `string Slug` (`[MaxLength(100)]`, Unique Index `IX_Invitations_Slug`)
  - `string Title` (`[MaxLength(200)]`)
  - `string GroomName` / `string GroomNameEn`
  - `string BrideName` / `string BrideNameEn`
  - `DateTime EventDate`
  - `string VenueName` / `string VenueAddress`
  - `double? VenueLatitude` / `double? VenueLongitude`
  - `string? ConfigJson` (Serialized features: music, colors, sketch settings)
  - `DateTime CreatedAt`
- `GuestMessage` Entity:
  - `Guid Id` (Primary Key)
  - `Guid InvitationId` (Foreign Key referencing `Invitations.Id` with `OnDelete: Cascade`)
  - `string GuestName` (`[MaxLength(100)]`)
  - `string Message` (`[MaxLength(1000)]`)
  - `string Status` (`[MaxLength(100)]`, e.g. "سأحضر بإذن الله ✨")
  - `DateTime CreatedAt` (UTC)
  - `bool IsApproved` (Default: `true`)
  - Index: `IX_GuestMessages_InvitationId_CreatedAt`
- **Isolation Guarantee**: Foreign key relationship strictly bounds every message to its parent invitation. Deleting an invitation removes only its child messages.

#### Layer 2: Service Isolation (Business Logic Level)
- Service methods:
  - `Task<InvitationResponse?> GetBySlugAsync(string slug, CancellationToken ct)`
  - `Task<IReadOnlyList<GuestMessageResponse>?> GetMessagesAsync(string slug, CancellationToken ct)`
  - `Task<GuestMessageResponse?> AddMessageAsync(string slug, CreateGuestMessageRequest request, CancellationToken ct)`
- **Isolation Guarantee**:
  - In `GetMessagesAsync`: The service looks up `Invitation` by `slug`. If none matches, returns `null` (triggering 404). If found, it filters `_db.GuestMessages.Where(m => m.InvitationId == invitation.Id)`.
  - In `AddMessageAsync`: The message payload from the client is **never** allowed to supply an `InvitationId`. The `InvitationId` is strictly injected from the resolved invitation entity corresponding to the route `{slug}`. Cross-tenant pollution is mathematically impossible.

#### Layer 3: Transport Isolation (Thin Controller Principle)
- Endpoints inject `IInvitationService`, never `AppDbContext`.
- Handlers validate input parameters and map service results to HTTP status codes (`200 OK`, `201 Created`, `400 BadRequest`, `404 NotFound`).

---

## 3. Interface Contracts (API Specifications)

### 3.1. Get Invitation by Slug
- **Endpoint**: `GET /api/invitations/{slug}`
- **Auth**: None (Public)
- **Response 200 OK**:
  ```json
  {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "slug": "adham-amal",
    "title": "دعوة زفاف أدهم وأمل",
    "groomName": "أدهم",
    "groomNameEn": "Adham",
    "brideName": "أمل",
    "brideNameEn": "Aml",
    "eventDate": "2026-11-09T20:00:00Z",
    "venueName": "قاعة جراند ستار 2",
    "venueNameEn": "Grand Star Hall 2",
    "venueAddress": "طريق منقباد ← بني غالب، أسيوط",
    "venueLatitude": 27.2341,
    "venueLongitude": 31.1452,
    "config": {
      "hasMusic": true,
      "hasParchmentSketch": true,
      "hasCountdown": true,
      "hasGuestbook": true
    },
    "createdAt": "2026-11-05T12:00:00Z"
  }
  ```
- **Response 404 Not Found**:
  ```json
  {
    "error": "الدعوة غير موجودة. / Invitation 'unknown-slug' was not found."
  }
  ```

### 3.2. Post Kind Words (Guest Message)
- **Endpoint**: `POST /api/invitations/{slug}/messages`
- **Auth**: None (Public)
- **Request Body**:
  ```json
  {
    "guestName": "المهندس محمود والعائلة",
    "message": "بارك الله لكما وبارك عليكما وجمع بينكما في خير.. ألف مبروك لأجمل عروسين",
    "status": "سأحضر بإذن الله ✨"
  }
  ```
- **Validation Rules**:
  - `guestName`: Required, non-empty, 2 to 100 characters.
  - `message`: Required, non-empty, 2 to 1000 characters.
  - `status`: Optional, string up to 100 characters (default: "سأحضر بإذن الله ✨").
- **Response 201 Created** (`Location: /api/invitations/{slug}/messages/{id}`):
  ```json
  {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "invitationSlug": "adham-amal",
    "guestName": "المهندس محمود والعائلة",
    "message": "بارك الله لكما وبارك عليكما وجمع بينكما في خير.. ألف مبروك لأجمل عروسين",
    "status": "سأحضر بإذن الله ✨",
    "createdAt": "2026-11-05T13:45:00Z"
  }
  ```
- **Response 400 Bad Request**:
  ```json
  {
    "error": "بيانات التهنئة غير مكتملة أو غير صالحة.",
    "errors": {
      "guestName": ["اسم الضيف مطلوب (بين حرفين و100 حرف)."],
      "message": ["نص التهنئة مطلوب (بين حرفين و1000 حرف)."]
    }
  }
  ```
- **Response 404 Not Found**:
  ```json
  {
    "error": "الدعوة غير موجودة. / Invitation 'unknown-slug' was not found."
  }
  ```

### 3.3. Get Kind Words (List Messages)
- **Endpoint**: `GET /api/invitations/{slug}/messages`
- **Auth**: None (Public)
- **Response 200 OK**:
  ```json
  {
    "invitationSlug": "adham-amal",
    "totalCount": 2,
    "items": [
      {
        "id": "c1f7a0b3-1111-4f9e-a892-d652199042b1",
        "guestName": "أصدقاء العروسين بأسيوط",
        "message": "ألف مبروك لأغلى عروسين أدهم و أمل! ربنا يتمم فرحتكم على خير ويجعل أيامكم كلها سعادة",
        "status": "سأحضر بإذن الله ✨",
        "createdAt": "2026-11-05T13:30:00Z"
      },
      {
        "id": "e2d8b1c4-2222-4a8f-b983-e763200153c2",
        "guestName": "الأهل والأحباب",
        "message": "بارك الله لكما وبارك عليكما وجمع بينكما في خير.. نلقاكم على خير يوم الإثنين الساعة ٨ مساءً في قاعة جراند ستار 2",
        "status": "سأحضر بإذن الله ✨",
        "createdAt": "2026-11-05T13:15:00Z"
      }
    ]
  }
  ```

---

## 4. Concrete 4-Tier Test Suite Blueprint

To satisfy Requirement R3, acceptance criteria, and ensure zero regressions, an automated test project **`Invitations.Api.Tests`** should be configured with `xUnit`, `Microsoft.AspNetCore.Mvc.Testing`, and `Microsoft.EntityFrameworkCore.InMemory`.

```
Invitations.Api.Tests/
├── Invitations.Api.Tests.csproj
├── Infrastructure/
│   └── CustomWebApplicationFactory.cs      # In-memory EF Core test harness
└── Tests/
    ├── Tier1_FeatureCoverageTests.cs       # CRUD & Happy Path
    ├── Tier2_BoundaryAndCornerTests.cs     # 404, 400 validation, boundary limits
    ├── Tier3_MultiInvitationIsolationTests.cs # Invitation A vs Invitation B isolation
    └── Tier4_RealWorldScenarioTests.cs     # E2E Guest submission & retrieval journey
```

### 4.1. Test Infrastructure Setup (`CustomWebApplicationFactory.cs`)
```csharp
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = "TestDb_" + Guid.NewGuid();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor != null) services.Remove(descriptor);

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseInMemoryDatabase(_dbName);
            });
        });
    }
}
```

### 4.2. Tier Specifications

| Tier | Test Class & Method | Trigger Action | Verification Logic & Assertions |
| :--- | :--- | :--- | :--- |
| **Tier 1: Feature Coverage** | `GetInvitation_ExistingSlug_Returns200AndDetails` | `GET /api/invitations/adham-amal` | Assert `StatusCode == 200`, `Title == "دعوة زفاف أدهم وأمل"`, `VenueName` is populated. |
| **Tier 1: Feature Coverage** | `PostMessage_ValidPayload_Returns201AndCreatedMessage` | `POST /api/invitations/adham-amal/messages` with valid JSON | Assert `StatusCode == 201`, returned `guestName` and `message` match input, `id` is generated. |
| **Tier 1: Feature Coverage** | `GetMessages_ReturnsChronologicalList` | `GET /api/invitations/adham-amal/messages` | Assert `StatusCode == 200`, `items` count matches seeded/posted count, ordered descending by `createdAt`. |
| **Tier 2: Boundary & Corner** | `GetInvitation_NonExistentSlug_Returns404` | `GET /api/invitations/non-existent-wedding-xyz` | Assert `StatusCode == 404`, error response body contains descriptive message. |
| **Tier 2: Boundary & Corner** | `PostMessage_NonExistentSlug_Returns404` | `POST /api/invitations/non-existent-slug/messages` | Assert `StatusCode == 404`, no orphaned message is inserted into database. |
| **Tier 2: Boundary & Corner** | `PostMessage_EmptyGuestName_Returns400` | `POST .../messages` with `guestName: ""` | Assert `StatusCode == 400`, JSON contains validation error for `guestName`. |
| **Tier 2: Boundary & Corner** | `PostMessage_EmptyMessage_Returns400` | `POST .../messages` with `message: "   "` | Assert `StatusCode == 400`, JSON contains validation error for `message`. |
| **Tier 2: Boundary & Corner** | `PostMessage_ExceedingLengthLimit_Returns400` | `POST .../messages` with `message` > 1000 chars | Assert `StatusCode == 400`, rejected prior to persistence. |
| **Tier 2: Boundary & Corner** | `GetInvitation_SlugCaseInsensitive_Returns200` | `GET /api/invitations/ADHAM-AMAL` | Assert `StatusCode == 200`, slug normalized via `.ToLower().Trim()`. |
| **Tier 3: Multi-Invitation Isolation** | `Messages_PostedToInvitationA_NeverLeakToInvitationB` | 1. Create `inv-alpha` & `inv-beta`<br>2. Post 3 messages to `inv-alpha`<br>3. Post 2 messages to `inv-beta` | 1. `GET /api/invitations/inv-alpha/messages` returns exactly 3 messages, all with Alpha names.<br>2. `GET /api/invitations/inv-beta/messages` returns exactly 2 messages, all with Beta names.<br>3. Assert **zero** cross-contamination. |
| **Tier 3: Multi-Invitation Isolation** | `DeleteInvitationA_DoesNotDeleteOrAlterInvitationB` | Delete `inv-alpha` | 1. `GET /api/invitations/inv-alpha` returns 404.<br>2. `GET /api/invitations/inv-beta` and its messages return 200 completely unaffected. |
| **Tier 3: Multi-Invitation Isolation** | `MismatchedInvitationIdInBody_IsIgnoredAndScopedToSlug` | Post to `inv-alpha/messages` with spoofed `invitationId` of `inv-beta` | Message is saved with `inv-alpha`'s ID; never appears under `inv-beta`. |
| **Tier 4: Real-World Scenario** | `Guest_CompleteJourney_LoadPostAndVerify` | 1. Guest visits page (`GET /api/invitations/adham-amal`)<br>2. Guest reads initial messages (`GET .../messages`)<br>3. Guest submits wish (`POST .../messages`)<br>4. Guest refreshes page (`GET .../messages`) | 1. Status 200 on load.<br>2. Status 201 on post.<br>3. On refresh, message list totalCount increments by 1, and the newly submitted wish is present at index 0. |

---

## 5. Frontend Migration Architecture (`weddingInvitations\adham and amal`)

### 5.1. Tech Stack & Tooling
- **Framework**: React 19 + TypeScript + Vite.
- **Styling**: Tailwind CSS (with arbitrary values reproducing luxury colors `#d4af37`, `#070b14`, `#fdfbf7`, gold gradients, and celestial cards).
- **Fonts**: Google Fonts (`Amiri`, `Cairo`, `Aref Ruqaa`, `Alex Brush`, `Playfair Display`, `Cormorant Garamond`, `Great Vibes`).
- **Icons**: Lucide React.

### 5.2. Component Architecture
```
weddingInvitations/adham and amal/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── src/
    ├── services/
    │   └── invitationApi.ts       # Backend API client (fetchInvitation, fetchMessages, postMessage)
    ├── hooks/
    │   ├── useInvitation.ts       # React Query / custom hook fetching invitation & messages
    │   └── useWeddingMusic.ts     # Web Audio API romantic harp/piano synthesizer
    ├── components/
    │   ├── EntranceDoorsOverlay.tsx # 3D rotating heavenly doors with medallion
    │   ├── TopAudioBar.tsx        # Floating audio controls & equalizer
    │   ├── HeroSection.tsx        # Calligraphic gold shimmer names & Quranic ayah
    │   ├── CountdownSection.tsx   # Live countdown to Monday 8:00 PM
    │   ├── GallerySection.tsx     # Memory photo slider
    │   ├── VenueSketchSection.tsx # Realistic pencil venue sketch on parchment
    │   ├── LocationSection.tsx    # Venue directions & Google Maps link
    │   ├── GuestbookSection.tsx   # Kind words submission form + live feed
    │   └── Toast.tsx              # Arabic toast notification
    ├── App.tsx
    └── main.tsx
```

### 5.3. `invitationApi.ts` Client Contract
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5101';
const INVITATION_SLUG = 'adham-amal';

export async function getInvitation(slug = INVITATION_SLUG) {
  const res = await fetch(`${API_BASE_URL}/api/invitations/${slug}`);
  if (!res.ok) throw new Error('Failed to load invitation');
  return res.json();
}

export async function getMessages(slug = INVITATION_SLUG) {
  const res = await fetch(`${API_BASE_URL}/api/invitations/${slug}/messages`);
  if (!res.ok) throw new Error('Failed to load messages');
  return res.json();
}

export async function postMessage(slug = INVITATION_SLUG, payload: { guestName: string; message: string; status?: string }) {
  const res = await fetch(`${API_BASE_URL}/api/invitations/${slug}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to post message');
  return res.json();
}
```

---

## 6. Caveats & Assumptions

1. **Moderation Status (`IsApproved`)**:
   - For wedding guestbooks, immediate feedback is critical for guest satisfaction. Thus, `IsApproved` defaults to `true` upon submission so messages appear immediately on the wall. An optional admin flag or endpoint can allow hiding or soft-deleting inappropriate messages.
2. **Database Migration Strategy**:
   - In production SQL Server, EF Core migrations (`Add-Migration AddInvitationsAndKindWords`) create the tables cleanly. In test runs, `UseInMemoryDatabase` provides instant verification without needing a running SQL Server instance.
3. **Audio Synthesis vs. Audio File**:
   - The original HTML contains a sophisticated Web Audio API oscillator progression (Romantic Harp/Piano chords). In the React migration, this is preserved via a dedicated custom hook (`useWeddingMusic`) to avoid external audio asset loading failures.

---

## 7. Conclusion

1. **Backend Integration**: `Invitations.Api` can cleanly host generic multi-invitation persistence and kind words management by adding `Invitation` and `GuestMessage` entities with relational FKs, managed through a dedicated `IInvitationService` adhering strictly to the Thin Controller Principle.
2. **CORS Readiness**: The existing CORS configuration in `Invitations.Api` (`Program.cs:96-121`) already enables `localhost` on any port with any header and method, guaranteeing friction-free connectivity with the Vite React frontend on port `5173`.
3. **Isolation Guarantees**: Enforcing isolation at database schema (foreign keys and compound indexes), service logic (mandatory slug resolution and scoped queries), and HTTP endpoints (parameter validation) mathematically eliminates the possibility of message leakage between invitations.
4. **Testing Rigor**: Setting up `Invitations.Api.Tests` with a 4-tier test suite using `WebApplicationFactory<Program>` and in-memory EF Core ensures complete coverage of CRUD operations, boundary conditions, multi-tenant isolation, and real-world guest flows.

---

## 8. Verification Method

Once implemented, the solution can be verified using the following commands:

### Backend Build Verification
```powershell
dotnet build "C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api\Invitations.Api.csproj"
```
*Expected: 0 errors.*

### Automated 4-Tier Test Execution
```powershell
dotnet test "C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api.Tests\Invitations.Api.Tests.csproj" --logger "console;verbosity=detailed"
```
*Expected: 100% pass across all 4 tiers (Feature coverage, Boundary cases, Multi-invitation isolation, E2E Guest journey).*

### Frontend Build & Typecheck Verification
```powershell
cd "C:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal"
bun install # or npm install
bun run build # or npm run build
```
*Expected: Clean production bundle build with zero TypeScript or CSS errors.*

### Live End-to-End API Check (PowerShell)
```powershell
# 1. Check health
Invoke-RestMethod -Uri "http://localhost:5101/health"

# 2. Get Adham & Amal invitation
Invoke-RestMethod -Uri "http://localhost:5101/api/invitations/adham-amal"

# 3. Post a kind word
$body = @{ guestName = "أحمد خالد"; message = "ألف مبروك لأجمل عروسين!"; status = "سأحضر بإذن الله ✨" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5101/api/invitations/adham-amal/messages" -Method Post -Body $body -ContentType "application/json"

# 4. List messages
Invoke-RestMethod -Uri "http://localhost:5101/api/invitations/adham-amal/messages"
```
