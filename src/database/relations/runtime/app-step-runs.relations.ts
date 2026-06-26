import { relations } from 'drizzle-orm';

import { appRuns } from '../../schema/runtime/app-runs.schema';
import { appStepRuns } from '../../schema/runtime/app-step-runs.schema';
import { appSteps } from '../../schema/application-builder/app-steps.schema';

export const appStepRunsRelations = relations(
  appStepRuns,
  ({ one }) => ({
    run: one(appRuns, {
      fields: [appStepRuns.runId],
      references: [appRuns.id],
    }),

    step: one(appSteps, {
      fields: [appStepRuns.stepId],
      references: [appSteps.id],
    }),
  }),
);