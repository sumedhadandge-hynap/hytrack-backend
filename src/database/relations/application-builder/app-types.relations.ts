import { relations } from 'drizzle-orm';

import { appTypes } from '../../schema/application-builder/app-types.schema';
import { apps } from '../../schema/application-builder/apps.schema';

export const appTypesRelations = relations(appTypes, ({ many }) => ({
  apps: many(apps),
}));