// import {
//   BadRequestException,
//   ConflictException,
//   Inject,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';

// import { and, eq, desc } from 'drizzle-orm';

// import type { DbType } from 'src/database/database.module';

// import {
//   apps,
//   appRecords,
//   appSteps,
//   projects,
//   appVersions,
// } from 'src/database/schema';

// import { CreateAppRecordDto } from './dto/create-app-record.dto';

// @Injectable()
// export class AppRecordsService {
//   constructor(
//     @Inject('DB')
//     private readonly db: DbType,
//   ) {}

//   async create(dto: CreateAppRecordDto, userId?: number) {
//     // ------------------------------------------------
//     // Validate App
//     // ------------------------------------------------

//     const app = await this.db.query.apps.findFirst({
//       where: eq(apps.id, dto.app_id),
//     });

//     if (!app) {
//       throw new NotFoundException('App not found');
//     }

//     // ------------------------------------------------
//     // Validate Version
//     // ------------------------------------------------

//     const version = await this.db.query.appVersions.findFirst({
//       where: eq(appVersions.id, dto.version_id),
//     });

//     if (!version) {
//       throw new NotFoundException('App version not found');
//     }

//     // ------------------------------------------------
//     // Version must belong to App
//     // ------------------------------------------------

//     if (version.app_id !== dto.app_id) {
//       throw new BadRequestException(
//         'Selected version does not belong to this app.',
//       );
//     }

//     // ------------------------------------------------
//     // Version must be published
//     // ------------------------------------------------

//     if (!version.is_published) {
//       throw new BadRequestException('Version is not published.');
//     }

//     // ------------------------------------------------
//     // Validate Project
//     // ------------------------------------------------

//     if (dto.project_id) {
//       const project = await this.db.query.projects.findFirst({
//         where: eq(projects.id, dto.project_id),
//       });

//       if (!project) {
//         throw new NotFoundException('Project not found.');
//       }
//     }

//     // ------------------------------------------------
//     // Version should contain Steps
//     // ------------------------------------------------

//     const steps = await this.db.query.appSteps.findMany({
//       where: eq(appSteps.version_id, dto.version_id),
//     });

//     if (!steps.length) {
//       throw new BadRequestException('This version has no configured steps.');
//     }

//     // ------------------------------------------------
//     // Version should contain Fields
//     // ------------------------------------------------

//     const stepIds = steps.map((s) => s.id);

//     const fields = await this.db.query.appFields.findMany({
//       where: (field, { inArray }) => inArray(field.step_id, stepIds),
//     });

//     if (!fields.length) {
//       throw new BadRequestException('This version has no configured fields.');
//     }

//     // ------------------------------------------------
//     // Prevent Duplicate Draft
//     // ------------------------------------------------

//     const conditions = [
//       eq(appRecords.app_id, dto.app_id),
//       eq(appRecords.version_id, dto.version_id),
//       eq(appRecords.status, 'draft'),
//     ];

//     if (dto.project_id) {
//       conditions.push(eq(appRecords.project_id, dto.project_id));
//     }

//     const existing = await this.db.query.appRecords.findFirst({
//       where: and(...conditions),
//     });
//     if (existing) {
//       throw new ConflictException(
//         'A draft record already exists for this app version.',
//       );
//     }

//     // ------------------------------------------------
//     // Create Record
//     // ------------------------------------------------

//     const [record] = await this.db
//       .insert(appRecords)
//       .values({
//         app_id: dto.app_id,

//         version_id: dto.version_id,

//         project_id: dto.project_id ?? null,

//         status: dto.status ?? 'draft',

//         created_by: userId ?? null,

//         updated_by: userId ?? null,
//       })
//       .returning();

//     return record;
//   }

// async findByApp(
//   appId: number,
//   versionId: number,
// ) {
//   const records =
//     await this.db.query.appRecords.findMany({
//       where: and(
//         eq(appRecords.app_id, appId),
//         eq(appRecords.version_id, versionId),
//       ),

//       with: {
//         values: true,
//       },

//       orderBy: (appRecords, { desc }) => [
//         desc(appRecords.id),
//       ],
//     });

//   return records.map((r) => ({
//     ...r,
//     display_value:
//       r.values
//         ?.map((v: any) => v.value)
//         .filter(Boolean)
//         .join(', ') ||
//       `Record #${r.id}`,
//   }));
// }

//   async findOne(id: number) {
//     const record = await this.db.query.appRecords.findFirst({
//       where: eq(appRecords.id, id),

