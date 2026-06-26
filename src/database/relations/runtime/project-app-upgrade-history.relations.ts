import { relations } from 'drizzle-orm';

import { projectApps } from '../../schema/runtime/project-apps.schema';
import { appVersions } from '../../schema/application-builder/app-versions.schema';
import { projectAppUpgradeHistory } from 'src/database/schema/runtime/app-upgrade-history.schema';
import { users } from 'src/database/schema';


export const projectAppUpgradeHistoryRelations = relations(
  projectAppUpgradeHistory,
  ({ one }) => ({
    projectApp: one(projectApps, {
      fields: [projectAppUpgradeHistory.projectAppId],
      references: [projectApps.id],
    }),

    fromVersion: one(appVersions, {
      fields: [projectAppUpgradeHistory.fromVersionId],
      references: [appVersions.id],
      relationName: 'upgrade_from_version',
    }),

    toVersion: one(appVersions, {
      fields: [projectAppUpgradeHistory.toVersionId],
      references: [appVersions.id],
      relationName: 'upgrade_to_version',
    }),

    upgradedUser: one(users, {
      fields: [projectAppUpgradeHistory.upgradedBy],
      references: [users.id],
    }),
  }),
);