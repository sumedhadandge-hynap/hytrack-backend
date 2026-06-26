import { relations } from 'drizzle-orm';

import { apps } from '../../schema/application-builder/apps.schema';

import { appGroups } from '../../schema/application-builder/app-groups.schema';
import { appTypes } from '../../schema/application-builder/app-types.schema';
import { appVersions } from '../../schema/application-builder/app-versions.schema';
import { projectApps } from '../../schema/runtime/project-apps.schema';
import { companies } from 'src/database/schema';

export const appsRelations = relations(apps, ({ one, many }) => ({
  company: one(companies, {
    fields: [apps.companyId],
    references: [companies.id],
  }),

  group: one(appGroups, {
    fields: [apps.groupId],
    references: [appGroups.id],
  }),

  type: one(appTypes, {
    fields: [apps.typeId],
    references: [appTypes.id],
  }),

  versions: many(appVersions),

  installations: many(projectApps),
}));