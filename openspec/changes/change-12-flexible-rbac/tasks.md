## 1. Database Schema & Migration

- [ ] 1.1 Add `User`, `Role`, `Permission`, `UserRole`, `RolePermission` models to `schema.prisma`
- [ ] 1.2 Run `prisma migrate dev --name rbac` to generate migration
- [ ] 1.3 Run `prisma generate` to regenerate client

## 2. Seed & Bootstrap

- [ ] 2.1 Create permission catalog in `seed.ts` (grouped by resource: dashboard, products, categories, customers, orders, payments, users, roles)
- [ ] 2.2 Create base roles in `seed.ts`: ADMIN (system, all perms) and CUSTOMER (system, no perms)
- [ ] 2.3 Add `SEED_ADMIN_CLERK_ID` env var support: upsert User + assign ADMIN role
- [ ] 2.4 Update `.env.example` with `SEED_ADMIN_CLERK_ID`
- [ ] 2.5 Verify seed is idempotent (run twice, no duplicates)

## 3. Backend — User Sync & RBAC Service

- [ ] 3.1 Create `UsersModule` with `UsersService` (upsertUser, findByClerkId, assignRoles, etc.)
- [ ] 3.2 Update `ClerkService.syncUserWithData` to upsert `User` record (clerkId, email, name)
- [ ] 3.3 Add metadata bootstrap: if User has no roles, read Clerk `publicMetadata.roles` and assign
- [ ] 3.4 Create `RbacService` with `resolve(clerkId)` → `{ userId, roles, permissions }`
- [ ] 3.5 Implement in-memory cache (Map + TTL ~5 min) in `RbacService`
- [ ] 3.6 Implement `invalidate(clerkId)` and `invalidateByRoleId(roleId)` in `RbacService`
- [ ] 3.7 Export `RbacService` from `AuthModule` (global)

## 4. Backend — Guards & Decorators

- [ ] 4.1 Refactor `AuthGuard` to use `RbacService.resolve()` instead of `clerkService.getUser()`
- [ ] 4.2 Add `INACTIVE` user rejection in `AuthGuard` (return 401)
- [ ] 4.3 Refactor `RolesGuard` to read `request.user.roles` (DB) instead of `publicMetadata`
- [ ] 4.4 Create `@Permissions(...)` decorator with `PERMISSIONS_KEY` metadata
- [ ] 4.5 Create `PermissionsGuard` (any-of semantics, reads `request.user.permissions`)
- [ ] 4.6 Register `PermissionsGuard` as `APP_GUARD` in `AuthModule`
- [ ] 4.7 Update `GET /auth/me` to return `permissions` from `request.user`

## 5. Backend — Admin RBAC Module

- [ ] 5.1 Create `RbacModule` (`modules/rbac/`) with controllers, services, DTOs
- [ ] 5.2 Create `UsersController` with endpoints: list, get, create, update, delete
- [ ] 5.3 Create `UsersService` with Clerk coordination (createUser, block/unblock, revokeSession)
- [ ] 5.4 Add last-admin guard: prevent deactivation/deletion of the last active ADMIN
- [ ] 5.5 Add self-action guard: prevent deactivation/deletion of own account
- [ ] 5.6 Create `RolesController` with endpoints: list, get, create, update, delete
- [ ] 5.7 Create `RolesService` with system-role protection and permission assignment
- [ ] 5.8 Create `PermissionsController` (read-only catalog, grouped by `group`)
- [ ] 5.9 Register `RbacModule` in `AppModule`
- [ ] 5.10 Add audit logging (emit `audit.log` events) for user/role/permission lifecycle

## 6. Backend — Update Existing Controllers

- [ ] 6.1 Add `@Permissions(...)` to product endpoints (`products:create`, `products:read`, `products:update`, `products:delete`)
- [ ] 6.2 Add `@Permissions(...)` to category endpoints
- [ ] 6.3 Add `@Permissions(...)` to customer endpoints
- [ ] 6.4 Add `@Permissions(...)` to order endpoints
- [ ] 6.5 Add `@Permissions(...)` to payment endpoints
- [ ] 6.6 Verify `@Roles('admin')` still works with DB-sourced roles

## 7. Backend — Testing