//       with: {
//         values: true,
//         version: true,
//       },
//     });

//     if (!record) {
//       throw new NotFoundException('Record not found');
//     }

//     return record;
//   }
// }

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq, inArray } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import {
  apps,
  appVersions,
  appSteps,
  appFields,
  appRecords,
  appRecordValues,
  projects,
  appInstallations,
} from 'src/database/schema';

import { CreateAppRecordDto } from './dto/create-app-record.dto';

@Injectable()
export class AppRecordsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async getLatestPublishedVersion(appId: number) {
    const version = await this.db.query.appVersions.findFirst({
      where: and(
        eq(appVersions.app_id, appId),
        eq(appVersions.is_published, true),
      ),
      orderBy: (appVersions, { desc }) => [desc(appVersions.version_number)],
    });

    if (!version) {
      throw new BadRequestException('No published version found for this app.');
    }

    return version;
  }

  async getVersionStepsAndFields(versionId: number) {
    const steps = await this.db.query.appSteps.findMany({
      where: eq(appSteps.version_id, versionId),
      orderBy: (appSteps, { asc }) => [asc(appSteps.order_index)],
    });

    const stepIds = steps.map((step) => step.id);

    const fields = stepIds.length
      ? await this.db.query.appFields.findMany({
          where: inArray(appFields.step_id, stepIds),
          orderBy: (appFields, { asc }) => [asc(appFields.order_index)],
        })
      : [];

    return {
      steps,
      fields,
    };
  }

  // This API is used by frontend before creating record
  async getRecordSchema(appId: number, companyId?: number, projectId?: number) {
    const { app, installation, version } =
      await this.getInstalledVersionForRecord(appId, companyId, projectId);

    const { steps, fields } = await this.getVersionStepsAndFields(version.id);

    return {
      app_id: app.id,
      app_name: app.name,
      app_code: app.code,

      installed_version_id: version.id,
      installed_version_name: version.version_name,
      installed_version_number: version.version_number,

      installation_id: installation.id,

      steps: steps.map((step) => ({
        ...step,
        fields: fields.filter((field) => field.step_id === step.id),
      })),
    };
  }

