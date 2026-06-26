import { relations } from 'drizzle-orm';

import { appRecords } from '../../schema/runtime/app-records.schema';
import { projectApps } from '../../schema/runtime/project-apps.schema';
import { appVersions } from '../../schema/application-builder/app-versions.schema';
import { appRecordValues } from '../../schema/runtime/app-record-values.schema';

export const appRecordsRelations = relations(
  appRecords,
  ({ one, many }) => ({
    projectApp: one(projectApps, {
      fields: [appRecords.projectAppId],
      references: [projectApps.id],
    }),

    version: one(appVersions, {
      fields: [appRecords.versionId],
      references: [appVersions.id],
    }),

    values: many(appRecordValues),
  }),
);