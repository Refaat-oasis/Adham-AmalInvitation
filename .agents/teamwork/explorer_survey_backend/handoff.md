# Backend Codebase Exploration & Architectural Handoff Report

**Project**: `Invitations.Api` (Generic Multi-Invitation & Kind Words Backend)  
**Date**: 2026-11-05T13:40:00Z  
**Author**: Backend Codebase Explorer Subagent  
**Parent Task**: M1 — Codebase Survey for Requirements R1 & R2  

---

## 1. Observation

### 1.1 Solution & Project Setup
- **Project File**: `C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api\Invitations.Api.csproj`
- **Target Framework**: `net10.0`
- **.NET SDK Version Installed**: `10.0.403` (verified via `dotnet --version`)
- **Nullable & Implicit Usings**: Both enabled (`<Nullable>enable</Nullable>`, `<ImplicitUsings>enable</ImplicitUsings>`)
- **Package Dependencies**:
  ```xml
  <PackageReference Include="BCrypt.Net-Next" Version="4.2.0" />
  <PackageReference Include="CloudinaryDotNet" Version="1.29.3" />
  <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="10.0.13" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.13">
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    <PrivateAssets>all</PrivateAssets>
  </PackageReference>
  <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.13" />
  ```
- **Build Status**: `dotnet build` succeeds cleanly with **0 Errors** and 6 Warnings (CS8981 in old migration, CS8602 in Program.cs line 158, and transitive NuGet advisories NU1902/NU1903 in PKCS 9.0.11).

### 1.2 Database Context & Schema
- **Database Context**: `C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api\Data\AppDbContext.cs`
- **Connection Strings**:
  - `appsettings.json`:
    `"Server=5.9.179.199; Database=db75649; User Id=db75649; Password=...; Encrypt=False; MultipleActiveResultSets=True;"`
  - `appsettings.Production.json`:
    `"Server=db75649.databaseasp.net; Database=db75649; User Id=db75649; Password=...; Encrypt=False; MultipleActiveResultSets=True;"`
  - Fallback in `Program.cs` line 19:
    `"Server=localhost;Database=InvitationsDb;Trusted_Connection=True;TrustServerCertificate=True;"`
- **Existing Entities**:
  - `MediaFiles` (`MediaFile`: `Guid Id`, `FileName`, `ContentType`, `byte[] Data` [varbinary(max)], `FileSize`, `CreatedAt`)
  - `Occasions` (`Occasion`: `string Id`, `Slug`, `Ar`, `En`, `DescAr`, `DescEn`, `DisplayOrder`, `IsActive`)
  - `Designs` (`Design`: `string Id`, `OccasionId` FK, `TitleAr`, `TitleEn`, `AuthorAr`, `Author`, `Price`, `Colors`, `MediaFileId` nullable FK, `ImageUrl`, `Images`, `MediaType`, `VideoUrl`, `DescriptionAr`, `DescriptionEn`, `ShowInHeroCarousel`, `HeroDisplayOrder`, `CreatedAt`)
  - `Reviews` (`Review`: `int Id`, `Name`, `NameAr`, `Rating`, `Ar`, `En`, `IsActive`, `CreatedAt`)
  - `CountriesServed` (`CountryServed`: `int Id`, `Code`, `Flag`, `Ar`, `En`, `DisplayOrder`, `IsActive`)
  - `Users` (`User`: `int Id`, `Username`, `PasswordHash`, `Role`)
  - `SiteSettings` (`SiteSetting`: `string Key`, `ValueAr`, `ValueEn`)
- **Newly Added Generic Entities** (already present in `Models/` and `AppDbContext.cs`):
  - `Invitations` (`Invitation`: `int Id`, `string Slug` [Indexed, Unique], `GroomNameAr`, `GroomNameEn`, `BrideNameAr`, `BrideNameEn`, `TitleAr`, `TitleEn`, `EventDate`, `VenueNameAr`, `VenueNameEn`, `VenueAddress`, `VenueMapUrl`, `ConfigJson`, `IsActive`, `CreatedAt`, `ICollection<GuestMessage> Messages`)
  - `GuestMessages` (`GuestMessage`: `int Id`, `int InvitationId` FK, `GuestName`, `AttendanceStatus`, `Message`, `IsApproved`, `CreatedAt`, `Invitation? Invitation`)
- **Relationship & Constraints in `AppDbContext.cs`**:
  - Lines 40-43: Unique index on `Invitation.Slug` (`entity.HasIndex(i => i.Slug).IsUnique();`)
  - Lines 46-51: Foreign key relationship with cascade delete:
    ```csharp
    modelBuilder.Entity<GuestMessage>(entity =>
    {
        entity.HasOne(m => m.Invitation)
              .WithMany(i => i.Messages)
              .HasForeignKey(m => m.InvitationId)
              .OnDelete(DeleteBehavior.Cascade);
    });
    ```
