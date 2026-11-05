## 2026-11-05T13:50:01Z
You are a Test Writer subagent in a multi-agent engineering team.
Your Role: E2E Test Suite Engineer
Your Working Directory: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\worker_test_writer
Original Request File: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\ORIGINAL_REQUEST.md
Project Scope File: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\PROJECT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE OWNERSHIP:
You own:
- `C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api.Tests\**`
- `c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\TEST_INFRA.md`
- `c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\TEST_READY.md`
- `c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\worker_test_writer\**`
DO NOT touch `Invitations.Api/**` or `weddingInvitations\adham and amal` source code.

TASKS:
1. Create `TEST_INFRA.md` at `c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\TEST_INFRA.md` following the Project Pattern guidelines:
   - Test philosophy (opaque-box, requirement-driven, isolated in-memory DB)
   - Feature inventory mapping
   - Test architecture & runner command
2. Ensure `Invitations.Api.Tests` (`C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api.Tests`) is configured with:
   - xUnit, `Microsoft.AspNetCore.Mvc.Testing` (version `10.0.13`), `Microsoft.EntityFrameworkCore.InMemory` (version `10.0.13`).
   - `CustomWebApplicationFactory<Program>` that overrides `AppDbContext` to use an isolated in-memory database per test run (or unique database name per test class).
3. Implement comprehensive test suites covering all 4 Tiers:
   - **Tier 1 (Feature Coverage)**:
     - GetInvitation_ExistingSlug_Returns200WithFullDetails
     - CreateInvitation_ValidPayload_Returns201
     - UpdateInvitation_ValidPayload_Returns200
     - PostMessage_ValidPayload_Returns201AndAssociatesWithInvitation
     - GetMessages_ExistingSlug_Returns200OrderedDescending
     - ApprovedMessagesCount_ReflectsActualCount
   - **Tier 2 (Boundary & Corner Cases)**:
     - GetInvitation_NonExistentSlug_Returns404
     - GetMessages_NonExistentSlug_Returns404
     - PostMessage_NonExistentSlug_Returns404
     - PostMessage_EmptyGuestName_Returns400
     - PostMessage_WhitespaceGuestName_Returns400
     - PostMessage_EmptyMessage_Returns400
     - PostMessage_WhitespaceMessage_Returns400
     - PostMessage_NullBody_Returns400
     - GetInvitation_CaseInsensitiveSlug_Returns200
     - GetMessages_CaseInsensitiveSlug_Returns200
     - PostMessage_CaseInsensitiveSlug_Returns201
     - PostMessage_VeryLongMessage_SucceedsOrValidates
   - **Tier 3 (Multi-Invitation Isolation)**:
     - Isolation_MessagesPostedToSlugA_NeverAppearInSlugB
     - Isolation_MessagesPostedToSlugB_NeverAppearInSlugA
     - Isolation_MultipleInvitations_IndependentMessageCounts
     - Isolation_DuplicateSlugCreation_Returns409Conflict
   - **Tier 4 (Real-World Application Scenarios)**:
     - GuestUserJourney_ViewAdhamAmalInvitation_PostKindWords_VerifyFeedUpdated
     - ConcurrentGuests_MultiplePostings_AllPersistedAndOrdered
4. Execute `dotnet test "C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api.Tests\Invitations.Api.Tests.csproj"`:
   - Verify all tests pass with 0 errors and 0 failures.
5. Create `TEST_READY.md` at `c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\TEST_READY.md` summarizing the test runner command, pass/fail status, and coverage metrics across Tiers 1-4.
6. Deliver handoff report to `c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\worker_test_writer\handoff.md`.