async create(dto: CreateAppRecordDto, userId?: number) {
  const { app, installation, version } =
    await this.getInstalledVersionForRecord(
      dto.app_id,
      dto.company_id,
      dto.project_id,
    );

  const { steps, fields } =
    await this.getVersionStepsAndFields(version.id);

  if (!steps.length) {
    throw new BadRequestException(
      'This installed version has no configured steps.',
    );
  }

  if (!fields.length) {
    throw new BadRequestException(
      'This installed version has no configured fields.',
    );
  }

  const normalizedValues =
    dto.values?.map((item) => {
      if (item.field_id) {
        const field = fields.find(
          (f) => f.id === item.field_id,
        );

        if (!field) {
          throw new BadRequestException({
            message:
              'One or more fields do not belong to the installed version.',
            invalidField: item,
            installedVersion: {
              id: version.id,
              version_name: version.version_name,
              version_number: version.version_number,
            },
            validFields: fields.map((field) => ({
              id: field.id,
              label: field.label,
              field_key: field.field_key,
            })),
          });
        }

        return {
          field_id: field.id,
          value: item.value,
        };
      }

      if (item.field_key) {
        const field = fields.find(
          (f) => f.field_key === item.field_key,
        );

        if (!field) {
          throw new BadRequestException({
            message:
              'One or more field keys do not belong to the installed version.',
            invalidField: item,
            installedVersion: {
              id: version.id,
              version_name: version.version_name,
              version_number: version.version_number,
            },
            validFields: fields.map((field) => ({
              id: field.id,
              label: field.label,
              field_key: field.field_key,
            })),
          });
        }

        return {
          field_id: field.id,
          value: item.value,
        };
      }

      throw new BadRequestException(
        'Each value must have either field_id or field_key.',
      );
    }) ?? [];

  const isMasterApp = app.appType?.code === 'master';

  if (!isMasterApp && dto.project_id) {
    const existingDraft =
      await this.db.query.appRecords.findFirst({
        where: and(
          eq(appRecords.app_id, dto.app_id),
          eq(appRecords.version_id, version.id),
          eq(appRecords.project_id, dto.project_id),
          eq(appRecords.status, 'draft'),
        ),
      });

    if (existingDraft) {
      throw new ConflictException(
        'A draft record already exists for this app installed version in this project.',
      );
    }
  }

  const result =
    await this.db.transaction(async (tx) => {
      const [record] =
        await tx
          .insert(appRecords)
          .values({
            app_id: dto.app_id,

            // Important:
            // record is created against installed version,
            // not latest published version.
            version_id: version.id,

            company_id: dto.company_id ?? null,
            project_id: dto.project_id ?? null,

            status: dto.status ?? 'draft',

            created_by: userId ?? null,
            updated_by: userId ?? null,
          })
          .returning();

      if (normalizedValues.length) {
        await tx
          .insert(appRecordValues)
          .values(
            normalizedValues.map((item) => ({
              record_id: record.id,
              field_id: item.field_id,
              value: item.value,
            })),
          );
      }

      return record;
    });

  return {
    ...result,
    installation_id: installation.id,
    version: {
      id: version.id,
      version_name: version.version_name,
      version_number: version.version_number,
    },
  };
}

  async findByApp(appId: number, versionId?: number) {
    const app = await this.db.query.apps.findFirst({
      where: eq(apps.id, appId),
    });

    if (!app) {
      throw new NotFoundException('App not found');
    }

    const conditions = [eq(appRecords.app_id, appId)];

    if (versionId) {
      conditions.push(eq(appRecords.version_id, versionId));
    }

    const records = await this.db.query.appRecords.findMany({
      where: and(...conditions),
      with: {
        values: true,
        version: true,
      },
      orderBy: (appRecords, { desc }) => [desc(appRecords.id)],
    });

    return records.map((record) => ({
      ...record,
      version_name: record.version?.version_name,
      version_number: record.version?.version_number,
      display_value:
        record.values
          ?.map((value: any) => value.value)
          .filter(Boolean)
          .join(', ') || `Record #${record.id}`,
    }));
  }

  async findOne(id: number) {
    const record = await this.db.query.appRecords.findFirst({
      where: eq(appRecords.id, id),
      with: {
        values: true,
        version: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const { steps, fields } = await this.getVersionStepsAndFields(
      record.version_id,
    );

    return {
      record,
      version: record.version,
      steps: steps.map((step) => ({
        ...step,
        fields: fields
          .filter((field) => field.step_id === step.id)
          .map((field) => ({
            ...field,
            value:
              record.values?.find((value: any) => value.field_id === field.id)
                ?.value ?? null,
          })),
      })),
    };
  }

  async getInstalledVersionForRecord(
    appId: number,
    companyId?: number,
    projectId?: number,
  ) {
    const app = await this.db.query.apps.findFirst({
      where: eq(apps.id, appId),
      with: {
        appType: true,
      },
    });

    if (!app) {
      throw new NotFoundException('App not found');
    }

    const appTypeCode = app.appType?.code;

    if (appTypeCode === 'master') {
      const scopeType = companyId ? 'company' : 'global';

      const scopeId = companyId ?? 0;

      const installation = await this.db.query.appInstallations.findFirst({
        where: and(
          eq(appInstallations.app_id, appId),
          eq(appInstallations.install_type, 'master'),
          eq(appInstallations.scope_type, scopeType),
          eq(appInstallations.scope_id, scopeId),
          eq(appInstallations.is_active, true),
        ),
      });

      if (!installation) {
        throw new BadRequestException(
          'Master app is not installed. Please install it first.',
        );
      }

      const version = await this.db.query.appVersions.findFirst({
        where: eq(appVersions.id, installation.version_id),
      });

      if (!version) {
        throw new NotFoundException('Installed version not found.');
      }

      return {
        app,
        installation,
        version,
      };
    }

    if (appTypeCode === 'standard') {
      if (!projectId) {
        throw new BadRequestException(
          'project_id is required for standard app records.',
        );
      }

      const installation = await this.db.query.appInstallations.findFirst({
        where: and(
          eq(appInstallations.app_id, appId),
          eq(appInstallations.install_type, 'standard'),
          eq(appInstallations.scope_type, 'project'),
          eq(appInstallations.scope_id, projectId),
          eq(appInstallations.is_active, true),
        ),
      });

      if (!installation) {
        throw new BadRequestException(
          'Standard app is not installed in this project.',
        );
      }

      const version = await this.db.query.appVersions.findFirst({
        where: eq(appVersions.id, installation.version_id),
      });

      if (!version) {
        throw new NotFoundException('Installed version not found.');
      }

      return {
        app,
        installation,
        version,
      };
    }

    throw new BadRequestException(
      'Only master and standard apps can create records.',
    );
  }
}
