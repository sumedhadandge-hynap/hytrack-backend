import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq } from 'drizzle-orm';

import type { DbType }
from 'src/database/database.module';

import {
  apps,
  projectFields,
  projects,
} from 'src/database/schema';

import { CreateProjectFieldDto }
from './dto/create-project-field.dto';

import { UpdateProjectFieldDto }
from './dto/update-project-field.dto';

@Injectable()
export class ProjectFieldsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async create(
    dto: CreateProjectFieldDto,
    userId?: number,
  ) {
    const project =
      await this.db.query.projects.findFirst({
        where: eq(projects.id, dto.project_id),
      });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (dto.reference_app_id) {
      const app =
        await this.db.query.apps.findFirst({
          where: eq(apps.id, dto.reference_app_id),
        });

      if (!app) {
        throw new NotFoundException(
          'Reference master app not found',
        );
      }
    }

    const existing =
      await this.db.query.projectFields.findFirst({
        where: and(
          eq(projectFields.project_id, dto.project_id),
          eq(projectFields.field_key, dto.field_key),
        ),
      });

    if (existing) {
      throw new BadRequestException(
        'Field key already exists in this project',
      );
    }

    const [field] =
      await this.db
        .insert(projectFields)
        .values({
          project_id: dto.project_id,
          label: dto.label,
          field_key: dto.field_key,
          field_type: dto.field_type,
          reference_app_id: dto.reference_app_id ?? null,
          placeholder: dto.placeholder ?? null,
          default_value: dto.default_value ?? null,
          dropdown_options: dto.dropdown_options ?? null,
          validation_rules: dto.validation_rules ?? null,
          is_required: dto.is_required ?? false,
          is_visible: dto.is_visible ?? true,
          is_editable: dto.is_editable ?? true,
          order_index: dto.order_index ?? 0,
          created_by: userId ?? null,
          updated_by: userId ?? null,
        })
        .returning();

    return field;
  }

  async findByProject(projectId: number) {
    return await this.db.query.projectFields.findMany({
      where: eq(projectFields.project_id, projectId),
      orderBy: (projectFields, { asc }) => [
        asc(projectFields.order_index),
      ],
    });
  }

  async findOne(id: number) {
    const field =
      await this.db.query.projectFields.findFirst({
        where: eq(projectFields.id, id),
      });

    if (!field) {
      throw new NotFoundException('Project field not found');
    }

    return field;
  }

  async update(
    id: number,
    dto: UpdateProjectFieldDto,
    userId?: number,
  ) {
    await this.findOne(id);

    const [field] =
      await this.db
        .update(projectFields)
        .set({
          ...dto,
          updated_by: userId ?? null,
          updated_at: new Date(),
        })
        .where(eq(projectFields.id, id))
        .returning();

    return field;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.db
      .delete(projectFields)
      .where(eq(projectFields.id, id));

    return true;
  }
}