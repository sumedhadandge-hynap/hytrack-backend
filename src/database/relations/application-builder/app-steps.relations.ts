import { relations } from 'drizzle-orm';

import { appSteps } from '../../schema/application-builder/app-steps.schema';
import { appVersions } from '../../schema/application-builder/app-versions.schema';
import { stepTypes } from '../../schema/application-builder/step-types.schema';
import { appFields } from '../../schema/application-builder/app-fields.schema';
import { stepApprovers } from '../../schema/application-builder/step-approvers.schema';

export const appStepsRelations = relations(appSteps, ({ one, many }) => ({
  version: one(appVersions, {
    fields: [appSteps.versionId],
    references: [appVersions.id],
  }),

  stepType: one(stepTypes, {
    fields: [appSteps.stepTypeId],
    references: [stepTypes.id],
  }),

  fields: many(appFields),

  approvers: many(stepApprovers),
}));