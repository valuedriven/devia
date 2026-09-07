## ADDED Requirements

### Requirement: RbacService resolves user access from DB

The system SHALL provide an `RbacService` that resolves a user's roles and permissions from the PostgreSQL database by `clerkId`.

#### Scenario: Active user with roles

- **WHEN** `RbacService.resolve(clerkId)` is called for an active user with assigned roles
- **THEN** the system SHALL return `{ userId, roles: string[], permissions: string[] }` where `roles` are the user's role slugs and `permissions` are the aggregated permission keys from all assigned roles

#### Scenario: User with no roles

- **WHEN** `RbacService.resolve(clerkId)` is called for a user with no role assignments
- **THEN** the system SHALL return `{ userId, roles: [], permissions: [] }`

#### Scenario: User not found

- **WHEN** `RbacService.resolve(clerkId)` is called for a non-existent clerkId
- **THEN** the system SHALL return `null`

### Requirement: RBAC cache with explicit invalidation

The system SHALL cache resolved user access in memory with a TTL (~5 minutes) and support explicit invalidation.

#### Scenario: Cache hit

- **WHEN** `RbacService.resolve(clerkId)` is called within TTL
- **THEN** the system SHALL return the cached result without querying the database

#### Scenario: Cache miss (TTL expired)

- **WHEN** `RbacService.resolve(clerkId)` is called after TTL expiry
- **THEN** the system SHALL query the database, update the cache, and return the result

#### Scenario: Cache invalidation on role change

- **WHEN** a user's role assignments change (add/remove role)
- **THEN** the system SHALL invalidate the cache entry for that user

#### Scenario: Cache invalidation on permission change

- **WHEN** a role's permission assignments change
- **THEN** the system SHALL invalidate the cache entry for every user assigned to that role

#### Scenario: Cache invalidation on user status change

- **WHEN** a user's status changes (ACTIVE ↔ INACTIVE)
- **THEN** the system SHALL invalidate the cache entry for that user

### Requirement: AuthGuard resolves access from DB

The system SHALL update `AuthGuard` to resolve user access from `RbacService` instead of calling `clerkService.getUser()` per-request.

#### Scenario: Valid JWT with active user

- **WHEN** a request arrives with a valid JWT for an ACTIVE user
- **THEN** the system SHALL verify the JWT, resolve access via `RbacService`, and populate `request.user` with `{ id, clerkId, email, name, roles, permissions }`

#### Scenario: Valid JWT with inactive user

- **WHEN** a request arrives with a valid JWT for an INACTIVE user
- **THEN** the system SHALL return 401 Unauthorized

#### Scenario: No more Clerk getUser() per request

- **WHEN** AuthGuard processes a request
- **THEN** the system SHALL NOT call `clerkService.getUser()` (network round-trip eliminated)

### Requirement: RolesGuard reads DB roles

The system SHALL update `RolesGuard` to read `request.user.roles` (populated from DB) instead of `user.publicMetadata`.

#### Scenario: Role check via DB

- **WHEN** `RolesGuard` checks `@Roles('admin')` on a handler
- **THEN** the system SHALL compare the required roles against `request.user.roles` (DB-sourced)

#### Scenario: User has matching role

- **WHEN** `request.user.roles` contains a role that matches any required role (case-insensitive)
- **THEN** the system SHALL allow the request

#### Scenario: User lacks matching role

- **WHEN** `request.user.roles` does not contain any required role
- **THEN** the system SHALL return 403 Forbidden

### Requirement: PermissionsGuard enforces permission-based access

The system SHALL provide a `PermissionsGuard` that checks `request.user.permissions` against `@Permissions(...)` decorator metadata.

#### Scenario: @Permissions decorator

- **WHEN** a handler is decorated with `@Permissions('products:create')`
- **THEN** the system SHALL require the user to have the `products:create` permission

#### Scenario: Any-of semantics

- **WHEN** a handler is decorated with `@Permissions('products:create', 'products:update')`
- **THEN** the system SHALL allow the request if the user has ANY of the listed permissions

#### Scenario: User lacks all permissions

- **WHEN** `request.user.permissions` does not contain any of the required permissions
- **THEN** the system SHALL return 403 Forbidden

#### Scenario: No @Permissions decorator

- **WHEN** a handler has no `@Permissions` decorator
- **THEN** the system SHALL allow the request (no permission enforcement)

### Requirement: Coexistence of @Roles and @Permissions

The system SHALL support both `@Roles` and `@Permissions` decorators on the same handler, with both guards enforced.

#### Scenario: Both decorators present

- **WHEN** a handler is decorated with `@Roles('admin')` and `@Permissions('orders:update')`
- **THEN** the system SHALL enforce BOTH checks (user must have the role AND at least one permission)

#### Scenario: Only @Roles present

- **WHEN** a handler is decorated with `@Roles('admin')` but no `@Permissions`
- **THEN** the system SHALL enforce only the role check (backward compatible)

#### Scenario: Only @Permissions present

- **WHEN** a handler is decorated with `@Permissions('products:create')` but no `@Roles`
- **THEN** the system SHALL enforce only the permission check

### Requirement: Auth/me endpoint returns permissions

The system SHALL update `GET /auth/me` to return `permissions: string[]` alongside the existing `roles: string[]`.

#### Scenario: Authenticated user with permissions

- **WHEN** an authenticated user calls `GET /auth/me`
- **THEN** the system SHALL return `{ id, email, firstName, lastName, roles, permissions, imageUrl }` where `roles` and `permissions` are resolved from the database

#### Scenario: Cache performance improvement

- **WHEN** `GET /auth/me` is called
- **THEN** the system SHALL resolve access from `RbacService` cache (no per-request Clerk API call)
