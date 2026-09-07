## Context

The current authorization system stores roles in Clerk `publicMetadata.roles` as a static `["admin", "customer"]` array. The `AuthGuard` calls `clerkService.getUser()` on every request (network round-trip) to resolve roles, and `RolesGuard` reads `publicMetadata` to enforce access. There is no `User` entity in the database — only a `Customer` table used for order placement.

This change introduces a database-driven RBAC module that enables administrators to manage user lifecycle and role profiles within the application itself.

## Goals / Non-Goals

**Goals:**
- Introduce `User`, `Role`, `Permission` entities in Prisma/PostgreSQL
- Store authorization data (roles, permissions) in the database, not Clerk metadata
- Resolve user roles/permissions from DB with in-memory cache
- Remove per-request `clerkService.getUser()` call from `AuthGuard`
- Add `@Permissions` decorator coexisting with `@Roles`
- Admin CRUD endpoints for users, roles, and permissions catalog
- Frontend permission-driven navigation and UI visibility
- Admin screens for user management and role/permission matrix

**Non-Goals:**
- Multi-instance cache invalidation (pub/sub)
- User invitation flow (email-based)
- Role hierarchy or inheritance
- Multi-tenancy RBAC (forbidden in MVP per `architecture.md`)

## Decisions

### 1. Authorization lives in Postgres, not Clerk

**Decision:** The database is the source of truth for roles and permissions. Clerk remains only the identity provider (authentication = who you are).

**Rationale:**
- The "flexible RBAC" requirement demands admin CRUD for roles/permissions — this is natural with DB entities
- Clerk metadata is a flat `publicMetadata.roles: string[]` — insufficient for permission-level granularity
- AGENTS.md: "All business decisions belong to the backend"
- `architecture.md` states "Roles are stored in the identity provider" — this document will be updated to reflect the new architecture

**Trade-off:** A one-time migration is needed for existing admins (metadata → DB on first login). Documented in the sync design below.

### 2. User entity is separate from Customer

**Decision:** Introduce a `User` model (clerkId, email, name, status) distinct from the existing `Customer` model.

**Rationale:**
- Admin users (operators) are not customers — conflating them creates noise in the customer list
- `Order.customerId` references `Customer` — decoupling avoids a large migration
- User lifecycle (activate/deactivate, role assignment) is an authorization concern; Customer is a business/commerce concern
- Surgical change: `Customer` sync stays as-is for the storefront

**Trade-off:** Duplicate data (email, name) between `User` and `Customer` for accounts that are also buyers. Acceptable for the MVP scope.

### 3. Cache strategy: in-memory with explicit invalidation

**Decision:** `RbacService` resolves user roles/permissions from DB with an in-memory `Map` (TTL ~5 min) + explicit invalidation on writes.

**Rationale:**
- Single-instance deployment assumption (current Docker Compose setup)
- Explicit invalidation on writes (role assignment, permission change, user status) ensures consistency for the common case
- TTL as a safety net for edge cases (process restart, stale cache)
- Removing the `getUser()` network call improves request latency

**Trade-off:** Multi-instance deployments would need pub/sub invalidation. Documented as a future concern.

### 4. User sync on login/register (no webhooks)

**Decision:** `syncUserWithData` upserts `User` in the database. No Clerk webhooks.

**Rationale:**
- Keeps the existing sync pattern (login/register → upsert)
- Avoids webhook infrastructure complexity
- One-time metadata bootstrap handles existing admins: if a User has no DB roles, roles are read from Clerk `publicMetadata.roles` and assigned in DB

**Trade-off:** Existing admins only receive their DB role on the next login post-deploy. Mitigated by `SEED_ADMIN_CLERK_ID` env var.

### 5. Coexistence of @Roles and @Permissions

**Decision:** Both decorators remain. `@Roles` enforces role membership (any-of). `@Permissions` enforces permission ownership (any-of). Both can be combined on the same handler.

**Rationale:**
- Existing `@Roles('admin')` decorators continue to work (ADMIN role seeded with all permissions)
- Fine-grained control via `@Permissions` is added where needed
- Coexistence preserves backward compatibility while enabling granularity

**Trade-off:** Two guards checking access adds slight complexity. Mitigated by registering both as global `APP_GUARD` in `AuthModule` (standard NestJS pattern).

### 6. First admin bootstrap

**Decision:** Seed creates permission catalog + ADMIN/CUSTOMER roles. `SEED_ADMIN_CLERK_ID` env var assigns ADMIN to a specific user. Metadata bootstrap handles existing admins on first login.

**Rationale:**
- Seed is idempotent and can be run multiple times
- `SEED_ADMIN_CLERK_ID` is the simplest way to bootstrap a fresh environment
- Metadata bootstrap is a graceful migration for existing Clerk workspaces

**Trade-off:** Developer must know the Clerk user ID. Could be obtained from Clerk dashboard or after first login.

### 7. Frontend permission-driven UI

**Decision:** `GET /auth/me` returns `permissions[]`. Frontend uses `usePermissions()` hook and `<Can>` component. Sidebar/menu items condition on permissions.

**Rationale:**
- Follows the existing pattern (AuthContext, useAuthMe)
- Permission-based checks are more granular and flexible than role-based checks
- Admin layout guards the area; individual items guard by specific permission

**Trade-off:** New pages (`admin/users`, `admin/roles`) increase frontend scope. Mitigated by following existing component patterns (AdminDataTable, CustomerForm, etc.).

## Risks / Trade-offs

- **Migration timing:** Existing admins lose access until next login post-deploy (unless `SEED_ADMIN_CLERK_ID` is set). Acceptable for a controlled deployment.
- **User↔Customer duplication:** Both entities coexist. Future cleanup possible but out of scope for this change.
- **Cache consistency:** Single-instance assumption. Multi-instance would need pub/sub. Documented as a future concern.
- **Clerk `blocked` flag:** Deactivating a user must also block in Clerk to prevent new logins. The AuthGuard already rejects INACTIVE users from DB (belt and suspenders).
