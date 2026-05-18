// src/database/schema/role-permissions.schema.ts

import {
  pgTable,
  integer,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { baseFields } from './common.schema';
import { roles } from './roles.schema';
import { permissions } from './permission.schema';

export const rolePermissions = pgTable('role_permissions', {
  ...baseFields,

  role_id: integer('role_id').references(() => roles.id, {
    onDelete: 'cascade',
  }),

  permission_id: integer('permission_id').references(() => permissions.id, {
    onDelete: 'cascade',
  }),

  can_view: boolean('can_view').default(true),

  can_create: boolean('can_create').default(false),

  can_update: boolean('can_update').default(false),

  can_delete: boolean('can_delete').default(false),
}, (t) => [
  uniqueIndex('role_permissions_uid_unique').on(t.uid),
]);