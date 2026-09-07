## ADDED Requirements

### Requirement: User entity

The system SHALL maintain a `User` entity in PostgreSQL with the following fields:
- `id` (UUID, primary key)
- `clerkId` (string, unique, mapped from Clerk user ID)
- `email` (string, unique)
- `name` (string)
- `status` (string, default `ACTIVE`; values: `ACTIVE`, `INACTIVE`)
- `createdAt`, `updatedAt`

#### Scenario: User is created on login

- **WHEN** an authenticated user logs in for the first time
- **THEN** the system SHALL upsert a `User` record with their `clerkId`, `email`, and `name`

#### Scenario: User has no DB roles (bootstrap)

- **WHEN** a newly created `User` has no `UserRole` associations
- **THEN** the system SHALL read the user's Clerk `publicMetadata.roles` and assign the corresponding `Role` records in the database

#### Scenario: Existing admin receives DB role

- **WHEN** an existing admin (with `roles: ["admin"]` in Clerk metadata) logs in post-deploy
- **THEN** the system SHALL assign the `ADMIN` role in the database via the bootstrap mechanism

### Requirement: Role entity

The system SHALL maintain a `Role` entity with:
- `id` (UUID, primary key)
- `name` (string, unique; display name like "Administrador")
- `slug` (string, unique; machine-readable like "admin")
- `description` (string, optional)
- `active` (boolean, default `true`)
- `system` (boolean, default `false`; protects `ADMIN` and `CUSTOMER` from deletion)

#### Scenario: System roles cannot be deleted

- **WHEN** an admin attempts to delete a role with `system: true`
- **THEN** the system SHALL return 409 Conflict

#### Scenario: Role with assigned users cannot be deleted

- **WHEN** an admin attempts to delete a role that has active user assignments
- **THEN** the system SHALL return 409 Conflict with a message indicating the role is in use

### Requirement: Permission entity

The system SHALL maintain a `Permission` entity with:
- `id` (UUID, primary key)
- `key` (string, unique; e.g., `products:create`, `orders:read`)
- `group` (string; resource group for UI matrix, e.g., `products`, `orders`)
- `description` (string; human-readable label)
- `active` (boolean, default `true`)

#### Scenario: Permission catalog

- **WHEN** the seed runs
- **THEN** the system SHALL create permissions for all resource groups: `dashboard`, `products`, `categories`, `customers`, `orders`, `payments`, `users`, `roles`

#### Scenario: Permission keys follow resource:action pattern

- **WHEN** permissions are created
- **THEN** each permission key SHALL follow the pattern `resource:action` (e.g., `products:create`, `orders:read`)

### Requirement: UserRole join table

The system SHALL maintain a many-to-many relationship between `User` and `Role` via `UserRole` (composite primary key: `userId`, `roleId`).

#### Scenario: User assigned to multiple roles

- **WHEN** an admin assigns roles to a user
- **THEN** the system SHALL create `UserRole` records for each assigned role

#### Scenario: User removed from role

- **WHEN** an admin removes a role from a user
- **THEN** the system SHALL delete the corresponding `UserRole` record

### Requirement: RolePermission join table

The system SHALL maintain a many-to-many relationship between `Role` and `Permission` via `RolePermission` (composite primary key: `roleId`, `permissionId`).

#### Scenario: Role with permissions

- **WHEN** an admin creates or updates a role
- **THEN** the system SHALL create/update `RolePermission` records for each assigned permission

### Requirement: Seed creates base roles

The seed SHALL create two system roles:
- `ADMIN` (slug: `admin`, system: true) with ALL permissions
- `CUSTOMER` (slug: `customer`, system: true) with NO permissions

#### Scenario: Seed is idempotent

- **WHEN** the seed runs multiple times
- **THEN** it SHALL NOT create duplicate roles or permissions

### Requirement: First admin via seed

The system SHALL accept a `SEED_ADMIN_CLERK_ID` environment variable (optional) to assign the `ADMIN` role to a specific user during seed.

#### Scenario: SEED_ADMIN_CLERK_ID is provided

- **WHEN** the seed runs with `SEED_ADMIN_CLERK_ID` set
- **THEN** the system SHALL upsert a `User` record with that `clerkId` and assign the `ADMIN` role

#### Scenario: SEED_ADMIN_CLERK_ID is not provided

- **WHEN** the seed runs without `SEED_ADMIN_CLERK_ID`
- **THEN** the system SHALL skip user creation and only create roles/permissions

### Requirement: User status

The system SHALL support `ACTIVE` and `INACTIVE` status values for users.

#### Scenario: Inactive user is rejected

- **WHEN** a user with `status: INACTIVE` requests a protected endpoint
- **THEN** the system SHALL return 401 Unauthorized (even if JWT is valid)

#### Scenario: Activate user

- **WHEN** an admin activates an inactive user
- **THEN** the system SHALL set `status: ACTIVE` in the database and unblock the user in Clerk

#### Scenario: Deactivate user

- **WHEN** an admin deactivates an active user
- **THEN** the system SHALL set `status: INACTIVE` in the database, block the user in Clerk, revoke all sessions, and invalidate the RBAC cache
