// import {
//   BadRequestException,
//   Inject,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';

// import { desc, eq, and }
//   from 'drizzle-orm';

// import type { DbType }
//   from 'src/database/database.module';

// import {
//   appFields,
//   apps,
//   appSteps,
// } from 'src/database/schema';



// import { CreateAppFieldDto }
//   from './dto/create-app-field.dto';

// import { UpdateAppFieldDto }
//   from './dto/update-app-field.dto';

// @Injectable()
// export class AppFieldsService {

//   constructor(
//     @Inject('DB')
//     private readonly db: DbType,
//   ) { }

//   // CREATE
//   async create(
//     dto: CreateAppFieldDto,
//     userId?: number,
//   ) {
//     // Check App
//     const app =
//       await this.db.query.apps.findFirst({
//         where: eq(apps.id, dto.app_id),
//       });

//     if (!app) {
//       throw new NotFoundException(
//         'App not found',
//       );
//     }

//     // Check Step
//     const step =
//       await this.db.query.appSteps.findFirst({
//         where: eq(
//           appSteps.id,
//           dto.step_id,
//         ),
//       });

//     if (!step) {
//       throw new NotFoundException(
//         'Step not found',
//       );
//     }

//     // Check duplicate Label in same App + Step
//     const existingLabel =
//       await this.db.query.appFields.findFirst({
//         where: and(
//           eq(appFields.app_id, dto.app_id),
//           eq(appFields.step_id, dto.step_id),
//           eq(appFields.label, dto.label),
//         ),
//       });

//     if (existingLabel) {
//       throw new BadRequestException(
//         `A field named "${dto.label}" already exists in this step.`,
//       );
//     }

//     // Check duplicate Field Key in same App + Step
//     const existingFieldKey =
//       await this.db.query.appFields.findFirst({
//         where: and(
//           eq(appFields.app_id, dto.app_id),
//           eq(appFields.step_id, dto.step_id),
//           eq(appFields.field_key, dto.field_key),
//         ),
//       });

//     if (existingFieldKey) {
//       throw new BadRequestException(
//         'A field with the same key already exists in this step.',
//       );
//     }

//     // Validate Reference App
//     if (dto.reference_app_id) {
//       const referenceApp =
//         await this.db.query.apps.findFirst({
//           where: eq(
//             apps.id,
//             dto.reference_app_id,
//           ),
//         });

//       if (!referenceApp) {
//         throw new NotFoundException(
//           'Reference app not found',
//         );
//       }
//     }

//     // Validate Reference Display Field
//     if (dto.reference_display_field_id) {
//       const displayField =
//         await this.db.query.appFields.findFirst({
//           where: eq(
//             appFields.id,
//             dto.reference_display_field_id,
//           ),
//         });

//       if (!displayField) {
//         throw new NotFoundException(
//           'Reference display field not found',
//         );
//       }
//     }

//     const [field] =
//       await this.db
//         .insert(appFields)
//         .values({
//           app_id: dto.app_id,
//           step_id: dto.step_id,
//           label: dto.label,
//           field_key: dto.field_key,
//           field_type: dto.field_type,

//           reference_app_id:
//             dto.reference_app_id ?? null,

//           reference_display_field_id:
//             dto.reference_display_field_id ?? null,

//           placeholder:
//             dto.placeholder ?? null,

//           help_text:
//             dto.help_text ?? null,

//           default_value:
//             dto.default_value ?? null,

//           dropdown_options:
//             dto.dropdown_options ?? null,

//           validation_rules:
//             dto.validation_rules ?? null,

//           is_required:
//             dto.is_required ?? false,

//           is_unique:
//             dto.is_unique ?? false,

//           is_visible:
//             dto.is_visible ?? true,

//           is_editable:
//             dto.is_editable ?? true,

//           order_index:
//             dto.order_index ?? 0,

//           created_by: userId,

//           updated_by: userId,
//         })
//         .returning();

//     return field;
//   }

//   // GET ALL
//   async findAll() {

//     return await this.db.query.appFields.findMany({

//       with: {
//         step: true,
//         referenceApp: true,
//         referenceDisplayField: true,
//       },
//       orderBy: (appFields, { desc }) => [
//         desc(appFields.id),
//       ],
//     });
//   }

//   // GET APP FIELDS
//   async findByApp(appId: number) {

//     return await this.db.query.appFields.findMany({
//       where: eq(appFields.app_id, appId),

//       with: {
//         step: true,
//         referenceApp: true,
//         referenceDisplayField: true,
//       },

//       orderBy: (appFields, { asc }) => [
//         asc(appFields.order_index),
//       ],
//     });
//   }

//     async findByVersion(versionId: number) {

//     const steps = await this.db.query.appSteps.findMany({
//       where: eq(appSteps.version_id, versionId),
//     });

//     if (!steps.length) {
//       return [];
//     }

//     const stepIds = steps.map(step => step.id);

