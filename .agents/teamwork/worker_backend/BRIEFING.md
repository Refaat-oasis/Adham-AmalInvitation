# BRIEFING — 2026-11-05T15:47:00Z

## Mission
Implement backend changes in `Invitations.Api` for Milestones M1 & M2: entry point partial Program class, nullable return types on message operations in service layer to indicate non-existent invitations, endpoint 404/200/201 responses adhering to thin endpoint architecture, and composite index on GuestMessage(InvitationId, CreatedAt).

## 🔒 My Identity
- Archetype: worker
- Roles: implementer
- Working directory: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\worker_backend
- Original parent: c1ee235b-ffaf-4ca6-b56c-6cbf89f923f2
- Milestone: M1 & M2

## 🔒 Key Constraints
- EXCLUSIVE WRITE OWNERSHIP: `C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api\**`
- DO NOT touch files in `weddingInvitations\adham and amal` or outside `Invitations.Api` (except .agents/teamwork/worker_backend metadata)
- Thin Controllers / Minimal Endpoints: ZERO direct DbContext queries or business logic in endpoint handlers
- Native ASP.NET Core conventions
- No cheating, genuine implementation

## Current Parent
- Conversation ID: c1ee235b-ffaf-4ca6-b56c-6cbf89f923f2
- Updated: 2026-11-05T15:47:00Z

## Task Summary
- **What to build**:
  1. `Program.cs`: append `public partial class Program { }` (verified present)
  2. `Services/IInvitationService.cs` & `InvitationService.cs`: update `GetMessagesAsync` and `CreateMessageAsync` to return `null` if invitation slug does not exist.
  3. `Endpoints/InvitationEndpoints.cs`: handle null result in `GET /api/invitations/{slug}/messages` and `POST /api/invitations/{slug}/messages` returning 404 NotFound with `{ error = ... }`. Ensure thin endpoint design.
  4. `Data/AppDbContext.cs` & `Data/DbSeeder.cs`: Add covering composite index `entity.HasIndex(m => new { m.InvitationId, m.CreatedAt })`.
  5. Verify clean build with `dotnet build`.
- **Success criteria**: `dotnet build` succeeds with 0 errors, all contracts match PROJECT.md.
- **Interface contracts**: PROJECT.md § Interface Contracts
- **Code layout**: PROJECT.md § Code Layout

## Change Tracker
- **Files modified**:
  - `Invitations.Api/Program.cs`: confirmed `public partial class Program { }` at bottom
  - `Invitations.Api/Services/IInvitationService.cs`: updated `GetMessagesAsync` to nullable `Task<IReadOnlyList<GuestMessageDto>?>`, added `CreateMessageAsync`
  - `Invitations.Api/Services/InvitationService.cs`: implemented nullable `GetMessagesAsync` returning null on missing slug, implemented `CreateMessageAsync` returning null on missing slug
  - `Invitations.Api/Endpoints/InvitationEndpoints.cs`: updated endpoints to return `{ error = ... }`, handle null as 404 NotFound, set Created URI to `/api/invitations/{slug}/messages`
  - `Invitations.Api/Data/AppDbContext.cs`: added composite covering index `entity.HasIndex(m => new { m.InvitationId, m.CreatedAt })`
  - `Invitations.Api/Data/DbSeeder.cs`: added idempotent raw SQL index creation `IX_GuestMessages_InvitationId_CreatedAt`
- **Build status**: `dotnet build` succeeded with 0 errors
- **Pending issues**: None

## Quality Status
- **Build/test result**: Invitations.Api build PASS (0 errors); Invitations.Api.Tests test run PASS (8 passed, 0 failed, 0 skipped)
- **Lint status**: Clean
- **Tests added/modified**: Read-only verification against existing suite

## Loaded Skills
- **Source**: `C:\Users\ahta6\.gemini\config\skills\backend-patterns\SKILL.md`
- **Local copy**: `c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\worker_backend\backend-patterns_SKILL.md`
- **Core methodology**: RESTful API design, thin endpoints, service layer separation, query optimization & composite indexing.

## Key Decisions Made
- Matched exact error format `{ error = $"Invitation with slug '{slug}' was not found." }` across endpoints.
- Maintained `AddMessageAsync` as alias to `CreateMessageAsync` in `IInvitationService` and `InvitationService` to preserve backward compatibility.

## Artifact Index
- `handoff.md` — Final handoff report
- `progress.md` — Liveness and progress heartbeat
- `DISPATCH.md` — Received dispatch instructions
