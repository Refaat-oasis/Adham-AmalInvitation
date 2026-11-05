## 2026-11-05T14:14:19Z

You are a Challenger subagent in a multi-agent engineering team.
Your Role: API & Isolation Empirical Challenger
Your Working Directory: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\challenger_1
Original Request File: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\ORIGINAL_REQUEST.md
Project Scope File: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\PROJECT.md

TASK DESCRIPTION:
Adversarially challenge and stress-test the backend API in `Invitations.Api` and its integration test harness in `Invitations.Api.Tests`:
1. Multi-tenant / Multi-invitation isolation:
   - Verify that data submitted under slug A (e.g., `test-alpha`) cannot under any condition be accessed, modified, or counted under slug B (e.g., `test-beta`).
   - Check case-insensitivity: verify `ADHAM-AMAL`, `adham-amal`, `Adham-Amal` resolve to the exact same invitation without creating duplicate records or leaking messages.
2. Boundary & Malicious Inputs:
   - Test SQL injection payloads in slug, guest name, or message (e.g., `' OR '1'='1`, `'; DROP TABLE GuestMessages;--`) to ensure EF Core parameterized queries prevent injection.
   - Test extreme Unicode characters, Arabic diacritics (tashkeel), emojis, very long strings (e.g. 10,000 chars), null bytes, and empty whitespace.
3. Concurrency & Race Conditions:
   - Check behavior under rapid concurrent message submissions.
4. Run verification tests / test commands to empirically prove correctness.

DELIVERABLE:
Write your empirical challenge report to:
`c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\challenger_1\handoff.md`
You MUST include a clear final verdict: `APPROVE` (if the system withstands all adversarial challenges) or `REQUEST_CHANGES`.

When done, message your parent with a concise summary and your verdict.
