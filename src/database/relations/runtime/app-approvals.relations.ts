import { relations } from 'drizzle-orm';

import { appApprovals } from '../../schema/runtime/app-approvals.schema';
import { appStepRuns } from '../../schema/runtime/app-step-runs.schema';
import { users } from 'src/database/schema';


export const appApprovalsRelations = relations(
  appApprovals,
  ({ one }) => ({
    stepRun: one(appStepRuns, {
      fields: [appApprovals.stepRunId],
      references: [appStepRuns.id],
    }),

    approver: one(users, {
      fields: [appApprovals.approverId],
      references: [users.id],
    }),

    delegatedUser: one(users, {
      fields: [appApprovals.delegatedTo],
      references: [users.id],
      relationName: 'delegated_user',
    }),

    escalatedUser: one(users, {
      fields: [appApprovals.escalatedTo],
      references: [users.id],
      relationName: 'escalated_user',
    }),
  }),
);