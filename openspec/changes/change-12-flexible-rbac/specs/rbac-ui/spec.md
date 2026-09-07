## ADDED Requirements

### Requirement: User profile includes permissions

The system SHALL extend `GET /auth/me` to return `permissions: string[]` alongside `roles: string[]`.

#### Scenario: Authenticated user receives permissions

- **WHEN** an authenticated user calls `GET /auth/me`
- **THEN** the system SHALL return `{ id, email, firstName, lastName, roles, permissions, imageUrl }`

### Requirement: usePermissions hook

The system SHALL provide a `usePermissions()` hook in `src/hooks/usePermissions.ts` that exposes:
- `permissions: string[]` — the user's permission keys
- `has(permission: string): boolean` — checks if the user has a specific permission
- `hasAny(permissions: string[]): boolean` — checks if the user has any of the listed permissions

#### Scenario: Hook returns user permissions

- **WHEN** a component calls `usePermissions()`
- **THEN** the system SHALL return the permissions from the authenticated user's profile

#### Scenario: has() returns true for granted permission

- **WHEN** the user has the `products:create` permission
- **THEN** `has('products:create')` SHALL return `true`

#### Scenario: has() returns false for missing permission

- **WHEN** the user does not have the `roles:manage` permission
- **THEN** `has('roles:manage')` SHALL return `false`

### Requirement: Can component

The system SHALL provide a `<Can>` component in `src/components/auth/Can.tsx` that conditionally renders children based on permissions.

#### Scenario: Children rendered when permission granted

- **WHEN** `<Can permission="products:create">` wraps content and the user has that permission
- **THEN** the system SHALL render the children

#### Scenario: Children hidden when permission missing

- **WHEN** `<Can permission="products:create">` wraps content and the user lacks that permission
- **THEN** the system SHALL render nothing

#### Scenario: anyOf prop

- **WHEN** `<Can anyOf={['products:create', 'products:update']}>` and the user has `products:update`
- **THEN** the system SHALL render the children

### Requirement: ProtectedRoute supports permissions

The system SHALL extend `ProtectedRoute` to accept an `allowedPermissions` prop alongside the existing `allowedRoles`.

#### Scenario: Permission-based route guard

- **WHEN** `<ProtectedRoute allowedPermissions={['users:manage']}>` wraps a page and the user lacks `users:manage`
- **THEN** the system SHALL redirect to `/403`

#### Scenario: Role-based route guard (backward compatible)

- **WHEN** `<ProtectedRoute allowedRoles={['admin']}>` wraps a page and the user has `admin`
- **THEN** the system SHALL render the page (existing behavior preserved)

### Requirement: Admin layout permission check

The system SHALL update `(admin)/layout.tsx` to check permissions instead of the hard-coded `role === 'admin'` check.

#### Scenario: Admin area access with permissions

- **WHEN** a user navigates to `/admin/*` and has at least one admin-scope permission (e.g., `dashboard:view`, `products:read`, `users:manage`)
- **THEN** the system SHALL render the admin layout

#### Scenario: No admin-scope permissions

- **WHEN** a user navigates to `/admin/*` and has no admin-scope permissions
- **THEN** the system SHALL redirect to `/403`

### Requirement: Permission-driven sidebar

The system SHALL update `DesktopSidebar` and `MobileMenu` to conditionally render admin menu items based on permissions.

#### Scenario: Admin sees permitted items

- **WHEN** a user with `users:manage` views the sidebar
- **THEN** the system SHALL display the "Usuários" menu item

#### Scenario: Admin does not see restricted items

- **WHEN** a user without `roles:manage` views the sidebar
- **THEN** the system SHALL NOT display the "Perfis" menu item

#### Scenario: Menu items mapped to permissions

