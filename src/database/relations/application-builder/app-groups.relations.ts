import { relations } from 'drizzle-orm';

import { appGroups } from '../../schema/application-builder/app-groups.schema';
import { apps } from '../../schema/application-builder/apps.schema';
import { companies } from '../../schema/company/companies.schema';

export const appGroupsRelations = relations(appGroups, ({ one, many }) => ({
  company: one(companies, {
    fields: [appGroups.companyId],
    references: [companies.id],
  }),

  apps: many(apps),
}));