- [ ] 7.1 Unit tests: `UsersService` (upsert, assign roles, activate/deactivate, last-admin guard)
- [ ] 7.2 Unit tests: `RolesService` (system protection, permission updates, cache invalidation)
- [ ] 7.3 Unit tests: `RbacService` (resolve, cache hit/miss, invalidation)
- [ ] 7.4 Unit tests: `PermissionsGuard` (any-of, missing → 403)
- [ ] 7.5 Unit tests: `RolesGuard` (DB roles, any-of)
- [ ] 7.6 Integration tests: `GET/POST /admin/users`, `PATCH /admin/users/:id`, `DELETE /admin/users/:id`
- [ ] 7.7 Integration tests: `GET/POST /admin/roles`, `PATCH /admin/roles/:id`, `DELETE /admin/roles/:id`
- [ ] 7.8 Integration tests: `GET /admin/permissions`
- [ ] 7.9 Integration tests: `GET /auth/me` returns roles + permissions
- [ ] 7.10 Verify 80% coverage (statements, branches, functions, lines)

## 8. Frontend — Types & Hooks

- [ ] 8.1 Update `UserProfile` type to include `permissions: string[]`
- [ ] 8.2 Update `AuthMe` interface in `useAuthMe.ts` to include `permissions`
- [ ] 8.3 Create `usePermissions()` hook in `src/hooks/usePermissions.ts`
- [ ] 8.4 Create `<Can>` component in `src/components/auth/Can.tsx`
- [ ] 8.5 Update `ProtectedRoute` to accept `allowedPermissions` prop

## 9. Frontend — Admin Layout & Navigation

- [ ] 9.1 Update `(admin)/layout.tsx` to check admin-scope permissions (not hard-coded role)
- [ ] 9.2 Update `DesktopSidebar` to conditionally render admin items by permission
- [ ] 9.3 Update `MobileMenu` to conditionally render admin items by permission

## 10. Frontend — Users Admin Pages

- [ ] 10.1 Create `src/services/users.ts` (getUsers, getUser, createUser, updateUser, deleteUser)
- [ ] 10.2 Create `(admin)/admin/users/page.tsx` — list with table, search, status badges, role tags
- [ ] 10.3 Create `(admin)/admin/users/new/page.tsx` — create form (name, email, password, role multi-select)
- [ ] 10.4 Create `(admin)/admin/users/[id]/edit/page.tsx` — edit form with status toggle

## 11. Frontend — Roles Admin Pages

- [ ] 11.1 Create `src/services/roles.ts` (getRoles, getRole, createRole, updateRole, deleteRole, getPermissions)
- [ ] 11.2 Create `(admin)/admin/roles/page.tsx` — list with table, permission count, system badge
- [ ] 11.3 Create `(admin)/admin/roles/new/page.tsx` — create form with permissions matrix (checkboxes grouped by resource)
- [ ] 11.4 Create `(admin)/admin/roles/[id]/edit/page.tsx` — edit form with pre-checked permissions, system-role field restrictions

## 12. Frontend — Testing

- [ ] 12.1 Unit tests: `usePermissions` hook, `<Can>` component
- [ ] 12.2 Unit tests: `ProtectedRoute` with `allowedPermissions`
- [ ] 12.3 Integration tests: Users admin pages (CRUD, search, status toggle)
- [ ] 12.4 Integration tests: Roles admin pages (CRUD, permissions matrix)
- [ ] 12.5 Verify 80% coverage

## 13. E2E Testing

- [ ] 13.1 Plan Playwright E2E test scenarios using `.agents/prompts/playwright-test-planner.md`
- [ ] 13.2 Generate and implement E2E tests: admin manages users (create, activate/deactivate, assign roles)
- [ ] 13.3 Generate and implement E2E tests: admin manages roles (create, edit permissions matrix)
- [ ] 13.4 Generate and implement E2E tests: CUSTOMER user → 403 on `/admin/*`
- [ ] 13.5 Generate and implement E2E tests: sidebar/menu reflects permissions

## 14. Verification

- [ ] 14.1 Run `npm run lint` — both workspaces
- [ ] 14.2 Run `npm run test:unit` — all pass with coverage >= 80%
- [ ] 14.3 Run `npm run test:integration` — all pass with coverage >= 80%
- [ ] 14.4 Run `npm run test:e2e` — all pass
- [ ] 14.5 Execute `quality-gate` skill
