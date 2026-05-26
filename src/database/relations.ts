import { relations } from 'drizzle-orm';

import { users } from './schema/users.schema';
import { roles } from './schema/roles.schema';
import { userRoles } from './schema/user-roles.schema';
import { apps } from './schema/apps.schema';
import { appTypes } from './schema/app-types.schema';
import { appSteps } from './schema/app-steps.schema';
import { appFields } from './schema/app-fields.schema';
import { appVersions } from './schema/app-versions.schema';
import { stepApprovers } from './schema/step-approvers.schema';
import { stepDiscussions } from './schema/step-discussions.schema';
import { appRecords } from './schema/app-records.schema';
import { appRecordValues } from './schema/app-record-values.schema';
import { permissions, rolePermissions } from './schema';





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
  relations(appSteps, ({ one, many }) => ({

    version: one(appVersions, {
      fields: [appSteps.version_id],
      references: [appVersions.id],
    }),

    fields: many(appFields),

    approvers: many(stepApprovers),

    discussions: many(stepDiscussions),
  }));



export const stepApproversRelations =
  relations(stepApprovers, ({ one }) => ({

    step: one(appSteps, {
      fields: [stepApprovers.step_id],
      references: [appSteps.id],
    }),
  }));



export const stepDiscussionsRelations =
  relations(stepDiscussions, ({ one }) => ({

    step: one(appSteps, {
      fields: [stepDiscussions.step_id],
      references: [appSteps.id],
    }),
  }));



export const appFieldsRelations =
  relations(appFields, ({ one }) => ({

    step: one(appSteps, {
      fields: [appFields.step_id],
      references: [appSteps.id],
    }),
  }));


// =====================================
// APP VERSIONS RELATIONS
// =====================================
export const appVersionsRelations =
  relations(appVersions, ({ one, many }) => ({

    app: one(apps, {
      fields: [appVersions.app_id],
      references: [apps.id],
    }),

    steps: many(appSteps),
  }));



export const appRecordsRelations =
  relations(appRecords, ({ many }) => ({
    values: many(appRecordValues),
  }));

export const appRecordValuesRelations =
  relations(appRecordValues, ({ one }) => ({

    record: one(appRecords, {
      fields: [appRecordValues.record_id],
      references: [appRecords.id],
    }),

    field: one(appFields, {
      fields: [appRecordValues.field_id],
      references: [appFields.id],
    }),
  }));


export const rolePermissionsRelations =
relations(
  rolePermissions,
  ({ one }) => ({

    permission: one(
      permissions,
      {
        fields: [
          rolePermissions.permission_id,
        ],
        references: [
          permissions.id,
        ],
      },
    ),
  }),
);