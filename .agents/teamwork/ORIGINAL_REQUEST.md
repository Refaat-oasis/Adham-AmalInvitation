# Original User Request

## Initial Request — 2026-11-05T13:12:31Z

Modify the existing ASP.NET Core Web API in `C:\Users\ahta6\OneDrive\Desktop\invitations website\Invitations.Api` to generically store both invitation data and guest kind words in SQL Server for multiple invitations, and build/migrate the React frontend in `C:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal` to submit and display kind words for the Adham & Amal invitation.

Working directory: C:\Users\ahta6\OneDrive\Desktop\invitations website
Integrity mode: development

## Requirements

### R1. Generic Invitation & Kind Words Persistence in `Invitations.Api`
Extend the existing ASP.NET Core API in `Invitations.Api` (`AppDbContext`, models, and SQL Server schema) to store both invitation records (identifier/slug, title/names, date, and configuration) and guest kind words/messages (guest name, message, timestamp, status). The database design must link kind words to their parent invitation via foreign key to generically support the Adham & Amal invitation as well as future invitations.

### R2. Generic Web API Endpoints in `Invitations.Api`
Add endpoints to `Invitations.Api` that generically handle both invitation data and guest messages:
- Endpoints to create, update, and retrieve invitation details by identifier/slug (e.g. `GET /api/invitations/{slug}`).
- Endpoints to submit kind words for an invitation and retrieve approved/all kind words for that invitation (e.g. `POST /api/invitations/{slug}/messages` and `GET /api/invitations/{slug}/messages`).
Endpoint handlers must serve strictly as the HTTP transport layer, delegating business logic and database queries to service/data layers without breaking existing API routes.

### R3. React Frontend Wedding Invitation & Guestbook
In `weddingInvitations\adham and amal`, convert/migrate the wedding invitation (`adham_aml_wedding_invitation.html`) into a React application. The React application must connect to the `Invitations.Api` backend to load invitation data, provide an interactive form for guests to submit kind words, and display a list of submitted messages.

## Acceptance Criteria

### Backend & Database (`Invitations.Api`)
- [ ] EF Core entities and migrations in `Invitations.Api` establish relational tables in SQL Server for invitations and guest kind words.
- [ ] Endpoints exist to retrieve invitation data and post/get guest messages using a generic invitation identifier/slug.
- [ ] Guest messages are associated with the corresponding invitation ID and cannot leak into or be retrieved by another invitation slug.
- [ ] Route handlers adhere to thin controller/minimal endpoint principles, delegating logic cleanly.
- [ ] Existing endpoints and services in `Invitations.Api` build and run without regressions.

### Frontend (`weddingInvitations\adham and amal`)
- [ ] The React wedding invitation reproduces all visual design, typography, and sections of the original HTML invitation.
- [ ] An interactive kind words section allows guests to enter their name and message with client-side validation.
- [ ] Submitted kind words are posted to `POST /api/invitations/adham-amal/messages` and dynamically updated in the UI.

### Verification & Testing
- [ ] Automated integration tests verify that invitation data and guest kind words can be saved and retrieved via the API.
- [ ] Automated tests verify multi-invitation isolation: messages submitted for invitation A do not appear in queries for invitation B.
- [ ] The .NET solution (`Invitations.Api.csproj`) builds cleanly with zero errors.
