import { relations } from 'drizzle-orm';

import { stepTypes } from '../../schema/application-builder/step-types.schema';
import { appSteps } from '../../schema/application-builder/app-steps.schema';

export const stepTypesRelations = relations(stepTypes, ({ many }) => ({
  appSteps: many(appSteps),
}));