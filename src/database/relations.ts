import { relations } from 'drizzle-orm';

import { users } from './schema/users.schema';
import { roles } from './schema/roles.schema';
import { userRoles } from './schema/user-roles.schema';


// =====================================
// USERS RELATIONS
// =====================================

export const usersRelations = relations(
  users,
  ({ many }) => ({

    userRoles: many(userRoles),
  }),
);


// =====================================
// ROLES RELATIONS
// =====================================

export const rolesRelations = relations(
  roles,
  ({ many }) => ({

    userRoles: many(userRoles),
  }),
);


// =====================================
// USER ROLES RELATIONS
// =====================================

export const userRolesRelations = relations(
  userRoles,
  ({ one }) => ({

    user: one(users, {
      fields: [userRoles.user_id],
      references: [users.id],
    }),

    role: one(roles, {
      fields: [userRoles.role_id],
      references: [roles.id],
    }),
  }),
);