- **WHEN** the sidebar renders
- **THEN** each admin menu item SHALL be conditionally visible based on the corresponding permission:
  - Dashboard → `dashboard:view`
  - Produtos → `products:read`
  - Categorias → `categories:read`
  - Clientes → `customers:read`
  - Pedidos → `orders:read`
  - Usuários → `users:manage`
  - Perfis → `roles:manage`

### Requirement: Users admin page (list)

The system SHALL provide an admin page at `(admin)/admin/users/page.tsx` displaying a list of users with status, roles, and actions.

#### Scenario: View user list

- **WHEN** an admin with `users:manage` navigates to `/admin/users`
- **THEN** the system SHALL display a table with columns: name, email, status (badge), roles, created date, actions (edit, toggle status)

#### Scenario: Search users

- **WHEN** the admin types in the search bar
- **THEN** the system SHALL filter the user list by name or email

### Requirement: Users admin page (create)

The system SHALL provide a create user form at `(admin)/admin/users/new/page.tsx`.

#### Scenario: Create user form

- **WHEN** an admin navigates to `/admin/users/new`
- **THEN** the system SHALL display a form with fields: name, email, password (optional), role selection (multi-select from available roles)

#### Scenario: Submit create user

- **WHEN** the admin submits the form
- **THEN** the system SHALL call `POST /admin/users` and redirect to the user list on success

### Requirement: Users admin page (edit)

The system SHALL provide an edit user form at `(admin)/admin/users/[id]/edit/page.tsx`.

#### Scenario: Edit user form

- **WHEN** an admin navigates to `/admin/users/:id/edit`
- **THEN** the system SHALL display a form pre-filled with the user's current data (name, email, status, assigned roles)

#### Scenario: Toggle user status

- **WHEN** the admin clicks the activate/deactivate toggle
- **THEN** the system SHALL call `PATCH /admin/users/:id` with the new status and update the UI

### Requirement: Roles admin page (list)

The system SHALL provide an admin page at `(admin)/admin/roles/page.tsx` displaying a list of roles with permission counts and actions.

#### Scenario: View role list

- **WHEN** an admin with `roles:manage` navigates to `/admin/roles`
- **THEN** the system SHALL display a table with columns: name, slug, description, permission count, user count, system badge, actions (edit, delete)

### Requirement: Roles admin page (create)

The system SHALL provide a create role form at `(admin)/admin/roles/new/page.tsx`.

#### Scenario: Create role with permissions matrix

- **WHEN** an admin navigates to `/admin/roles/new`
- **THEN** the system SHALL display a form with fields: name, slug, description, and a permissions matrix (checkboxes grouped by resource group)

#### Scenario: Permissions matrix

- **WHEN** the permissions matrix renders
- **THEN** it SHALL group permissions by `group` (e.g., "Produtos", "Pedidos") and display checkboxes for each permission key with descriptions

### Requirement: Roles admin page (edit)

The system SHALL provide an edit role form at `(admin)/admin/roles/[id]/edit/page.tsx`.

#### Scenario: Edit role with permissions

- **WHEN** an admin navigates to `/admin/roles/:id/edit`
- **THEN** the system SHALL display the form pre-filled with the role's current data and checked permissions

#### Scenario: System role edit restrictions

- **WHEN** the admin edits a system role (`system: true`)
- **THEN** the system SHALL disable the name and slug fields (only description and permissions are editable)

### Requirement: Frontend services for RBAC

The system SHALL provide API client services in `src/services/users.ts` and `src/services/roles.ts` following the existing `services/customers.ts` pattern.

#### Scenario: User service functions

- **WHEN** the frontend needs to interact with user endpoints
- **THEN** `src/services/users.ts` SHALL export: `getUsers`, `getUser`, `createUser`, `updateUser`, `deleteUser`

#### Scenario: Role service functions

- **WHEN** the frontend needs to interact with role endpoints
- **THEN** `src/services/roles.ts` SHALL export: `getRoles`, `getRole`, `createRole`, `updateRole`, `deleteRole`, `getPermissions`
