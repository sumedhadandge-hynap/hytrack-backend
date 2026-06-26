import { relations } from 'drizzle-orm';

import { appVersions } from '../../schema/application-builder/app-versions.schema';
import { apps } from '../../schema/application-builder/apps.schema';
import { appSteps } from '../../schema/application-builder/app-steps.schema';
import { appFields } from '../../schema/application-builder/app-fields.schema';

export const appVersionsRelations = relations(
  appVersions,
  ({ one, many }) => ({
    app: one(apps, {
      fields: [appVersions.appId],
      references: [apps.id],
    }),

    steps: many(appSteps),

    fields: many(appFields),
  }),
);