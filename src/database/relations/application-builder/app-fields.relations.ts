import { relations } from 'drizzle-orm';

import { appFields } from '../../schema/application-builder/app-fields.schema';
import { appSteps } from '../../schema/application-builder/app-steps.schema';
import { appVersions } from '../../schema/application-builder/app-versions.schema';
import { apps } from '../../schema/application-builder/apps.schema';
import { fieldTypes } from '../../schema/application-builder/field-types.schema';

export const appFieldsRelations = relations(
  appFields,
  ({ one, many }) => ({
    version: one(appVersions, {
      fields: [appFields.versionId],
      references: [appVersions.id],
    }),

    step: one(appSteps, {
      fields: [appFields.stepId],
      references: [appSteps.id],
    }),

    fieldType: one(fieldTypes, {
      fields: [appFields.fieldTypeId],
      references: [fieldTypes.id],
    }),

    referenceApp: one(apps, {
      fields: [appFields.referenceAppId],
      references: [apps.id],
    }),

    referenceDisplayField: one(appFields, {
      fields: [appFields.referenceDisplayFieldId],
      references: [appFields.id],
    }),

    childReferenceFields: many(appFields),
  }),
);