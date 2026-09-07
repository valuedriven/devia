# 12 — Flexible RBAC

## Summary

Refactor the authorization system from a static 2-role model (ADMIN/CUSTOMER) stored in Clerk metadata to a database-driven RBAC module with User, Role, and Permission entities. Administrators gain the ability to manage user lifecycle (activate/deactivate) and role profiles (permissions matrix). The frontend adapts to permission-driven navigation and UI visibility.

## Functional Scope

### Backend

- **New Prisma models**: `User`, `Role`, `Permission`, `UserRole`, `RolePermission`
- **Seed**: permission catalog, base roles (ADMIN with all perms, CUSTOMER with none), optional first admin via `SEED_ADMIN_CLERK_ID`
- **Sync**: `syncUserWithData` upserts `User` (clerkId); bootstraps roles from Clerk `publicMetadata.roles` if the user has no DB roles yet (one-time migration for existing admins)
- **Cache**: `RbacService` resolves user roles+permissions from DB with in-memory cache (TTL + explicit invalidation on writes)
- **Guards refactor**:
  - `AuthGuard` stops calling `clerkService.getUser()` per-request; resolves via `RbacService`; rejects `INACTIVE` users
  - `RolesGuard` reads `request.user.roles` (DB) instead of `publicMetadata`
  - New `PermissionsGuard` + `@Permissions(...)` decorator (any-of semantics)
- **Admin endpoints** (`modules/rbac/`):
  - `UsersController`: list, get, create, update (name, status, roles), activate/deactivate (Clerk block + revokeSession + cache invalidation), delete
  - `RolesController`: list, get, create, update (name, description, permissions), delete (protected system roles)
  - `PermissionsController`: read-only catalog grouped by resource
- **Audit**: emit `audit.log` events on user/role/permission lifecycle changes
- **`GET /auth/me`**: returns `{ id, email, firstName, lastName, roles, permissions, imageUrl }` from `request.user` (no more `publicMetadata` in hot path)

### Frontend

- **`UserProfile`** gains `permissions: string[]`
- **`usePermissions()` hook** + **`<Can>` component** for permission checks
- **`ProtectedRoute`** gains `allowedPermissions` prop
- **Layout/menus**: `(admin)/layout.tsx`, `DesktopSidebar`, `MobileMenu` — replace hard-coded `role === 'admin'` with permission-based visibility
- **New admin pages**:
  - `admin/users` — list, create, edit, activate/deactivate, delete
  - `admin/roles` — list, create, edit with permissions matrix (checkboxes grouped by resource)

## Dependencies

- Change 03 (Auth & Security) — Clerk BFF, guards, JWT signing must exist
- Change 06 (Customer Management) — `Customer` entity exists; `User` is additive

## Risks

| Risk | Level | Mitigation |
|------|-------|------------|
| Cache stale after role/permission change | Medium | Explicit invalidation on every write; TTL as fallback |
| Existing admins lose access until next login | Low | `SEED_ADMIN_CLERK_ID` env var for immediate grant; metadata bootstrap on first login |
| User↔Customer data duplication | Low | Keep both entities; surgical change; future cleanup possible |
| Multi-instance cache inconsistency | Low | Single-instance assumption documented; cross-instance invalidation deferred |

## Quality Gates

### Linter

- `npm run lint` — both workspaces

### Unit Tests

- **Coverage**: Minimum 80% (statements, branches, functions, lines)
- `RbacService` — cache resolve, invalidation, ACTIVE/INACTIVE rejection
- `UsersService` — upsert, assign roles, activate/deactivate (Clerk coordination), last-admin guard
- `RolesService` — system-role protection, permission updates + cache invalidation
- `PermissionsGuard` — any-of, missing permission → 403
- `RolesGuard` (refactored) — reads DB roles, any-of
- `@Permissions` decorator

### Integration Tests

- **Coverage**: Minimum 80% (statements, branches, functions, lines)
- `GET/POST /admin/users` — CRUD, role assignment, 401/403
- `PATCH /admin/users/:id` — activate/deactivate (Clerk blocked + cache)
- `GET/POST /admin/roles` — CRUD, permission assignment
- `GET /admin/permissions` — grouped catalog
- `GET /auth/me` — returns roles + permissions

### E2E Tests

- **Planning**: Use `.agents/prompts/playwright-test-planner.md`
- **Generation**: Use `.agents/prompts/playwright-test-generator.md`
- Admin manages users (create, activate/deactivate, assign roles)
- Admin manages roles (create, edit permissions matrix)
- CUSTOMER user → 403 on `/admin/*`
- Sidebar/menu reflects permissions

## Out of Scope

- Multi-instance cache invalidation (pub/sub)
- User invitation flow (email-based)
- Role hierarchy (admin inherits sub-admin permissions)
- Multi-tenancy RBAC (per architecture.md: forbidden in MVP)
