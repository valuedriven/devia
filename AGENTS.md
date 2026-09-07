# AGENTS.md

Permanent, cross-cutting operating rules for every development task in this repository. Task-specific procedures (testing, Playwright, Docker, Prisma, OpenSpec, deployment) are owned by dedicated skill files and must be loaded when required.

# Rule Precedence

When instructions conflict, apply the highest applicable rule: 1. Security, 2. Architecture, 3. Correctness, 4. Simplicity, 5. Developer Experience. Between rules of equal rank, the most specific one wins. Skill files do not override this file unless they carry a higher-priority rule explicitly.

# 1. Core Principles

## Think Before Acting

Before implementing: understand the request, identify assumptions, present alternatives when meaningful, and ask for clarification when requirements are ambiguous.

## Simplicity First

Prefer existing patterns, small changes, and straightforward implementations. Avoid premature abstraction, speculative features, and unnecessary refactoring.

## Surgical Changes

Modify only files directly related to the requested work. Avoid unrelated formatting, renaming, or refactoring. Keep pull requests focused.

# 2. Architecture

## Frontend

- Stack: Next.js 16 (App Router), React 19, TypeScript, Vanilla CSS; Clerk for authentication state.
- Owns rendering, user interaction, and API consumption — a presentation layer only.
- Forbidden: business rules, authorization, database access, Prisma.
- Auth UI is custom: never render official Clerk SDK components (`<SignIn>`, `<SignUp>`, `<UserProfile>`).
- Styling uses the design-system CSS tokens from `globals.css`; no hardcoded colors.
- Accessibility baseline: semantic HTML, keyboard-reachable interactions, visible focus states, labeled form controls.

## Backend

- Stack: NestJS 11, Prisma 7, PostgreSQL 15+, Clerk JWT verification (RBAC: ADMIN / CUSTOMER).
- Owns business rules, validation, authorization, and persistence. All business decisions belong to the backend.
- Logging via `nestjs-pino`; tracing via OpenTelemetry (auto-instrumentations + OTLP exporter) shipped to Grafana Cloud.
- Keep auto-instrumentation intact; endpoint changes must remain OpenTelemetry-compliant. OpenTelemetry initializes only when `OTEL_EXPORTER_OTLP_ENDPOINT` is set — never fail a request because telemetry is unavailable.

## Database

- PostgreSQL 15+ with Prisma migrations and versioned schema changes. Never modify production schemas manually or introduce database-specific features that reduce portability.
- The application must remain portable across local Docker environments (`postgres:17-alpine`) and managed PostgreSQL providers.

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

npm workspaces monorepo (`workspaces: apps/*`). Follow existing project conventions before introducing new structures.

# 4. Development Workflow

For non-trivial tasks: analyze requirements, affected files, and risks → plan (files to modify, implementation strategy, validation approach) → implement the smallest change that satisfies the requirement, updating or creating automated tests whenever applicable → run the validation steps applicable to the modified code (see Quality Standards) → report implemented changes, validation performed, remaining risks, and assumptions.

Feature work follows Spec-Driven Development: propose (`openspec-propose`), implement (`openspec-apply-change`), verify (`openspec-verify-change`), archive (`openspec-archive-change`). These skills drive the `openspec` CLI (e.g. `openspec list --json`); while a change is in flight, its directory under `openspec/changes/` is the source of truth.

Commits: small and focused on one concern (or one OpenSpec task), imperative subject lines referencing the change ID when applicable (e.g. `change-10-dashboard-base`). Never commit generated artifacts, coverage output, or `.env*` files.

# 5. Terminal Operations

Commands must be reproducible, deterministic, and non-interactive. Prefer explicit working directories over chained `cd`; scope scripts per app with `npm run <script> --workspace=frontend|backend` (plain npm workspaces — no Turborepo). Pin E2E runs with `--workers=1`, start infrastructure with `docker compose up -d db`, and avoid prompts that block execution. Never start long-running processes (dev servers, watch modes) unless explicitly requested.

# 6. Quality Standards

A task is complete only when requirements are satisfied, relevant automated validation succeeds, the `quality-gate` skill has been executed (mandatory), and no known regression has been introduced.

Canonical validation commands — run only the ones applicable to the change (`npm run test:all` runs the complete pipeline):