- **Database Migrations & Seeding Behavior**:
  - Existing Migration: `Migrations/20261024205456_initialmigration.cs`
  - In `DbSeeder.cs`, initialization is executed at application startup via `await DbSeeder.SeedAsync(db)` in `Program.cs` lines 135-144.
  - `DbSeeder.cs` contains raw DDL self-healing script lines 22-58 creating `Invitations` and `GuestMessages` tables and indexes using `IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Invitations') ...`.
  - `DbSeeder.cs` lines 180-225 seeds the default `"adham-amal"` invitation record and initial kind words/wishes if not present.

### 1.3 Architecture, Routes & Middleware
- **Routing Paradigm**:
  - `Invitations.Api` uses ASP.NET Core Minimal APIs throughout `Program.cs` (`app.MapGet`, `app.MapPost`, etc.).
  - Generic Invitation endpoints are organized in an extension method class:
    `C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api\Endpoints\InvitationEndpoints.cs`
    and mapped in `Program.cs` line 154 via `app.MapInvitationEndpoints()`.
- **Registered Invitation Endpoints**:
  - `GET /api/invitations/{slug}` — Retrieves invitation details and approved message count.
  - `POST /api/invitations` — Creates a new generic invitation.
  - `PUT /api/invitations/{slug}` — Updates invitation details.
  - `GET /api/invitations/{slug}/messages` — Retrieves approved kind words/messages strictly partitioned by slug.
  - `POST /api/invitations/{slug}/messages` — Posts guest kind words/message anchored strictly to target invitation ID.
- **Service Layer (Thin Controller / Minimal Endpoint Principle)**:
  - `IInvitationService` (`C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api\Services\IInvitationService.cs`)
  - `InvitationService` (`C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api\Services\InvitationService.cs`)
  - DI registration in `Program.cs` line 128:
    `builder.Services.AddScoped<IInvitationService, InvitationService>();`
  - `InvitationEndpoints.cs` contains **zero database queries and zero business logic**. It performs HTTP parameter validation, calls `IInvitationService`, and translates results into standard HTTP responses (`Results.Ok`, `Results.Created`, `Results.NotFound`, `Results.Conflict`, `Results.BadRequest`).
- **CORS Configuration**:
  - CORS policy named `"AllowFrontend"` in `Program.cs` lines 92-123.
  - Dynamically permits `localhost`, `127.0.0.1`, any `*.vercel.app` domain, and custom origins configured via `"AllowedOrigins"` (with `.AllowAnyHeader()`, `.AllowAnyMethod()`, `.AllowCredentials()`).
  - Perfect for both local development (React running on Vite/CRA) and cloud deployments.
- **Test Projects**:
  - No test project currently exists in the workspace (only `Invitations.Api.csproj` is present).

---

## 2. Logic Chain

### 2.1 Entity Design & Isolation Rationale
1. **Slug as Natural Public Key**:
   - The user requested generic invitation handling (R1) accessible via URLs like `GET /api/invitations/{slug}`.
   - Using a unique, lowercased, indexed `Slug` (`nvarchar(100)`) provides SEO-friendly, clean URLs (e.g. `adham-amal`) while preventing identifier enumeration.
   - An integer surrogate primary key `Id` (`IDENTITY(1,1)`) is used internally for high-performance integer foreign key joins with `GuestMessages.InvitationId`.
2. **Strict Multi-Invitation Isolation**:
   - In `InvitationService.GetMessagesAsync`:
     The query applies:
     `_db.GuestMessages.Where(m => m.Invitation!.Slug.ToLower() == normalizedSlug && m.IsApproved)`
   - In `InvitationService.AddMessageAsync`:
     The method resolves `invitation` by slug first. If not found, it immediately aborts and returns `null`. Upon resolution, it sets `message.InvitationId = invitation.Id`.
   - Result: Guest messages submitted for invitation `adham-amal` can never be queried or linked to any other invitation slug (e.g. `ahmed-mona`). Multi-tenant isolation is enforced at the database level via FK constraint and at the query level via slug scoping.
3. **Thin Controller / Minimal Endpoint Protocol Compliance**:
   - User Rule 1 mandates that Controllers/Endpoints must only serve as HTTP transport layers.
   - By creating `IInvitationService` and `InvitationService`:
     - Database context access (`_db.Invitations`, `_db.GuestMessages`), transaction boundaries, DTO mapping, and slug normalization are encapsulated in `InvitationService`.
     - Route handlers in `InvitationEndpoints.cs` only receive HTTP requests, invoke service methods, and return typed `IResult` responses.
     - Zero DbContext queries exist within the endpoint handlers.

---

## 3. Caveats & Observed Gaps

1. **Remote SQL Server Handshake Timeout**:
   - The remote IP in `appsettings.json` (`5.9.179.199`) timed out during EF tools command execution (`SSL Provider: The wait operation timed out`).
   - For integration testing and local CI, tests MUST run against an in-memory provider (`Microsoft.EntityFrameworkCore.InMemory`) or SQLite in-memory (`Microsoft.EntityFrameworkCore.Sqlite`) through a custom `WebApplicationFactory<Program>`, decoupled from external network access.
2. **Missing Test Project**:
   - Acceptance Criteria state:
     - `[ ] Automated integration tests verify that invitation data and guest kind words can be saved and retrieved via the API.`
     - `[ ] Automated tests verify multi-invitation isolation: messages submitted for invitation A do not appear in queries for invitation B.`
   - No `.Tests.csproj` currently exists. An automated test project must be created.
