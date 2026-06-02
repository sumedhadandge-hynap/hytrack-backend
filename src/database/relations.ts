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
import { permissions } from './schema/permission.schema';
import { rolePermissions } from './schema/role-permissions.schema';
import { projectFields } from './schema/project-fields.schema';
import { projectRecordValues } from './schema/project-record-values.schema';
import { projectMembers } from './schema/project-members.schema';
import { projectApps } from './schema/project-apps.schema';
import { projects } from './schema/projects.schema';
import { companies } from './schema/companies.schema';
import { countries, states, cities } from './schema/master.schema';
import { projectAppRecords } from './schema/project_app_records';
import { projectAppRecordValues } from './schema/project_app_record_values';
import { projectAppApprovals } from './schema/project_app_approvals';




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



export const projectFieldsRelations =
  relations(projectFields, ({ one, many }) => ({
    project: one(projects, {
      fields: [projectFields.project_id],
      references: [projects.id],
    }),

    referenceApp: one(apps, {
      fields: [projectFields.reference_app_id],
      references: [apps.id],
    }),

    values: many(projectRecordValues),
  }));

export const projectRecordValuesRelations =
  relations(projectRecordValues, ({ one }) => ({
    project: one(projects, {
      fields: [projectRecordValues.project_id],
      references: [projects.id],
    }),

    field: one(projectFields, {
      fields: [projectRecordValues.field_id],
      references: [projectFields.id],
    }),
  }));

export const projectMembersRelations =
  relations(projectMembers, ({ one }) => ({
    project: one(projects, {
      fields: [projectMembers.project_id],
      references: [projects.id],
    }),

    user: one(users, {
      fields: [projectMembers.user_id],
      references: [users.id],
    }),
  }));

export const projectAppsRelations =
  relations(projectApps, ({ one }) => ({
    project: one(projects, {
      fields: [projectApps.project_id],
      references: [projects.id],
    }),

    app: one(apps, {
      fields: [projectApps.app_id],
      references: [apps.id],
    }),

    version: one(appVersions, {
      fields: [projectApps.version_id],
      references: [appVersions.id],
    }),
  }));

export const projectsRelations = relations(
  projects,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [projects.company_id],
      references: [companies.id],
    }),
    country: one(countries, {
      fields: [projects.country_id],
      references: [countries.id],
    }),
    state: one(states, {
      fields: [projects.state_id],
      references: [states.id],
    }),
    city: one(cities, {
      fields: [projects.city_id],
      references: [cities.id],
    }),
    fields: many(projectFields),
    members: many(projectMembers),
    apps: many(projectApps),
  })
);




export const projectAppRecordsRelations =
  relations(
    projectAppRecords,
    ({ many }) => ({

      values: many(
        projectAppRecordValues,
      ),

      approvals: many(
        projectAppApprovals,
      ),
    }),
  );



export const projectAppRecordValuesRelations =
  relations(
    projectAppRecordValues,
    ({ one }) => ({

      record: one(
        projectAppRecords,
        {
          fields: [
            projectAppRecordValues.record_id,
          ],
          references: [
            projectAppRecords.id,
          ],
        },
      ),
    }),
  );



export const projectAppApprovalsRelations =
  relations(
    projectAppApprovals,
    ({ one }) => ({

      record: one(
        projectAppRecords,
        {
          fields: [
            projectAppApprovals.record_id,
          ],
          references: [
            projectAppRecords.id,
          ],
        },
      ),
    }),
  );