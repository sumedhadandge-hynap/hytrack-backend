// import {
//   BadRequestException,
//   Inject,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';

// import { desc, eq }
//   from 'drizzle-orm';

// import type { DbType }
//   from 'src/database/database.module';

// import {
//   apps,
//   appSteps,
//   appVersions,
//   appFields,
//   stepApprovers,
//   stepDiscussions,
// } from 'src/database/schema';

// import { CreateAppVersionDto }
//   from './dto/create-app-version.dto';

// import { UpdateAppVersionDto }
//   from './dto/update-app-version.dto';

// @Injectable()
// export class AppVersionsService {

//   constructor(
//     @Inject('DB')
//     private readonly db: DbType,
//   ) { }

//   // CREATE VERSION
//   async create(
//     dto: CreateAppVersionDto,
//     userId?: number,
//   ) {

//     const app =
//       await this.db.query.apps.findFirst({
//         where: eq(
//           apps.id,
//           dto.app_id,
//         ),
//       });

//     if (!app) {
//       throw new NotFoundException(
//         'App not found',
//       );
//     }

//     const latestVersion =
//       await this.db.query.appVersions.findFirst({
//         where: eq(appVersions.app_id, dto.app_id),
//         orderBy: (appVersions, { desc }) => [
//           desc(appVersions.version_number),
//         ],
//       });

//     const [result] =
//       await this.db
//         .insert(appVersions)
//         .values({
//           app_id: dto.app_id,
//           version_number:
//             dto.version_number ?? 1,
//           version_name:
//             dto.version_name,
//           notes:
//             dto.notes ?? null,
//           created_by:
//             userId ?? null,
//           updated_by:
//             userId ?? null,
//         })
//         .returning();

//     if (latestVersion) {
//       const oldSteps = await this.db.query.appSteps.findMany({
//         where: eq(appSteps.version_id, latestVersion.id),
//       });

//       // Sort by order_index to preserve the step order
//       oldSteps.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

//       for (const oldStep of oldSteps) {
//         const [newStep] = await this.db
//           .insert(appSteps)
//           .values({
//             name: oldStep.name,
//             description: oldStep.description,
//             step_type: oldStep.step_type,
//             order_index: oldStep.order_index,
//             is_required: oldStep.is_required,
//             version_id: result.id,
//             created_by: userId ?? null,
//             updated_by: userId ?? null,
//           })
//           .returning();

//         const type = String(oldStep.step_type).toLowerCase();
//         if (type === 'form') {
//           const oldFields = await this.db.query.appFields.findMany({
//             where: eq(appFields.step_id, oldStep.id),
//           });
//           for (const oldField of oldFields) {
//             await this.db.insert(appFields).values({
//               app_id: oldField.app_id,
//               step_id: newStep.id,
//               label: oldField.label,
//               field_key: oldField.field_key,
//               field_type: oldField.field_type,
//               placeholder: oldField.placeholder,
//               help_text: oldField.help_text,
//               default_value: oldField.default_value,
//               dropdown_options: oldField.dropdown_options,
//               validation_rules: oldField.validation_rules,
//               is_required: oldField.is_required,
//               is_unique: oldField.is_unique,
//               is_visible: oldField.is_visible,
//               is_editable: oldField.is_editable,
//               order_index: oldField.order_index,
//               created_by: userId ?? null,
//               updated_by: userId ?? null,
//             });
//           }
//         } else if (type === 'approval') {
//           const oldApprovers = await this.db.query.stepApprovers.findMany({
//             where: eq(stepApprovers.step_id, oldStep.id),
//           });
//           for (const oldApprover of oldApprovers) {
//             await this.db.insert(stepApprovers).values({
//               step_id: newStep.id,
//               role_id: oldApprover.role_id,
//               user_id: oldApprover.user_id,
//               approval_type: oldApprover.approval_type,
//               rejection_action: oldApprover.rejection_action,
//               order_index: oldApprover.order_index,
//               created_by: userId ?? null,
//               updated_by: userId ?? null,
//             });
//           }
//         } else if (type === 'discussion') {
//           const oldDiscussions = await this.db.query.stepDiscussions.findMany({
//             where: eq(stepDiscussions.step_id, oldStep.id),
//           });
//           for (const oldDiscussion of oldDiscussions) {
//             await this.db.insert(stepDiscussions).values({
//               step_id: newStep.id,
//               role_id: oldDiscussion.role_id,
//               user_id: oldDiscussion.user_id,
//               created_by: userId ?? null,
//               updated_by: userId ?? null,
//             });
//           }
//         }
//       }
//     }

