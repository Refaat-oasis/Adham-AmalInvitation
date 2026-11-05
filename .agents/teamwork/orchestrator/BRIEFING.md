# BRIEFING — 2026-11-05T13:13:30Z

## Mission
Orchestrate the generic persistence of invitations and kind words in Invitations.Api and the React migration of the Adham & Amal wedding invitation.

## 🔒 My Identity
- Archetype: teamwork_orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\orchestrator
- Original parent: Sentinel
- Original parent conversation ID: 0d621060-4bd3-4201-b4ff-0938439e062e

## 🔒 My Workflow
- **Pattern**: Project Pattern (Dual Track: Implementation Track + E2E Testing Track)
- **Scope document**: c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\PROJECT.md
1. **Decompose**: Survey existing codebase (Invitations.Api & HTML invitation), enumerate requirements, define milestones, establish interface contracts.
2. **Dispatch & Execute**:
   - **Survey (Top-level Project Orchestrator)**: Spawn 3 Explorers in parallel to survey Invitations.Api and adham_aml_wedding_invitation.html.
   - **Delegate (sub-orchestrator)**: Decompose into implementation milestones and E2E testing track. Delegate milestones to sub-orchestrators or execute iteration loops (Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate).
3. **On failure** (in this order):
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort; Project Orchestrator redesigns)
4. **Succession**: At 16 spawns, write handoff.md, spawn successor.
- **Work items**:
  1. Survey phase (Invitations.Api, HTML source, test requirements) [in-progress]
  2. E2E Testing Track & Test Infra setup [pending]
  3. Milestone 1: Backend EF Core Entities, Migration & Relational Schema [pending]
  4. Milestone 2: Backend Thin Endpoints & Service/Data Layer [pending]
  5. Milestone 3: React Frontend Conversion & Kind Words Integration [pending]
  6. Final Milestone: E2E Verification & Adversarial Hardening [pending]
- **Current phase**: 0 (Survey)
- **Current focus**: Survey phase with 3 parallel Explorers

## 🔒 Key Constraints
- Thin controllers / minimal endpoint handlers serving strictly as HTTP transport layer; no direct DbContext queries or business logic in controllers.
- Native ASP.NET Core Identity & Claims if auth/roles are involved.
- Zero tolerance for cheating or facade implementations; forensic auditor binary veto.
- Immutable data, clean file organization, 80%+ test coverage.
- Never reuse a subagent after it has delivered its handoff — always spawn fresh.
- Dispatch-only: NEVER write, modify, or create source code files directly. NEVER run build/test commands directly. Delegate everything.

## Current Parent
- Conversation ID: 0d621060-4bd3-4201-b4ff-0938439e062e
- Updated: 2026-11-05T13:13:30Z

## Key Decisions Made
- Selected Project Pattern with Dual Track (Implementation Track + E2E Testing Track).
- Survey phase will deploy 3 Explorers in parallel: Explorer 1 on backend Invitations.Api, Explorer 2 on frontend adham_aml_wedding_invitation.html & React assets, Explorer 3 on test suite requirements and architecture contracts.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| explorer_backend | teamwork_explorer | Backend Survey (Invitations.Api) | completed | d2755319-b416-4d97-aa80-65255b0e47ae |
| explorer_frontend | teamwork_explorer | Frontend Survey (adham & amal HTML) | completed | 4b240726-361a-4e4c-b136-99145fa67451 |
| explorer_integration | teamwork_explorer | Architecture & Test Strategy | completed | cd0bd5be-e473-4ffe-9f81-5a0a3b345063 |
| worker_backend | teamwork_worker | Backend Refinements & Program Hook (M1, M2) | completed | f93eb352-3152-40e8-86f1-9b300e6e3fa4 |
| worker_frontend | teamwork_worker | React App Conversion & Kind Words (M3, M4) | completed | ffe1e2da-fa44-4657-b13e-464aa914d859 |
| worker_test_writer | teamwork_test_writer | E2E Test Suite Scaffold & Tiers 1-4 | completed | fabdfcd5-50d4-44fa-9832-7204530e8aba |
| reviewer_1 | teamwork_reviewer | Backend & Test Reviewer | completed | 821edec5-44f6-44a9-b232-478d15f37d52 |
| reviewer_2 | teamwork_reviewer | Frontend UI & Integration Reviewer | completed | 267b63a5-2fab-464b-a498-ef52c2f87098 |
| challenger_1 | teamwork_challenger | API & Isolation Empirical Challenger | completed | d8419fb4-850d-4bdd-b19e-163d59d8ac4a |
| challenger_2 | teamwork_challenger | Frontend & Flow Challenger | completed | 7536920f-4c65-4d24-ae28-23df34e74bd8 |
| auditor_1 | teamwork_auditor | Forensic Integrity Auditor | completed | f957e396-8f84-4eb6-9ce3-2b1455f0eeff |

## Succession Status
- Succession required: no
- Spawn count: 11 / 16
- Pending subagents: none
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: stopped
- Safety timer: stopped
- On succession: kill all timers before spawning successor
- On context truncation: handle timers as step 4 of the State Recovery section of your prompt says

## Artifact Index
- c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\ORIGINAL_REQUEST.md — Verbatim user request
- c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\orchestrator\DISPATCH.md — Orchestrator dispatch log
- c:\Users\ahta6\OneDrive\Desktop\invitations website\weddingInvitations\adham and amal\.agents\teamwork\orchestrator\BRIEFING.md — Persistent working memory
