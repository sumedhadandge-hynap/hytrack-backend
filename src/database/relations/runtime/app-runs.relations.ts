import { relations } from 'drizzle-orm';

import { appRuns } from '../../schema/runtime/app-runs.schema';
import { appRecords } from '../../schema/runtime/app-records.schema';
import { appSteps } from '../../schema/application-builder/app-steps.schema';
import { appStepRuns } from '../../schema/runtime/app-step-runs.schema';

export const appRunsRelations = relations(
  appRuns,
  ({ one, many }) => ({
    record: one(appRecords, {
      fields: [appRuns.recordId],
      references: [appRecords.id],
    }),

    currentStep: one(appSteps, {
      fields: [appRuns.currentStepId],
      references: [appSteps.id],
    }),

    stepRuns: many(appStepRuns),
  }),
);