//     return result;
//   }
//   // GET ALL
//   async findAll() {

//     return await this.db.query.appVersions.findMany({

//       with: {
//         app: true,
//       },

//       orderBy: (
//         appVersions,
//         { desc },
//       ) => [
//           desc(appVersions.id),
//         ],
//     });
//   }

//   // GET BY APP
//   async findByApp(appId: number) {

//     return await this.db.query.appVersions.findMany({

//       where: eq(
//         appVersions.app_id,
//         appId,
//       ),

//       orderBy: (
//         appVersions,
//         { desc },
//       ) => [
//           desc(
//             appVersions.version_number,
//           ),
//         ],
//     });
//   }



//   // GET ONE
//   async findOne(id: number) {

//     const version =
//       await this.db.query.appVersions.findFirst({

//         where: eq(
//           appVersions.id,
//           id,
//         ),

//         with: {
//           app: true,
//         },
//       });

//     if (!version) {

//       throw new NotFoundException(
//         'Version not found',
//       );
//     }

//     return version;
//   }

//   // UPDATE
//   async update(
//     id: number,
//     dto: UpdateAppVersionDto,
//     userId?: number,
//   ) {

//     await this.findOne(id);

//     const [result] =
//       await this.db
//         .update(appVersions)
//         .set({

//           ...dto,

//           updated_by:
//             userId ?? null,

//           updated_at:
//             new Date(),
//         })
//         .where(
//           eq(appVersions.id, id),
//         )
//         .returning();

//     return result;
//   }

//   // PUBLISH VERSION
//   async publish(
//     id: number,
//     userId?: number,
//   ) {

//     const version =
//       await this.findOne(id);

//     if (!version) {
//       throw new NotFoundException(
//         'Version not found',
//       );
//     }

//     const app =
//       await this.db.query.apps.findFirst({
//         where: eq(
//           apps.id,
//           version.app_id,
//         ),
//       });

//     if (!app) {
//       throw new NotFoundException(
//         'App not found',
//       );
//     }

//     const [updatedVersion] =
//       await this.db
//         .update(appVersions)
//         .set({
//           is_published: true,
//           updated_by: userId ?? null,
//           updated_at: new Date(),
//         })
//         .where(eq(appVersions.id, id))
//         .returning();

//     await this.db
//       .update(apps)
//       .set({
//         // is_published: true,
//         updated_by: userId ?? null,
//         updated_at: new Date(),
//       })
//       .where(eq(apps.id, version.app_id));

//     return updatedVersion;
//   }

//   // DELETE
//   async remove(id: number) {

//     await this.findOne(id);

//     await this.db
//       .delete(appVersions)
//       .where(
//         eq(appVersions.id, id),
//       );

//     return true;
//   }

//   async getFullVersion(id: number) {

//     const version =
//       await this.db.query.appVersions.findFirst({

//         where: eq(
//           appVersions.id,
//           id,
//         ),

//         with: {
//           app: true,
//         },
//       });

//     if (!version) {

//       throw new NotFoundException(
//         'Version not found',
//       );
//     }

//     const steps =
//       await this.db.query.appSteps.findMany({

//         where: eq(
//           appSteps.version_id,
//           id,
//         ),

//         with: {

//           fields: true,

//           approvers: true,

//           discussions: true,
//         },
//       });

//     return {
//       version,
//       steps,
//     };
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
  appVersions,
  appSteps,
  appFields,
  stepApprovers,
  stepDiscussions,
  appRecords,
} from 'src/database/schema';

import { CreateAppVersionDto } from './dto/create-app-version.dto';
import { UpdateAppVersionDto } from './dto/update-app-version.dto';

@Injectable()
export class AppVersionsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async getLatestVersion(appId: number) {
    const latestVersion =
      await this.db.query.appVersions.findFirst({
        where: eq(appVersions.app_id, appId),
        orderBy: (
          appVersions,
          { desc },
        ) => [
          desc(appVersions.version_number),
        ],
      });

    if (!latestVersion) {
      throw new NotFoundException(
        'No version found for this app',
      );
    }

