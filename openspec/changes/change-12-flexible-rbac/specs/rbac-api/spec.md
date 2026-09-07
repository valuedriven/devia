## ADDED Requirements

### Requirement: List users (admin)

The system SHALL provide `GET /v1/admin/users` returning a paginated list of users with their assigned roles.

#### Scenario: List all users

- **WHEN** an admin calls `GET /v1/admin/users`
- **THEN** the system SHALL return 200 with an array of users including `id`, `clerkId`, `email`, `name`, `status`, `roles[]`, `createdAt`

#### Scenario: Search users

- **WHEN** an admin calls `GET /v1/admin/users?search=john`
- **THEN** the system SHALL filter users by name or email containing the search term (case-insensitive)

#### Scenario: Non-admin access

- **WHEN** a user without `users:manage` permission calls `GET /v1/admin/users`
- **THEN** the system SHALL return 403 Forbidden

### Requirement: Get user by ID (admin)

The system SHALL provide `GET /v1/admin/users/:id` returning a single user with roles and permissions.

#### Scenario: Get user with roles

- **WHEN** an admin calls `GET /v1/admin/users/:id`
- **THEN** the system SHALL return 200 with the user including `id`, `clerkId`, `email`, `name`, `status`, `roles[]`, `createdAt`

#### Scenario: User not found

- **WHEN** the specified user ID does not exist
- **THEN** the system SHALL return 404 Not Found

### Requirement: Create user (admin)

The system SHALL provide `POST /v1/admin/users` to create a new user in both Clerk and the database.

#### Scenario: Create user with email and password

- **WHEN** an admin calls `POST /v1/admin/users` with `{ email, password, name, roleIds[] }`
- **THEN** the system SHALL create a Clerk user, upsert the DB `User` record, assign the specified roles, and return 201 with the user

#### Scenario: Create user without password (invitation)

- **WHEN** an admin calls `POST /v1/admin/users` with `{ email, name, roleIds[] }` (no password)
- **THEN** the system SHALL create a Clerk user (requiring password setup on first login), upsert the DB `User` record, assign roles, and return 201

#### Scenario: Duplicate email

- **WHEN** the email already exists in Clerk
- **THEN** the system SHALL return 409 Conflict

### Requirement: Update user (admin)

The system SHALL provide `PATCH /v1/admin/users/:id` to update user profile and role assignments.

#### Scenario: Update name and roles

- **WHEN** an admin calls `PATCH /v1/admin/users/:id` with `{ name, roleIds[] }`
- **THEN** the system SHALL update the user's name, replace role assignments, invalidate the RBAC cache, and return 200 with the updated user

#### Scenario: Deactivate user

- **WHEN** an admin calls `PATCH /v1/admin/users/:id` with `{ status: "INACTIVE" }`
- **THEN** the system SHALL set `status: INACTIVE` in the DB, block the user in Clerk (`users.update` with `blocked: true`), revoke all sessions, invalidate cache, and return 200

#### Scenario: Activate user

- **WHEN** an admin calls `PATCH /v1/admin/users/:id` with `{ status: "ACTIVE" }`
- **THEN** the system SHALL set `status: ACTIVE` in the DB, unblock the user in Clerk, invalidate cache, and return 200

#### Scenario: Cannot deactivate self

- **WHEN** an admin attempts to deactivate their own account
- **THEN** the system SHALL return 409 Conflict

#### Scenario: Cannot deactivate last active admin

- **WHEN** an admin attempts to deactivate the last active user with the ADMIN role
- **THEN** the system SHALL return 409 Conflict with a message indicating this would lock out all admins

### Requirement: Delete user (admin)

The system SHALL provide `DELETE /v1/admin/users/:id` to hard-delete a user from both Clerk and the database.

#### Scenario: Delete user

- **WHEN** an admin calls `DELETE /v1/admin/users/:id`
- **THEN** the system SHALL delete the user from Clerk, delete the `User` and `UserRole` records from the DB, invalidate cache, and return 204

