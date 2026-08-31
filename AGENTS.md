# AGENTS.md

# Rule Precedence

When instructions conflict, apply them in the following order:

1. Security
2. Architecture
3. Correctness
4. Simplicity
5. Developer Experience

Conflicts are resolved by the highest applicable rule; between rules of equal rank, the most specific one wins. Skill files are task-specific procedures: they do not override this file unless they carry a higher-priority rule explicitly.

---

# Purpose

This document contains the permanent operating rules that apply to nearly every development task in this repository.

Task-specific procedures (testing, Playwright, Docker, Prisma, OpenSpec, infrastructure, etc.) are owned by dedicated skill files and must be loaded when required.

---

# 1. Core Principles

## Think Before Acting

Before implementing:

- Understand the request.
- Identify assumptions.
- Present alternatives when meaningful.
- Ask for clarification when requirements are ambiguous.

Never begin implementation without understanding the problem.

---

## Simplicity First

Always prefer:

- Existing patterns
- Small changes
- Straightforward implementations

Avoid:

- Premature abstraction
- Speculative features
- Unnecessary refactoring

---

## Surgical Changes

Modify only the files directly related to the requested work.

Avoid unrelated:

- formatting
- renaming
- refactoring

Keep pull requests focused.

---

## Goal-Oriented Development

Whenever practical:

1. Understand the problem.
2. Update or create automated tests.
3. Implement the solution.
4. Validate the result.

---

# 2. Architecture

## Frontend

Technology

- Next.js 16 (App Router)
- React 19
- TypeScript
- Vanilla CSS
- Clerk for authentication state

Responsibilities

- Rendering
- User interaction
- API consumption

Forbidden

- Business rules
- Authorization
- Database access
- Prisma

The frontend is a presentation layer only.

---

## Backend

Technology

- NestJS 11
- Prisma 7
- PostgreSQL 15
- Clerk JWT verification (RBAC: ADMIN / CUSTOMER)

Responsibilities

- Business rules
- Validation
- Authorization
- Persistence

All business decisions belong to the backend.

---

## Database

Requirements

- PostgreSQL
- Prisma migrations
- Versioned schema changes

Never:

- modify production schemas manually
- introduce database-specific features that reduce portability

The application must remain portable across local Docker environments and managed PostgreSQL providers.

---

# 3. Repository Structure

```text
apps/
    frontend/   Next.js 16 (App Router)
    backend/    NestJS 11 (Prisma, PostgreSQL)
docs/           problem.md, prd.md, spec.md, architecture.md, design.md
openspec/       Spec-Driven changes and delta specs
.fluxo/         Discovery/Delivery methodology manuals
.agents/        Skills and workflows for AI coding agents
infra/          Infrastructure as code
.github/        CI/CD workflows
```

This is an npm workspaces monorepo (`workspaces: apps/*`). Follow existing project conventions before introducing new structures.

---

# 4. Development Workflow

For non-trivial tasks:

## Analysis

- Understand requirements
- Inspect affected files
- Identify risks

## Planning

Describe:

- files to modify
- implementation strategy
- validation approach

Feature work follows Spec-Driven Development: propose changes through OpenSpec (`openspec-propose`), implement (`openspec-apply-change`), verify (`openspec-verify-change`), then archive.

## Implementation

Make the smallest change that satisfies the requirement.

## Validation

Run only the validation steps applicable to the modified code (see Quality Standards).

## Report

Summarize:

- implemented changes
- validation performed
- remaining risks
- assumptions

---

# 5. Terminal Operations

Commands should be:

- reproducible
- deterministic
- non-interactive

Prefer explicit working directories (`--workspace`, `workdir`) instead of chained `cd` commands.

Run validation commands non-interactively: pin E2E runs with `--workers=1`, start infrastructure with `docker compose up -d db`, and avoid prompts that block execution.

Never start long-running processes (dev servers, watch modes) unless explicitly requested.

---

# 6. Quality Standards

A task is complete only when:

- requirements are satisfied
- relevant automated validation succeeds
- the `quality-gate` skill has been executed (mandatory)
- no known regression has been introduced

Canonical validation commands — run only the ones applicable to the change:

| Command | Scope |
|---------|-------|
| `npm run lint` | ESLint (runs with `--fix`; keep fixes scoped) |
| `npm run build` | Build frontend and backend |
| `npm run test:unit` | Backend Jest unit tests with coverage |
| `npm run test:integration` | Backend Supertest integration tests (real PostgreSQL) |
| `npm run test:e2e` | Frontend Playwright E2E (resets DB, `--workers=1`) |
| `npm run test:all` | The complete test pipeline |

Stryker mutation testing and SonarQube analysis exist as deeper quality gates; use them when backend logic or overall code quality is in scope.

CI (GitHub Actions) runs these pipelines, including Playwright E2E — validate locally with the same commands before pushing.

Resolve all validation failures before completion. Whenever applicable, update automated tests.

---

# 7. Documentation

Before implementing significant changes, consult the relevant project documentation.

| Document | Path | Purpose |
|-----------|------|---------|
| Problem Definition | `docs/problem.md` | Business problem and scope |
| Product Requirements | `docs/prd.md` | Business behavior |
| Technical Specification | `docs/spec.md` | Architecture and implementation decisions |
| Architecture | `docs/architecture.md` | Structural decisions |
| UI Specification / Design System | `docs/design.md` | Interface behavior and visual consistency |
| OpenSpec specs | `openspec/specs/` | Delta specs governing implemented behavior |

Project documentation always takes precedence over assumptions.

---

# 8. External Knowledge

When framework or library behavior is uncertain, consult authoritative documentation instead of relying on memory.

Preferred sources:

- Context7 for framework APIs
- Official documentation
- Official RFCs
- Vendor documentation

---

# 9. Continuous Improvement

If you identify recurring corrections, outdated guidance, or missing project conventions, propose improvements to this AGENTS.md.

The configuration should evolve together with the project.

---

# Skill Loading

Load a skill as soon as the current task matches its trigger — before taking task actions, not after. When several apply, load all applicable skills and follow their instructions.

The `quality-gate` skill is mandatory before declaring any task complete.

Examples:

| Skill | When to Load |
|--------|--------------|
| quality-gate | Before finishing any task (mandatory) |
| jest-unit-tests | Backend unit tests |
| supertest-integration-tests | Backend integration tests |
| playwright-e2e-tests | Frontend E2E tests |
| openspec-propose / apply-change / verify-change | OpenSpec-driven feature work |
| nestjs-best-practices | NestJS code |
| next-best-practices | Next.js code |
| clerk-* | Authentication-related work |
| supabase-postgres-best-practices | PostgreSQL work |
| shadcn-ui / stitch-loop | UI component work |
| deploy | Deployment to AWS |
| code-review / frontend-code-review | Reviewing code |

---

# Environment

Configuration is centralized in a single `.env` file at the repository root; the backend loads it explicitly (dotenv + ConfigModule).

- Never commit `.env` or `.env.local` (both are gitignored).
- Keep `.env.example` in sync whenever variables are added or changed.
- The frontend must not define its own source of truth for configuration; `NEXT_PUBLIC_*` values are read from the shared file. A local `apps/frontend/.env.local` is permitted only for machine-local overrides.
- Do not create module-specific `.env` files unless the project architecture explicitly changes.

---

# Scope of This File

AGENTS.md owns permanent, cross-cutting rules for every development task. Task-specific procedures (testing, Playwright, Docker, Prisma, OpenSpec, deployment) live in skill files and must be loaded when required.

Propose changes to this file through review as the project evolves (see Continuous Improvement). Do not silently expand it with one-off project-specific procedures.