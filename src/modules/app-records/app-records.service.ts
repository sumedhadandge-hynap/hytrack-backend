import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { eq } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import {
  apps,
  appRecords,
} from 'src/database/schema';

import { CreateAppRecordDto } from './dto/create-app-record.dto';

@Injectable()
export class AppRecordsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async create(
    dto: CreateAppRecordDto,
    userId?: number,
  ) {
    const app =
      await this.db.query.apps.findFirst({
        where: eq(apps.id, dto.app_id),
      });

    if (!app) {
      throw new NotFoundException('App not found');
    }

    const [record] =
      await this.db
        .insert(appRecords)
        .values({
          app_id: dto.app_id,
          project_id: dto.project_id ?? null,
          status: dto.status ?? 'draft',
          created_by: userId ?? null,
          updated_by: userId ?? null,
        })
        .returning();

    return record;
  }

  async findByApp(appId: number) {
    return await this.db.query.appRecords.findMany({
      where: eq(appRecords.app_id, appId),
      orderBy: (appRecords, { desc }) => [
        desc(appRecords.id),
      ],
    });
  }

  async findOne(id: number) {
    const record =
      await this.db.query.appRecords.findFirst({
        where: eq(appRecords.id, id),
      });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    return record;
  }
}