#### Scenario: Cannot delete self

- **WHEN** an admin attempts to delete their own account
- **THEN** the system SHALL return 409 Conflict

#### Scenario: Cannot delete last active admin

- **WHEN** an admin attempts to delete the last active user with the ADMIN role
- **THEN** the system SHALL return 409 Conflict

### Requirement: List roles (admin)

The system SHALL provide `GET /v1/admin/roles` returning all roles with their permission counts.

#### Scenario: List all roles

- **WHEN** an admin calls `GET /v1/admin/roles`
- **THEN** the system SHALL return 200 with an array of roles including `id`, `name`, `slug`, `description`, `active`, `system`, `permissionCount`, `userCount`

### Requirement: Get role by ID (admin)

The system SHALL provide `GET /v1/admin/roles/:id` returning a single role with its full permission set.

#### Scenario: Get role with permissions

- **WHEN** an admin calls `GET /v1/admin/roles/:id`
- **THEN** the system SHALL return 200 with the role including `id`, `name`, `slug`, `description`, `active`, `system`, `permissions[]`

### Requirement: Create role (admin)

The system SHALL provide `POST /v1/admin/roles` to create a new role with permission assignments.

#### Scenario: Create role with permissions

- **WHEN** an admin calls `POST /v1/admin/roles` with `{ name, slug, description, permissionIds[] }`
- **THEN** the system SHALL create the role, assign the specified permissions, and return 201

#### Scenario: Duplicate slug

- **WHEN** the slug already exists
- **THEN** the system SHALL return 409 Conflict

### Requirement: Update role (admin)

The system SHALL provide `PATCH /v1/admin/roles/:id` to update a role's metadata and permission assignments.

#### Scenario: Update role permissions

- **WHEN** an admin calls `PATCH /v1/admin/roles/:id` with `{ name, description, permissionIds[] }`
- **THEN** the system SHALL update the role, replace permission assignments, invalidate cache for all affected users, and return 200

#### Scenario: Cannot edit system role name

- **WHEN** an admin attempts to change the `name` or `slug` of a role with `system: true`
- **THEN** the system SHALL return 409 Conflict

### Requirement: Delete role (admin)

The system SHALL provide `DELETE /v1/admin/roles/:id` to delete a non-system role.

#### Scenario: Delete non-system role

- **WHEN** an admin calls `DELETE /v1/admin/roles/:id` on a non-system role with no assigned users
- **THEN** the system SHALL delete the role and return 204

#### Scenario: Cannot delete system role

- **WHEN** an admin attempts to delete a role with `system: true`
- **THEN** the system SHALL return 409 Conflict

#### Scenario: Cannot delete role with assigned users

- **WHEN** an admin attempts to delete a role that has assigned users
- **THEN** the system SHALL return 409 Conflict

### Requirement: List permissions catalog (admin)

The system SHALL provide `GET /v1/admin/permissions` returning the permission catalog grouped by resource.

#### Scenario: Get grouped permissions

- **WHEN** an admin calls `GET /v1/admin/permissions`
- **THEN** the system SHALL return 200 with permissions grouped by `group` (e.g., `{ products: [...], orders: [...] }`)

### Requirement: Audit logging for RBAC changes

The system SHALL emit `audit.log` events for all RBAC lifecycle operations.

#### Scenario: User lifecycle audit

- **WHEN** a user is created, updated, activated, deactivated, or deleted
- **THEN** the system SHALL emit an `audit.log` event with `entityType: "user"`, the operation as `action`, and relevant payload

#### Scenario: Role lifecycle audit

- **WHEN** a role is created, updated, or deleted
- **THEN** the system SHALL emit an `audit.log` event with `entityType: "role"`, the operation as `action`, and relevant payload

#### Scenario: Permission assignment audit

- **WHEN** a role's permissions are changed
- **THEN** the system SHALL emit an `audit.log` event with `entityType: "role"`, `action: "permissions.updated"`, and the old/new permission sets in the payload
