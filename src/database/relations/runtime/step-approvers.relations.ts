import { relations } from 'drizzle-orm';

import { stepApprovers } from '../../schema/application-builder/step-approvers.schema';
import { appSteps } from '../../schema/application-builder/app-steps.schema';

import { roles } from '../../schema/auth/roles.schema';
import { users } from '../../schema/auth/users.schema';

export const stepApproversRelations = relations(
  stepApprovers,
  ({ one }) => ({
    step: one(appSteps, {
      fields: [stepApprovers.stepId],
      references: [appSteps.id],
    }),

    user: one(users, {
      fields: [stepApprovers.userId],
      references: [users.id],
    }),

    role: one(roles, {
      fields: [stepApprovers.roleId],
      references: [roles.id],
    }),
  }),
);