3. **HTTP Status Code on `GET /api/invitations/{slug}/messages` when Slug Does Not Exist**:
   - Currently, `InvitationService.GetMessagesAsync` returns `Array.Empty<GuestMessageDto>()` if the invitation slug does not exist, and `InvitationEndpoints.cs` returns `Results.Ok([])` (HTTP 200).
   - *Recommendation*: `GetMessagesAsync` should return `null` if the invitation does not exist, allowing `InvitationEndpoints.cs` to return `Results.NotFound(new { message = $"Invitation '{slug}' was not found." })` (HTTP 404). This clearly distinguishes an empty guestbook from a non-existent invitation.
4. **Covering / Composite Index for Messages**:
   - While `InvitationId` has an FK index, adding `.HasIndex(m => new { m.InvitationId, m.CreatedAt })` in `AppDbContext.cs` ensures high-throughput sorted queries on high-traffic invitations.
5. **CS8602 Warning in `Program.cs` line 158**:
   - `if (host.Contains("runasp.net", ...))` produces compiler warning CS8602 if `host` is nullable. A minor defensive check `(host ?? "").Contains(...)` cleans this up.

---

## 4. Conclusion

1. **Baseline Health**: `Invitations.Api` compiles with 0 errors on .NET 10 (`net10.0`).
2. **R1 & R2 Foundation**:
   - Models `Invitation` and `GuestMessage` are correctly defined in `Models/`.
   - `AppDbContext` is configured with `DbSet<Invitation>`, `DbSet<GuestMessage>`, unique Slug index, and cascade delete FK.
   - `IInvitationService` and `InvitationService` provide cleanly decoupled business and data access layers satisfying the **Thin Controller Principle**.
   - `InvitationEndpoints.cs` exposes the exact required generic REST API endpoints:
     - `GET /api/invitations/{slug}`
     - `POST /api/invitations`
     - `PUT /api/invitations/{slug}`
     - `GET /api/invitations/{slug}/messages`
     - `POST /api/invitations/{slug}/messages`
   - Initial seed data in `DbSeeder.cs` pre-populates `adham-amal` wedding invitation with two sample wishes matching the original HTML.
3. **Next Steps for Implementer**:
   - Refine `GetMessagesAsync` to return 404 when the invitation slug is not found.
   - Add covering index `HasIndex(m => new { m.InvitationId, m.CreatedAt })`.
   - Create an automated xUnit integration test project (`Invitations.Api.Tests`) using `WebApplicationFactory<Program>` to programmatically verify R1, R2, and multi-invitation isolation.

---

## 5. Verification Method

### 5.1 Build Verification
Execute from project root:
```powershell
dotnet build "C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api\Invitations.Api.csproj"
```
**Expected Outcome**: Build succeeds with 0 errors.

### 5.2 Endpoint & Multi-Invitation Isolation Verification
Once test project `Invitations.Api.Tests` is created or via local HTTP run (`dotnet run` on port 5101):

1. **Verify Invitation Retrieval**:
   ```bash
   GET http://localhost:5101/api/invitations/adham-amal
   ```
   **Expected**: HTTP 200 OK with `slug: "adham-amal"`, `groomNameAr: "أدهم"`, `brideNameAr: "أمل"`, and `messagesCount: 2`.

2. **Verify Guest Messages Retrieval**:
   ```bash
   GET http://localhost:5101/api/invitations/adham-amal/messages
   ```
   **Expected**: HTTP 200 OK with JSON array containing the seeded messages.

3. **Verify Message Submission**:
   ```bash
   POST http://localhost:5101/api/invitations/adham-amal/messages
   Content-Type: application/json

   {
     "guestName": "د. أحمد كمال",
     "attendanceStatus": "سأحضر بإذن الله ✨",
     "message": "ألف مبروك وبالرفاه والبنين!"
   }
   ```
   **Expected**: HTTP 201 Created with message ID and timestamp.

4. **Verify Multi-Invitation Strict Isolation**:
   - Create a second invitation:
     ```bash
     POST http://localhost:5101/api/invitations
     Content-Type: application/json

     {
       "slug": "tarek-nour",
       "groomNameAr": "طارق",
       "brideNameAr": "نور",
       "eventDate": "2026-12-01T18:00:00Z",
       "venueNameAr": "قاعة الماسة",
       "venueAddress": "القاهرة"
     }
     ```
   - Query messages for second invitation:
     ```bash
     GET http://localhost:5101/api/invitations/tarek-nour/messages
     ```
     **Expected**: Empty array `[]`. None of `adham-amal`'s messages appear.
   - Query non-existent slug:
     ```bash
     GET http://localhost:5101/api/invitations/non-existent-slug/messages
     ```
     **Expected**: HTTP 404 Not Found (after applying recommended refinement).

### 5.3 Automated Integration Test Command
When `Invitations.Api.Tests` is built:
```powershell
dotnet test "C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api.Tests\Invitations.Api.Tests.csproj"
```
**Expected Outcome**: All integration and isolation tests pass 100%.
