# Test Infrastructure & Strategy Specification

## 1. Test Philosophy & Design Principles

### Opaque-Box & Requirement-Driven
The test suite for `Invitations.Api` treats the application as an opaque HTTP transport system. All tests exercise the public REST API endpoints through standard HTTP requests (`GET`, `POST`, `PUT`) using `HttpClient` provided by `Microsoft.AspNetCore.Mvc.Testing`. Tests assert observable behaviors, HTTP status codes, headers, and JSON contract responses rather than inspecting internal database states or mocking service implementations.

### Strict Isolation & Reproducibility
- **In-Memory Database per Test Class**: Each test suite is isolated through `CustomWebApplicationFactory`, which registers an ephemeral `Microsoft.EntityFrameworkCore.InMemory` database instance with a unique GUID name (`TestInvitationsDb_{guid}`).
- **Zero Cross-Test Pollution**: Tests do not leak state across classes or test runs. No persistent SQL Server or external network dependencies are required to run the automated test suite.
- **Idempotent Seeding**: The test database is pre-seeded with the reference wedding invitation (`adham-amal`) and initial approved guest messages using `DbSeeder.SeedAsync`, guaranteeing consistent baseline data across test executions.

### Multi-Tenant / Multi-Invitation Isolation Verification
The architecture enforces strict query isolation across invitation slugs. The test suites explicitly test cross-tenant boundaries:
- Messages posted to Invitation A must never leak into Invitation B.
- Message counts and listings are strictly partitioned by normalized invitation slug.
- Slugs are normalized with trimming and case-insensitivity.

---

## 2. Feature Inventory Mapping

The test suite covers features outlined in `PROJECT.md` across 4 progressive tiers:

| Tier | Test Suite File | Feature Under Test | Test Methods |
|------|-----------------|-------------------|--------------|
| **Tier 1** | `Tier1_FeatureCoverageTests.cs` | Primary Happy-Path CRUD & Flow | - `GetInvitation_ExistingSlug_Returns200WithFullDetails`<br>- `CreateInvitation_ValidPayload_Returns201`<br>- `UpdateInvitation_ValidPayload_Returns200`<br>- `PostMessage_ValidPayload_Returns201AndAssociatesWithInvitation`<br>- `GetMessages_ExistingSlug_Returns200OrderedDescending`<br>- `ApprovedMessagesCount_ReflectsActualCount` |
| **Tier 2** | `Tier2_BoundaryCornerTests.cs` | Boundary Conditions, Normalization & Errors | - `GetInvitation_NonExistentSlug_Returns404`<br>- `GetMessages_NonExistentSlug_Returns404`<br>- `PostMessage_NonExistentSlug_Returns404`<br>- `PostMessage_EmptyGuestName_Returns400`<br>- `PostMessage_WhitespaceGuestName_Returns400`<br>- `PostMessage_EmptyMessage_Returns400`<br>- `PostMessage_WhitespaceMessage_Returns400`<br>- `PostMessage_NullBody_Returns400`<br>- `GetInvitation_CaseInsensitiveSlug_Returns200`<br>- `GetMessages_CaseInsensitiveSlug_Returns200`<br>- `PostMessage_CaseInsensitiveSlug_Returns201`<br>- `PostMessage_VeryLongMessage_SucceedsOrValidates` |
| **Tier 3** | `Tier3_MultiInvitationIsolationTests.cs` | Multi-Invitation & Cross-Tenant Data Isolation | - `Isolation_MessagesPostedToSlugA_NeverAppearInSlugB`<br>- `Isolation_MessagesPostedToSlugB_NeverAppearInSlugA`<br>- `Isolation_MultipleInvitations_IndependentMessageCounts`<br>- `Isolation_DuplicateSlugCreation_Returns409Conflict` |
| **Tier 4** | `Tier4_RealWorldWorkflowTests.cs` | End-to-End Guest Journeys & Concurrency | - `GuestUserJourney_ViewAdhamAmalInvitation_PostKindWords_VerifyFeedUpdated`<br>- `ConcurrentGuests_MultiplePostings_AllPersistedAndOrdered` |

---

## 3. Test Architecture & Configuration

### Technology Stack
- **Test Framework**: `xUnit` (v2.9.3) with `xunit.runner.visualstudio` (v3.0.1)
- **Integration Harness**: `Microsoft.AspNetCore.Mvc.Testing` (v10.0.13)
- **Database Engine**: `Microsoft.EntityFrameworkCore.InMemory` (v10.0.13)
- **Assertion Library**: `FluentAssertions` (v8.8.0)
- **Target Framework**: .NET 10.0 (`net10.0`)

### Test Harness: `CustomWebApplicationFactory`
The custom factory extends `WebApplicationFactory<Program>`:
1. Replaces the SQL Server EF Core DbContext registration with an in-memory database provider.
2. Generates an isolated database name per factory instance.
3. Ensures database schema creation and baseline seeding (`DbSeeder.SeedAsync`).
4. Configures environment as `"Testing"`.

### Test Runner Commands

#### Execute All Tests
```bash
dotnet test "C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api.Tests\Invitations.Api.Tests.csproj" --verbosity normal
```

#### Execute Specific Tier
```bash
# Tier 1
dotnet test "C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api.Tests\Invitations.Api.Tests.csproj" --filter "FullyQualifiedName~Tier1"

# Tier 2
dotnet test "C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api.Tests\Invitations.Api.Tests.csproj" --filter "FullyQualifiedName~Tier2"

# Tier 3
dotnet test "C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api.Tests\Invitations.Api.Tests.csproj" --filter "FullyQualifiedName~Tier3"

# Tier 4
dotnet test "C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api.Tests\Invitations.Api.Tests.csproj" --filter "FullyQualifiedName~Tier4"
```
