import { relations } from 'drizzle-orm';

import { stepDiscussions } from '../../schema/runtime/step-discussions.schema';
import { appStepRuns } from '../../schema/runtime/app-step-runs.schema';
import { users } from 'src/database/schema';


export const stepDiscussionsRelations = relations(
  stepDiscussions,
  ({ one, many }) => ({
    stepRun: one(appStepRuns, {
      fields: [stepDiscussions.stepRunId],
      references: [appStepRuns.id],
    }),

    user: one(users, {
      fields: [stepDiscussions.userId],
      references: [users.id],
    }),

    parent: one(stepDiscussions, {
      fields: [stepDiscussions.parentId],
      references: [stepDiscussions.id],
      relationName: 'discussion_parent',
    }),

    replies: many(stepDiscussions, {
      relationName: 'discussion_parent',
    }),
  }),
);