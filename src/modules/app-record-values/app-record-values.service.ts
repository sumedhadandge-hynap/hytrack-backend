import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { eq } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import {
  appFields,
  appRecords,
  appRecordValues,
} from 'src/database/schema';

import { CreateAppRecordValueDto } from './dto/create-app-record-value.dto';
import { BulkAppRecordValuesDto } from './dto/bulk-app-record-values.dto';

@Injectable()
export class AppRecordValuesService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async create(dto: CreateAppRecordValueDto) {
    const record =
      await this.db.query.appRecords.findFirst({
        where: eq(appRecords.id, dto.record_id),
      });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const field =
      await this.db.query.appFields.findFirst({
        where: eq(appFields.id, dto.field_id),
      });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    const [result] =
      await this.db
        .insert(appRecordValues)
        .values({
          record_id: dto.record_id,
          field_id: dto.field_id,
          value: dto.value,
        })
        .returning();

    return result;
  }

  async bulkCreate(dto: BulkAppRecordValuesDto) {
    const record =
      await this.db.query.appRecords.findFirst({
        where: eq(appRecords.id, dto.record_id),
      });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    // Clean up existing values for this record to support update/upsert
    await this.db
      .delete(appRecordValues)
      .where(eq(appRecordValues.record_id, dto.record_id));

    const values = dto.values.map((item) => ({
      record_id: dto.record_id,
      field_id: item.field_id,
      value: item.value,
    }));

    return await this.db
      .insert(appRecordValues)
      .values(values)
      .returning();
  }

  async findByRecord(recordId: number) {
    return await this.db.query.appRecordValues.findMany({
      where: eq(
        appRecordValues.record_id,
        recordId,
      ),
      with: {
        field: true,
      },
    });
  }
}