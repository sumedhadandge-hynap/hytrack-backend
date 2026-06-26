import { relations } from 'drizzle-orm';

import { appStepRuns } from '../../schema/runtime/app-step-runs.schema';
import { users } from 'src/database/schema/auth/users.schema';
import { stepAttachments } from '../../schema/runtime/step-attachments.schema';


export const stepAttachmentsRelations = relations(
  stepAttachments,
  ({ one }) => ({
    stepRun: one(appStepRuns, {
      fields: [stepAttachments.stepRunId],
      references: [appStepRuns.id],
    }),

    uploadedUser: one(users, {
      fields: [stepAttachments.uploadedBy],
      references: [users.id],
    }),
  }),
);