//     return await this.db.query.appFields.findMany({
//       where: (field, { inArray }) =>
//         inArray(field.step_id, stepIds),

//       with: {
//         step: true,
//         referenceApp: true,
//         referenceDisplayField: true,
//       },

//       orderBy: (field, { asc }) => [
//         asc(field.order_index),
//       ],
//     });
//   }

//   // GET ONE
//   async findOne(id: number) {

//     const field =
//       await this.db.query.appFields.
//         findFirst({
//           where: eq(appFields.id, id),

//           with: {
//             step: true,
//             referenceApp: true,
//             referenceDisplayField: true,
//           },
//         });

//     if (!field) {

//       throw new NotFoundException(
//         'Field not found',
//       );
//     }

//     return field;
//   }

//   // UPDATE
//   async update(
//     id: number,
//     dto: UpdateAppFieldDto,
//     userId?: number,
//   ) {

//     await this.findOne(id);

//     const [field] =
//       await this.db
//         .update(appFields)
//         .set({

//           label: dto.label,

//           field_key: dto.field_key,

//           field_type: dto.field_type,

//           reference_app_id:
//             dto.reference_app_id,

//           reference_display_field_id:
//             dto.reference_display_field_id,

//           placeholder:
//             dto.placeholder,

//           help_text:
//             dto.help_text,

//           default_value:
//             dto.default_value,

//           dropdown_options:
//             dto.dropdown_options,

//           validation_rules:
//             dto.validation_rules,

//           is_required:
//             dto.is_required,

//           is_unique:
//             dto.is_unique,

//           is_visible:
//             dto.is_visible,

//           is_editable:
//             dto.is_editable,

//           order_index:
//             dto.order_index,

//           updated_by: userId,

//           updated_at: new Date(),
//         })
//         .where(eq(appFields.id, id))
//         .returning();

//     return field;
//   }

//   // DELETE
//   async remove(id: number) {

//     await this.findOne(id);

//     await this.db
//       .delete(appFields)
//       .where(eq(appFields.id, id));

//     return true;
//   }



//   async findByStep(stepId: number) {
//     return await this.db.query.appFields.findMany({
//       where: eq(appFields.step_id, stepId),

//       with: {
//         referenceApp: true,
//         referenceDisplayField: true,
//       },

//       orderBy: (appFields, { asc }) => [
//         asc(appFields.order_index),
//       ],
//     });
//   }
// }



import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  and,
  eq,
} from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import {
  apps,
  appFields,
  appSteps,
  appVersions,
} from 'src/database/schema';

import { CreateAppFieldDto } from './dto/create-app-field.dto';
import { UpdateAppFieldDto } from './dto/update-app-field.dto';

@Injectable()
export class AppFieldsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async ensureStepVersionIsDraft(stepId: number) {
    const step =
      await this.db.query.appSteps.findFirst({
        where: eq(
          appSteps.id,
          stepId,
        ),
      });

    if (!step) {
      throw new NotFoundException(
        'Step not found',
      );
    }

    const version =
      await this.db.query.appVersions.findFirst({
        where: eq(
          appVersions.id,
          step.version_id,
        ),
      });

    if (!version) {
      throw new NotFoundException(
        'Version not found',
      );
    }

    if (version.is_published) {
      throw new BadRequestException(
        'Published version cannot be edited. Please create a new version.',
      );
    }

