// import {
//   BadRequestException,
//   Inject,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';

// import { eq } from 'drizzle-orm';

// import type { DbType } from 'src/database/database.module';

// import {
//   appSteps,
//   appVersions,
// } from 'src/database/schema';

// import { CreateAppStepDto } from './dto/create-app-step.dto';
// import { UpdateAppStepDto } from './dto/update-app-step.dto';

// @Injectable()
// export class AppStepsService {
//   constructor(
//     @Inject('DB')
//     private readonly db: DbType,
//   ) {}

//   async create(
//     dto: CreateAppStepDto,
//     userId?: number,
//   ) {
//     const version =
//       await this.db.query.appVersions.findFirst({
//         where: eq(
//           appVersions.id,
//           dto.version_id,
//         ),
//         with: {
//           app: {
//             with: {
//               appType: true,
//             },
//           },
//         },
//       });

//     if (!version) {
//       throw new NotFoundException(
//         'Version not found',
//       );
//     }

//     if (version?.app?.appType?.code === 'master' && dto.step_type !== 'form') {
//       throw new BadRequestException(
//         'Master Apps can only contain Form steps.',
//       );
//     }

//     const [step] =
//       await this.db
//         .insert(appSteps)
//         .values({
//           version_id: dto.version_id,
//           name: dto.name,
//           description: dto.description ?? null,
//           step_type: dto.step_type,
//           order_index: dto.order_index ?? 1,
//           is_required: dto.is_required ?? true,
//           created_by: userId,
//           updated_by: userId,
//         })
//         .returning();

//     return step;
//   }

//   async findAll() {
//     return await this.db.query.appSteps.findMany({
//       with: {
//         version: true,
//       },
//       orderBy: (appSteps, { asc }) => [
//         asc(appSteps.order_index),
//       ],
//     });
//   }

//   async findByVersion(versionId: number) {
//     return await this.db.query.appSteps.findMany({
//       where: eq(
//         appSteps.version_id,
//         versionId,
//       ),
//       orderBy: (appSteps, { asc }) => [
//         asc(appSteps.order_index),
//       ],
//     });
//   }

//   async findOne(id: number) {
//     const step =
//       await this.db.query.appSteps.findFirst({
//         where: eq(appSteps.id, id),
//         with: {
//           version: true,
//           fields: true,
//           approvers: true,
//           discussions: true,
//         },
//       });

//     if (!step) {
//       throw new NotFoundException(
//         'Step not found',
//       );
//     }

//     return step;
//   }

//   async update(
//     id: number,
//     dto: UpdateAppStepDto,
//     userId?: number,
//   ) {
//     await this.findOne(id);

//     const [step] =
//       await this.db
//         .update(appSteps)
//         .set({
//           ...dto,
//           updated_by: userId,
//           updated_at: new Date(),
//         })
//         .where(eq(appSteps.id, id))
//         .returning();

//     return step;
//   }

//   async remove(id: number) {
//     await this.findOne(id);

//     await this.db
//       .delete(appSteps)
//       .where(eq(appSteps.id, id));

//     return true;
//   }
// }



import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { eq } from 'drizzle-orm';



import {
  appSteps,
  appVersions,
} from 'src/database/schema';

import { CreateAppStepDto } from './dto/create-app-step.dto';
import { UpdateAppStepDto } from './dto/update-app-step.dto';
import type { DbType } from 'src/database/database.module';

@Injectable()
export class AppStepsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async ensureDraftVersion(versionId: number) {
    const version =
      await this.db.query.appVersions.findFirst({
        where: eq(
          appVersions.id,
          versionId,
        ),
        with: {
          app: {
            with: {
              appType: true,
            },
          },
        },
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

  async create(
    dto: CreateAppStepDto,
    userId?: number,
  ) {
    const version =
      await this.ensureDraftVersion(
        dto.version_id,
      );

    if (
      version?.app?.appType?.code === 'master' &&
      dto.step_type !== 'form'
    ) {
      throw new BadRequestException(
        'Master Apps can only contain Form steps.',
      );
    }

    const [step] =
      await this.db
        .insert(appSteps)
        .values({
          version_id: dto.version_id,
          name: dto.name,
          description:
            dto.description ?? null,
          step_type: dto.step_type,
          order_index:
            dto.order_index ?? 1,
          is_required:
            dto.is_required ?? true,
          created_by:
            userId ?? null,
          updated_by:
            userId ?? null,
        })
        .returning();

    return step;
  }

  async findAll() {
    return await this.db.query.appSteps.findMany({
      with: {
        version: true,
      },
      orderBy: (
        appSteps,
        { asc },
      ) => [
        asc(appSteps.order_index),
      ],
    });
  }

  async findByVersion(versionId: number) {
    return await this.db.query.appSteps.findMany({
      where: eq(
        appSteps.version_id,
        versionId,
      ),
      orderBy: (
        appSteps,
        { asc },
      ) => [
        asc(appSteps.order_index),
      ],
    });
  }

  async findOne(id: number) {
    const step =
      await this.db.query.appSteps.findFirst({
        where: eq(appSteps.id, id),
        with: {
          version: true,
          fields: true,
          approvers: true,
          discussions: true,
        },
      });

    if (!step) {
      throw new NotFoundException(
        'Step not found',
      );
    }

    return step;
  }

  async update(
    id: number,
    dto: UpdateAppStepDto,
    userId?: number,
  ) {
    const existingStep =
      await this.findOne(id);

    await this.ensureDraftVersion(
      existingStep.version_id,
    );

    const [step] =
      await this.db
        .update(appSteps)
        .set({
          name:
            dto.name ??
            existingStep.name,
          description:
            dto.description ??
            existingStep.description,
          step_type:
            dto.step_type ??
            existingStep.step_type,
          order_index:
            dto.order_index ??
            existingStep.order_index,
          is_required:
            dto.is_required ??
            existingStep.is_required,
          updated_by:
            userId ?? null,
          updated_at:
            new Date(),
        })
        .where(eq(appSteps.id, id))
        .returning();

    return step;
  }

  async remove(id: number) {
    const existingStep =
      await this.findOne(id);

    await this.ensureDraftVersion(
      existingStep.version_id,
    );

    await this.db
      .delete(appSteps)
      .where(eq(appSteps.id, id));

    return true;
  }
}