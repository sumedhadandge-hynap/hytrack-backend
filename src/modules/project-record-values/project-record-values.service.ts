import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { eq } from 'drizzle-orm';

import type { DbType }
from 'src/database/database.module';

import {
  projectFields,
  projectRecordValues,
  projects,
} from 'src/database/schema';

import { BulkProjectRecordValuesDto }
from './dto/bulk-project-record-values.dto';

@Injectable()
export class ProjectRecordValuesService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async bulkSave(dto: BulkProjectRecordValuesDto) {
    const project =
      await this.db.query.projects.findFirst({
        where: eq(projects.id, dto.project_id),
      });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.db
      .delete(projectRecordValues)
      .where(
        eq(
          projectRecordValues.project_id,
          dto.project_id,
        ),
      );

    const rows = dto.values.map((item) => ({
      project_id: dto.project_id,
      field_id: item.field_id,
      value: item.value,
    }));

    if (!rows.length) {
      return [];
    }

    return await this.db
      .insert(projectRecordValues)
      .values(rows)
      .returning();
  }

  async findByProject(projectId: number) {
    return await this.db.query.projectRecordValues.findMany({
      where: eq(
        projectRecordValues.project_id,
        projectId,
      ),
      with: {
        field: true,
      },
    });
  }
}