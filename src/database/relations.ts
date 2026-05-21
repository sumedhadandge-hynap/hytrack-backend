import { relations } from 'drizzle-orm';

import { users } from './schema/users.schema';
import { roles } from './schema/roles.schema';
import { userRoles } from './schema/user-roles.schema';
import { apps } from './schema/apps.schema';
import { appTypes } from './schema/app-types.schema';
import { appSteps } from './schema/app-steps.schema';
import { appFields } from './schema/app-fields.schema';
import { appVersions } from './schema/app-versions.schema';




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




// =====================================
// APPS & APP TYPES RELATIONS
// =====================================
export const appTypesRelations =
  relations(appTypes, ({ many }) => ({
    apps: many(apps),
  }));


// =====================================
// APPS RELATIONS
// =====================================

export const appsRelations =
  relations(apps, ({ one, many }) => ({

    appType: one(appTypes, {
      fields: [apps.app_type_id],
      references: [appTypes.id],
    }),

    steps: many(appSteps),
    versions: many(appVersions),
  }));



// =====================================
// APP STEPS RELATIONS
// =====================================

export const appStepsRelations =
  relations(appSteps, ({ one }) => ({

    app: one(apps, {
      fields: [appSteps.app_id],
      references: [apps.id],
    }),
  }));



export const appFieldsRelations =
  relations(appFields, ({ one }) => ({

    app: one(apps, {
      fields: [appFields.app_id],
      references: [apps.id],
    }),

    step: one(appSteps, {
      fields: [appFields.step_id],
      references: [appSteps.id],
    }),
  }));



// =====================================
// APP VERSIONS RELATIONS
// =====================================
export const appVersionsRelations =
  relations(appVersions, ({ one }) => ({

    app: one(apps, {
      fields: [appVersions.app_id],
      references: [apps.id],
    }),
  }));