    return latestVersion;
  }

  async getLatestPublishedVersion(appId: number) {
    const latestVersion =
      await this.db.query.appVersions.findFirst({
        where: and(
          eq(appVersions.app_id, appId),
          eq(appVersions.is_published, true),
        ),
        orderBy: (
          appVersions,
          { desc },
        ) => [
          desc(appVersions.version_number),
        ],
      });

    if (!latestVersion) {
      throw new BadRequestException(
        'No published version found for this app',
      );
    }

    return latestVersion;
  }

  async ensureDraftVersion(versionId: number) {
    const version =
      await this.db.query.appVersions.findFirst({
        where: eq(appVersions.id, versionId),
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

    return version;
  }

  // CREATE NEW VERSION
  async create(
    dto: CreateAppVersionDto,
    userId?: number,
  ) {
    const app =
      await this.db.query.apps.findFirst({
        where: eq(
          apps.id,
          dto.app_id,
        ),
      });

    if (!app) {
      throw new NotFoundException(
        'App not found',
      );
    }

    const latestVersion =
      await this.getLatestVersion(dto.app_id);

    if (!latestVersion.is_published) {
      throw new BadRequestException(
        'Current latest version is still draft. Please edit/publish it before creating a new version.',
      );
    }

    const newVersionNumber =
      (latestVersion.version_number ?? 1) + 1;

    const result =
      await this.db.transaction(async (tx) => {
        const [newVersion] =
          await tx
            .insert(appVersions)
            .values({
              app_id: dto.app_id,
              version_number: newVersionNumber,
              version_name:
                dto.version_name ??
                `Version ${newVersionNumber}`,
              notes:
                dto.notes ??
                `Copied from ${latestVersion.version_name}`,
              is_published: false,
              created_by:
                userId ?? null,
              updated_by:
                userId ?? null,
            })
            .returning();

        const oldSteps =
          await tx.query.appSteps.findMany({
            where: eq(
              appSteps.version_id,
              latestVersion.id,
            ),
            orderBy: (
              appSteps,
              { asc },
            ) => [
              asc(appSteps.order_index),
            ],
          });

        for (const oldStep of oldSteps) {
          const [newStep] =
            await tx
              .insert(appSteps)
              .values({
                name: oldStep.name,
                description:
                  oldStep.description,
                step_type:
                  oldStep.step_type,
                order_index:
                  oldStep.order_index,
                is_required:
                  oldStep.is_required,
                version_id:
                  newVersion.id,
                created_by:
                  userId ?? null,
                updated_by:
                  userId ?? null,
              })
              .returning();

          const type = String(
            oldStep.step_type,
          ).toLowerCase();

          if (type === 'form') {
            const oldFields =
              await tx.query.appFields.findMany({
                where: eq(
                  appFields.step_id,
                  oldStep.id,
                ),
                orderBy: (
                  appFields,
                  { asc },
                ) => [
                  asc(appFields.order_index),
                ],
              });

            if (oldFields.length) {
              await tx
                .insert(appFields)
                .values(
                  oldFields.map((oldField) => ({
                    app_id: oldField.app_id,
                    step_id: newStep.id,

                    label: oldField.label,
                    field_key:
                      oldField.field_key,
                    field_type:
                      oldField.field_type,

                    reference_app_id:
                      oldField.reference_app_id,
                    reference_display_field_id:
                      oldField.reference_display_field_id,

                    placeholder:
                      oldField.placeholder,
                    help_text:
                      oldField.help_text,
                    default_value:
                      oldField.default_value,
                    dropdown_options:
                      oldField.dropdown_options,
                    validation_rules:
                      oldField.validation_rules,

                    is_required:
                      oldField.is_required,
                    is_unique:
                      oldField.is_unique,
                    is_visible:
                      oldField.is_visible,
                    is_editable:
                      oldField.is_editable,

                    order_index:
                      oldField.order_index,

                    created_by:
                      userId ?? null,
                    updated_by:
                      userId ?? null,
                  })),
                );
            }
          }

          if (type === 'approval') {
            const oldApprovers =
              await tx.query.stepApprovers.findMany({
                where: eq(
                  stepApprovers.step_id,
                  oldStep.id,
                ),
              });

            if (oldApprovers.length) {
              await tx
                .insert(stepApprovers)
                .values(
                  oldApprovers.map(
                    (oldApprover) => ({
                      step_id: newStep.id,
                      role_id:
                        oldApprover.role_id,
                      user_id:
                        oldApprover.user_id,
                      approval_type:
                        oldApprover.approval_type,
                      rejection_action:
                        oldApprover.rejection_action,
                      order_index:
                        oldApprover.order_index,
                      created_by:
                        userId ?? null,
                      updated_by:
                        userId ?? null,
                    }),
                  ),
                );
            }
          }

          if (type === 'discussion') {
            const oldDiscussions =
              await tx.query.stepDiscussions.findMany({
                where: eq(
                  stepDiscussions.step_id,
                  oldStep.id,
                ),
              });

            if (oldDiscussions.length) {
              await tx
                .insert(stepDiscussions)
                .values(
                  oldDiscussions.map(
                    (oldDiscussion) => ({
                      step_id: newStep.id,
                      role_id:
                        oldDiscussion.role_id,
                      user_id:
                        oldDiscussion.user_id,
                      created_by:
                        userId ?? null,
                      updated_by:
                        userId ?? null,
                    }),
                  ),
                );
            }
          }
        }

        return newVersion;
      });

    return result;
  }

  async findAll() {
    return await this.db.query.appVersions.findMany({
      with: {
        app: true,
      },
      orderBy: (
        appVersions,
        { desc },
      ) => [
        desc(appVersions.id),
      ],
    });
  }

  async findByApp(appId: number) {
    return await this.db.query.appVersions.findMany({
      where: eq(
        appVersions.app_id,
        appId,
      ),
      orderBy: (
        appVersions,
        { desc },
      ) => [
        desc(appVersions.version_number),
      ],
    });
  }

  async findOne(id: number) {
    const version =
      await this.db.query.appVersions.findFirst({
        where: eq(
          appVersions.id,
          id,
        ),
        with: {
          app: true,
        },
      });

    if (!version) {
      throw new NotFoundException(
        'Version not found',
      );
    }

    return version;
  }

  async update(
    id: number,
    dto: UpdateAppVersionDto,
    userId?: number,
  ) {
    const version =
      await this.ensureDraftVersion(id);

    const [result] =
      await this.db
        .update(appVersions)
        .set({
          version_name:
            dto.version_name ??
            version.version_name,
          notes:
            dto.notes ??
            version.notes,
          updated_by:
            userId ?? null,
          updated_at:
            new Date(),
        })
        .where(
          eq(appVersions.id, id),
        )
        .returning();

    return result;
  }

  async publish(
    id: number,
    userId?: number,
  ) {
    const version =
      await this.findOne(id);

    const steps =
      await this.db.query.appSteps.findMany({
        where: eq(
          appSteps.version_id,
          id,
        ),
      });

    if (!steps.length) {
      throw new BadRequestException(
        'Cannot publish version without steps.',
      );
    }

    const [updatedVersion] =
      await this.db
        .update(appVersions)
        .set({
          is_published: true,
          updated_by:
            userId ?? null,
          updated_at:
            new Date(),
        })
        .where(eq(appVersions.id, id))
        .returning();

    await this.db
      .update(apps)
      .set({
        updated_by:
          userId ?? null,
        updated_at:
          new Date(),
      })
      .where(eq(apps.id, version.app_id));

    return updatedVersion;
  }

  async remove(id: number) {
    const version =
      await this.findOne(id);

    if (version.is_published) {
      throw new BadRequestException(
        'Published version cannot be deleted.',
      );
    }

    const recordExists =
      await this.db.query.appRecords.findFirst({
        where: eq(
          appRecords.version_id,
          id,
        ),
      });

    if (recordExists) {
      throw new BadRequestException(
        'This version has records and cannot be deleted.',
      );
    }

    await this.db
      .delete(appVersions)
      .where(
        eq(appVersions.id, id),
      );

    return true;
  }

  async getFullVersion(id: number) {
    const version =
      await this.db.query.appVersions.findFirst({
        where: eq(
          appVersions.id,
          id,
        ),
        with: {
          app: true,
        },
      });

    if (!version) {
      throw new NotFoundException(
        'Version not found',
      );
    }

    const steps =
      await this.db.query.appSteps.findMany({
        where: eq(
          appSteps.version_id,
          id,
        ),
        with: {
          fields: true,
          approvers: true,
          discussions: true,
        },
        orderBy: (
          appSteps,
          { asc },
        ) => [
          asc(appSteps.order_index),
        ],
      });

    return {
      version,
      steps,
    };
  }
}