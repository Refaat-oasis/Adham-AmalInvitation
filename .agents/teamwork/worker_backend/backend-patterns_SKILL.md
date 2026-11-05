# Backend Development Patterns (Local Copy)
Source: C:\Users\ahta6\.gemini\config\skills\backend-patterns\SKILL.md

Key concepts:
- RESTful API design: Resource-based URLs, appropriate HTTP status codes (200, 201, 400, 404, 500).
- Thin controllers / Transport layer separation: Endpoint handlers only handle HTTP input validation and status codes; business logic belongs in the service layer.
- Query optimization & Indexing: Covering indexes for frequent query patterns (e.g. InvitationId + CreatedAt).
- Error handling: Clear, structured error responses.