    return {
      step,
      version,
    };
  }

  async create(
    dto: CreateAppFieldDto,
    userId?: number,
  ) {
    const app =
      await this.db.query.apps.findFirst({
        where: eq(apps.id, dto.app_id),
      });

    if (!app) {
      throw new NotFoundException(
        'App not found',
      );
    }

    const { step, version } =
      await this.ensureStepVersionIsDraft(
        dto.step_id,
      );

    if (version.app_id !== dto.app_id) {
      throw new BadRequestException(
        'Step does not belong to this app.',
      );
    }

    const existingLabel =
      await this.db.query.appFields.findFirst({
        where: and(
          eq(appFields.app_id, dto.app_id),
          eq(appFields.step_id, dto.step_id),
          eq(appFields.label, dto.label),
        ),
      });

    if (existingLabel) {
      throw new BadRequestException(
        `A field named "${dto.label}" already exists in this step.`,
      );
    }

    const existingFieldKey =
      await this.db.query.appFields.findFirst({
        where: and(
          eq(appFields.app_id, dto.app_id),
          eq(appFields.step_id, dto.step_id),
          eq(appFields.field_key, dto.field_key),
        ),
      });

    if (existingFieldKey) {
      throw new BadRequestException(
        'A field with the same key already exists in this step.',
      );
    }

    if (dto.reference_app_id) {
      const referenceApp =
        await this.db.query.apps.findFirst({
          where: eq(
            apps.id,
            dto.reference_app_id,
          ),
        });

      if (!referenceApp) {
        throw new NotFoundException(
          'Reference app not found',
        );
      }
    }

    if (dto.reference_display_field_id) {
      const displayField =
        await this.db.query.appFields.findFirst({
          where: eq(
            appFields.id,
            dto.reference_display_field_id,
          ),
        });

      if (!displayField) {
        throw new NotFoundException(
          'Reference display field not found',
        );
      }
    }

    const [field] =
      await this.db
        .insert(appFields)
        .values({
          app_id: dto.app_id,
          step_id: dto.step_id,
          label: dto.label,
          field_key: dto.field_key,
          field_type: dto.field_type,

          reference_app_id:
            dto.reference_app_id ?? null,
          reference_display_field_id:
            dto.reference_display_field_id ?? null,

          placeholder:
            dto.placeholder ?? null,
          help_text:
            dto.help_text ?? null,
          default_value:
            dto.default_value ?? null,

          dropdown_options:
            dto.dropdown_options ?? null,
          validation_rules:
            dto.validation_rules ?? null,

          is_required:
            dto.is_required ?? false,
          is_unique:
            dto.is_unique ?? false,
          is_visible:
            dto.is_visible ?? true,
          is_editable:
            dto.is_editable ?? true,

          order_index:
            dto.order_index ?? 0,

          created_by:
            userId ?? null,
          updated_by:
            userId ?? null,
        })
        .returning();

    return field;
  }

  async findAll() {
    return await this.db.query.appFields.findMany({
      with: {
        step: true,
        referenceApp: true,
        referenceDisplayField: true,
      },
      orderBy: (
        appFields,
        { desc },
      ) => [
        desc(appFields.id),
      ],
    });
  }

  async findByApp(appId: number) {
    return await this.db.query.appFields.findMany({
      where: eq(appFields.app_id, appId),
      with: {
        step: true,
        referenceApp: true,
        referenceDisplayField: true,
      },
      orderBy: (
        appFields,
        { asc },
      ) => [
        asc(appFields.order_index),
      ],
    });
  }

  async findByVersion(versionId: number) {
    const steps =
      await this.db.query.appSteps.findMany({
        where: eq(
          appSteps.version_id,
          versionId,
        ),
      });

    if (!steps.length) {
      return [];
    }

    const stepIds =
      steps.map((step) => step.id);

    return await this.db.query.appFields.findMany({
      where: (
        field,
        { inArray },
      ) => inArray(field.step_id, stepIds),
      with: {
        step: true,
        referenceApp: true,
        referenceDisplayField: true,
      },
      orderBy: (
        field,
        { asc },
      ) => [
        asc(field.order_index),
      ],
    });
  }

  async findOne(id: number) {
    const field =
      await this.db.query.appFields.findFirst({
        where: eq(appFields.id, id),
        with: {
          step: true,
          referenceApp: true,
          referenceDisplayField: true,
        },
      });

    if (!field) {
      throw new NotFoundException(
        'Field not found',
      );
    }

    return field;
  }

  async update(
    id: number,
    dto: UpdateAppFieldDto,
    userId?: number,
  ) {
    const existingField =
      await this.findOne(id);

    await this.ensureStepVersionIsDraft(
      existingField.step_id,
    );

    const [field] =
      await this.db
        .update(appFields)
        .set({
          label:
            dto.label ??
            existingField.label,
          field_key:
            dto.field_key ??
            existingField.field_key,
          field_type:
            dto.field_type ??
            existingField.field_type,

          reference_app_id:
            dto.reference_app_id ??
            existingField.reference_app_id,
          reference_display_field_id:
            dto.reference_display_field_id ??
            existingField.reference_display_field_id,

          placeholder:
            dto.placeholder ??
            existingField.placeholder,
          help_text:
            dto.help_text ??
            existingField.help_text,
          default_value:
            dto.default_value ??
            existingField.default_value,

          dropdown_options:
            dto.dropdown_options ??
            existingField.dropdown_options,
          validation_rules:
            dto.validation_rules ??
            existingField.validation_rules,

          is_required:
            dto.is_required ??
            existingField.is_required,
          is_unique:
            dto.is_unique ??
            existingField.is_unique,
          is_visible:
            dto.is_visible ??
            existingField.is_visible,
          is_editable:
            dto.is_editable ??
            existingField.is_editable,

          order_index:
            dto.order_index ??
            existingField.order_index,

          updated_by:
            userId ?? null,
          updated_at:
            new Date(),
        })
        .where(eq(appFields.id, id))
        .returning();

    return field;
  }

  async remove(id: number) {
    const existingField =
      await this.findOne(id);

    await this.ensureStepVersionIsDraft(
      existingField.step_id,
    );

    await this.db
      .delete(appFields)
      .where(eq(appFields.id, id));

    return true;
  }

  async findByStep(stepId: number) {
    return await this.db.query.appFields.findMany({
      where: eq(appFields.step_id, stepId),
      with: {
        referenceApp: true,
        referenceDisplayField: true,
      },
      orderBy: (
        appFields,
        { asc },
      ) => [
        asc(appFields.order_index),
      ],
    });
  }
}