| Command | Scope |
|---------|-------|
| `npm run lint` | ESLint (runs with `--fix`; keep fixes scoped) |
| `npm run build` | Build frontend and backend |
| `npm run test:unit` | Backend Jest unit tests with coverage |
| `npm run test:integration` | Backend Supertest integration tests (real PostgreSQL) |
| `npm run test:e2e` | Frontend Playwright E2E (resets DB, `--workers=1`) |

Enforced minimums: 80% Jest coverage (statements, branches, functions, lines); unit tests for services and business rules, integration tests for controllers and APIs, Playwright E2E for user flows — every change carries tests matching its nature, covering happy path, sad path, and edge cases.

Stryker mutation testing and SonarQube are deeper gates for backend logic or overall code quality. CI (GitHub Actions) runs these pipelines, including Playwright E2E — validate locally with the same commands before pushing. Resolve all validation failures before completion; update automated tests whenever applicable.

# 7. Documentation

Consult the relevant docs before significant changes; project documentation always takes precedence over assumptions.

| Document | Path | Purpose |
|-----------|------|---------|
| Problem Definition | `docs/problem.md` | Business problem and scope |
| Product Requirements | `docs/prd.md` | Business behavior |
| Technical Specification | `docs/spec.md` | Architecture and implementation decisions |
| Architecture | `docs/architecture.md` | Structural decisions |
| UI Spec / Design System | `docs/design.md` | Interface behavior and visual consistency |
| OpenSpec specs | `openspec/specs/` | Current capability specs (deltas under `openspec/changes/`) |

# 8. External Knowledge

When framework or library behavior is uncertain, consult authoritative sources — Context7 for framework APIs, official documentation and RFCs, vendor documentation — instead of relying on memory.

# Skill Loading

Load a skill as soon as the task matches its trigger — before taking task actions, not after. When several apply, load all and follow their instructions. The authoritative catalog is the session skill list (mirrored under `.agents/`); common triggers:

- `quality-gate` — before finishing any task (mandatory)
- Testing: `jest-unit-tests`, `supertest-integration-tests`, `playwright-e2e-tests`
- OpenSpec: `openspec-propose` / `apply-change` / `verify-change` / `archive-change`
- Backend: `nestjs-best-practices`, `supabase-postgres-best-practices`
- Frontend: `next-best-practices`, `shadcn-ui` / `stitch-loop`, `vercel-composition-patterns` / `vercel-react-best-practices`, `web-design-guidelines`
- Auth: `clerk-*` (setup, patterns, orgs, webhooks, testing)
- Review / deploy: `code-review` / `frontend-code-review`, `deploy`

# Environment

## Toolchain

- Node.js 24 (LTS), npm workspaces (`workspaces: apps/*`), Docker for local infrastructure.
- Exact dependency versions live in each `package.json`; this document states supported majors only.
- Runtime upgrades are deliberate: bump CI images/engines together and validate with the full pipeline before merging.

## Configuration

Centralized in a single `.env` file at the repository root; the backend loads it explicitly (dotenv + ConfigModule).

- Never commit `.env` or `.env.local` (both gitignored); keep `.env.example` in sync whenever variables are added or changed.
- The frontend must not define its own source of truth for configuration; `NEXT_PUBLIC_*` values come from the shared file. A local `apps/frontend/.env.local` is permitted only for machine-local overrides.
- Do not create module-specific `.env` files unless the project architecture explicitly changes.

## Secrets

- Secrets live only in `.env` (gitignored), GitHub Actions secrets, or the Terraform secrets module — never in source code, docs, commit messages, or logs, and never echoed in terminal output, PR descriptions, or bug reports.
- When adding a variable: add a placeholder to `.env.example`, mirrored in `docker-compose.yml` and CI secrets where the app consumes it.
- A suspected credential leak is a Security-rule violation: rotate immediately and report it.

## Dependencies

- Prefer patch/minor upgrades, batched per workspace, validated with `npm run build` and `npm run test:all`. Security updates take priority and should not wait for a feature cycle.
- Major framework upgrades (Next.js, NestJS, Prisma, React) are architectural changes — route them through OpenSpec.

# Scope & Evolution

This file owns permanent, cross-cutting rules; skill files own task-specific procedures. Propose improvements to it through review as the project evolves (recurring corrections, outdated guidance, missing conventions) — do not silently expand it with one-off project-specific procedures.
