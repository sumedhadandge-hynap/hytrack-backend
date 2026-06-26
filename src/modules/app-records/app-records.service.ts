import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq, desc } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import {
  apps,
  appRecords,
  appSteps,
  projects,
  appVersions,
} from 'src/database/schema';

import { CreateAppRecordDto } from './dto/create-app-record.dto';

@Injectable()
export class AppRecordsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async create(dto: CreateAppRecordDto, userId?: number) {
    // ------------------------------------------------
    // Validate App
    // ------------------------------------------------

    const app = await this.db.query.apps.findFirst({
      where: eq(apps.id, dto.app_id),
    });

    if (!app) {
      throw new NotFoundException('App not found');
    }

    // ------------------------------------------------
    // Validate Version
    // ------------------------------------------------

    const version = await this.db.query.appVersions.findFirst({
      where: eq(appVersions.id, dto.version_id),
    });

    if (!version) {
      throw new NotFoundException('App version not found');
    }

    // ------------------------------------------------
    // Version must belong to App
    // ------------------------------------------------

    if (version.app_id !== dto.app_id) {
      throw new BadRequestException(
        'Selected version does not belong to this app.',
      );
    }

    // ------------------------------------------------
    // Version must be published
    // ------------------------------------------------

    if (!version.is_published) {
      throw new BadRequestException('Version is not published.');
    }

    // ------------------------------------------------
    // Validate Project
    // ------------------------------------------------

    if (dto.project_id) {
      const project = await this.db.query.projects.findFirst({
        where: eq(projects.id, dto.project_id),
      });

      if (!project) {
        throw new NotFoundException('Project not found.');
      }
    }

    // ------------------------------------------------
    // Version should contain Steps
    // ------------------------------------------------

    const steps = await this.db.query.appSteps.findMany({
      where: eq(appSteps.version_id, dto.version_id),
    });

    if (!steps.length) {
      throw new BadRequestException('This version has no configured steps.');
    }

    // ------------------------------------------------
    // Version should contain Fields
    // ------------------------------------------------

    const stepIds = steps.map((s) => s.id);

    const fields = await this.db.query.appFields.findMany({
      where: (field, { inArray }) => inArray(field.step_id, stepIds),
    });

    if (!fields.length) {
      throw new BadRequestException('This version has no configured fields.');
    }

    // ------------------------------------------------
    // Prevent Duplicate Draft
    // ------------------------------------------------

    const conditions = [
      eq(appRecords.app_id, dto.app_id),
      eq(appRecords.version_id, dto.version_id),
      eq(appRecords.status, 'draft'),
    ];

    if (dto.project_id) {
      conditions.push(eq(appRecords.project_id, dto.project_id));
    }

    const existing = await this.db.query.appRecords.findFirst({
      where: and(...conditions),
    });
    if (existing) {
      throw new ConflictException(
        'A draft record already exists for this app version.',
      );
    }

    // ------------------------------------------------
    // Create Record
    // ------------------------------------------------

    const [record] = await this.db
      .insert(appRecords)
      .values({
        app_id: dto.app_id,

        version_id: dto.version_id,

        project_id: dto.project_id ?? null,

        status: dto.status ?? 'draft',

        created_by: userId ?? null,

        updated_by: userId ?? null,
      })
      .returning();

    return record;
  }

async findByApp(
  appId: number,
  versionId: number,
) {
  const records =
    await this.db.query.appRecords.findMany({
      where: and(
        eq(appRecords.app_id, appId),
        eq(appRecords.version_id, versionId),
      ),

      with: {
        values: true,
      },

      orderBy: (appRecords, { desc }) => [
        desc(appRecords.id),
      ],
    });

  return records.map((r) => ({
    ...r,
    display_value:
      r.values
        ?.map((v: any) => v.value)
        .filter(Boolean)
        .join(', ') ||
      `Record #${r.id}`,
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

    return record;
  }
}
