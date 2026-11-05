## 2026-11-05T13:40:58Z
You are a Worker subagent in a multi-agent engineering team.
Your Role: Backend Implementation Worker
Your Working Directory: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\worker_backend
Original Request File: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\ORIGINAL_REQUEST.md
Project Scope File: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\PROJECT.md
Domain Skill: C:\Users\ahta6\.gemini\config\skills\backend-patterns\SKILL.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE OWNERSHIP:
You own all files in `C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api\**`.
DO NOT touch any files in `weddingInvitations\adham and amal` or outside `Invitations.Api`.

TASKS FOR MILESTONES M1 & M2:
1. In `Program.cs` (`Invitations.Api\Program.cs`):
   - At the bottom of the file, add:
     ```csharp
     public partial class Program { }
     ```
     This is strictly required so `WebApplicationFactory<Program>` can reference the entry point for automated integration testing.
2. In `Services/IInvitationService.cs` and `Services/InvitationService.cs`:
   - Update `GetMessagesAsync(string slug)` to return `Task<IReadOnlyList<GuestMessageDto>?>` (nullable):
     - If the invitation with the specified normalized slug does NOT exist, return `null`.
     - If the invitation exists, return the approved messages ordered descending by `CreatedAt`.
   - Update `CreateMessageAsync(string slug, CreateGuestMessageDto dto)`:
     - If the invitation does not exist, return `null`.
     - Otherwise create and save the message associated with `InvitationId`.
3. In `Endpoints/InvitationEndpoints.cs`:
   - In the `GET /api/invitations/{slug}/messages` endpoint handler:
     - If `result` is null, return `Results.NotFound(new { error = $"Invitation with slug '{slug}' was not found." })`.
     - Otherwise return `Results.Ok(result)`.
   - In `POST /api/invitations/{slug}/messages`:
     - If result is null, return `Results.NotFound(new { error = $"Invitation with slug '{slug}' was not found." })`.
     - If validation fails, return `Results.BadRequest(...)`.
     - On success return `Results.Created($"/api/invitations/{slug}/messages", result)`.
   - Ensure the endpoints act strictly as the HTTP transport layer with ZERO direct DbContext queries or business logic.
4. In `Data/AppDbContext.cs` & `Data/DbSeeder.cs`:
   - Add covering index:
     ```csharp
     entity.HasIndex(m => new { m.InvitationId, m.CreatedAt });
     ```
   - Ensure `DbSeeder.cs` idempotent self-healing script includes this index if not already present.
5. Verification:
   - Run `dotnet build` in `Invitations.Api` and confirm 0 errors.

DELIVERABLE:
Write a detailed handoff report to:
`c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\worker_backend\handoff.md`
Include:
- Observation (what was changed and verified)
- Logic Chain (reasons for each change)
- Exact build commands and build output (confirming 0 errors)
- Interface adherence check against PROJECT.md

When done, message your parent with a concise summary and confirm handoff.md is ready.
