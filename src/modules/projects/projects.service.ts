import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { desc, eq } from 'drizzle-orm';

import type { DbType }
from 'src/database/database.module';

import {
  companies,
  projects,
} from 'src/database/schema';

import { CreateProjectDto }
from './dto/create-project.dto';

import { UpdateProjectDto }
from './dto/update-project.dto';



import {
  appRecordValues,
  projectFields,
  projectRecordValues,
} from 'src/database/schema';

import { CreateFullProjectDto }
from './dto/create-full-project.dto';

import { UpdateFullProjectDto }
from './dto/update-full-project.dto';



@Injectable()
export class ProjectsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async create(
    dto: CreateProjectDto,
    userId?: number,
  ) {
    const company =
      await this.db.query.companies.findFirst({
        where: eq(
          companies.id,
          dto.company_id,
        ),
      });

    if (!company) {
      throw new NotFoundException(
        'Company not found',
      );
    }

    const [project] =
      await this.db
        .insert(projects)
        .values({
          company_id: dto.company_id,
          name: dto.name,
          description: dto.description ?? null,
          thumbnail_url: dto.thumbnail_url ?? null,
          start_date: dto.start_date
            ? new Date(dto.start_date)
            : null,
          end_date: dto.end_date
            ? new Date(dto.end_date)
            : null,
          country_id: dto.country_id ?? null,
          state_id: dto.state_id ?? null,
          city_id: dto.city_id ?? null,
          status: dto.status ?? 'draft',
          created_by: userId ?? null,
          updated_by: userId ?? null,
        })
        .returning();
        
    return project;
  }

  async findAll() {
    return await this.db.query.projects.findMany({

      orderBy: (projects, { desc }) => [
        desc(projects.id),
      ],
    });
  }

  async findOne(id: number) {
    const project =
      await this.db.query.projects.findFirst({
        where: eq(projects.id, id),
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    return project;
  }

  async update(
    id: number,
    dto: UpdateProjectDto,
    userId?: number,
  ) {
    await this.findOne(id);

    const [project] =
      await this.db
        .update(projects)
        .set({
          ...dto,
          start_date: dto.start_date
            ? new Date(dto.start_date)
            : undefined,
          end_date: dto.end_date
            ? new Date(dto.end_date)
            : undefined,
          updated_by: userId ?? null,
          updated_at: new Date(),
        })
        .where(eq(projects.id, id))
        .returning();

    return project;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.db
      .delete(projects)
      .where(eq(projects.id, id));

    return true;
  }






async findFull(id: number) {
  const project =
    await this.db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        country: true,
        state: true,
        city: true,
      },
    });

  if (!project) {
    throw new NotFoundException(
      'Project not found',
    );
  }

  const fields =
    await this.db.query.projectFields.findMany({
      where: eq(
        projectFields.project_id,
        id,
      ),
      with: {
        referenceApp: true,
      },
      orderBy: (
        projectFields,
        { asc },
      ) => [
        asc(projectFields.order_index),
      ],
    });

  const values =
    await this.db.query.projectRecordValues.findMany({
      where: eq(
        projectRecordValues.project_id,
        id,
      ),
    });

  const fieldsWithValues =
    await Promise.all(
      fields.map(async (field) => {
        const valueObj =
          values.find(
            (v) =>
              v.field_id === field.id,
          );

        let displayValue =
          valueObj?.value ?? null;

        if (
          field.field_type === 'reference' &&
          valueObj?.value
        ) {
          const recordValues =
            await this.db.query.appRecordValues.findMany({
              where: eq(
                appRecordValues.record_id,
                Number(valueObj.value),
              ),
              with: {
                field: true,
              },
            });

          displayValue =
            recordValues
              .map((rv) => rv.value)
              .filter(Boolean)
              .join(', ');
        }

        return {
          ...field,
          value:
            valueObj?.value ?? null,
          display_value:
            displayValue,
        };
      }),
    );

  return {
    ...project,
    fields: fieldsWithValues,
  };
}








  // Full project with fields and record values
  async createFull(
  dto: CreateFullProjectDto,
  userId?: number,
) {
  const project =
    await this.create(
      {
        company_id: dto.company_id,
        name: dto.name,
        description: dto.description,
        thumbnail_url: dto.thumbnail_url,
        start_date: dto.start_date,
        end_date: dto.end_date,
        country_id: dto.country_id,
        state_id: dto.state_id,
        city_id: dto.city_id,
        status: dto.status,
      },
      userId,
    );

  if (dto.fields?.length) {
    for (const item of dto.fields) {
      const [field] =
        await this.db
          .insert(projectFields)
          .values({
            project_id: project.id,
            label: item.label,
            field_key: item.field_key,
            field_type: item.field_type,
            reference_app_id:
              item.reference_app_id ?? null,
            placeholder:
              item.placeholder ?? null,
            default_value:
              item.default_value ?? null,
            dropdown_options:
              item.dropdown_options ?? null,
            validation_rules:
              item.validation_rules ?? null,
            is_required:
              item.is_required ?? false,
            is_visible:
              item.is_visible ?? true,
            is_editable:
              item.is_editable ?? true,
            order_index:
              item.order_index ?? 0,
            created_by:
              userId ?? null,
            updated_by:
              userId ?? null,
          })
          .returning();

      await this.db
        .insert(projectRecordValues)
        .values({
          project_id: project.id,
          field_id: field.id,
          value: item.value ?? null,
        });
    }
  }

  return await this.findFull(project.id);
}



async updateFull(
  id: number,
  dto: UpdateFullProjectDto,
  userId?: number,
) {
  await this.update(
    id,
    {
      company_id: dto.company_id,
      name: dto.name,
      description: dto.description,
      thumbnail_url: dto.thumbnail_url,
      start_date: dto.start_date,
      end_date: dto.end_date,
      country_id: dto.country_id,
      state_id: dto.state_id,
      city_id: dto.city_id,
      status: dto.status,
    },
    userId,
  );

  if (dto.fields?.length) {
    for (const item of dto.fields) {
      let fieldId = item.id;

      if (fieldId) {
        await this.db
          .update(projectFields)
          .set({
            label: item.label,
            field_key: item.field_key,
            field_type: item.field_type,
            reference_app_id:
              item.reference_app_id ?? null,
            placeholder:
              item.placeholder ?? null,
            default_value:
              item.default_value ?? null,
            dropdown_options:
              item.dropdown_options ?? null,
            validation_rules:
              item.validation_rules ?? null,
            is_required:
              item.is_required ?? false,
            is_visible:
              item.is_visible ?? true,
            is_editable:
              item.is_editable ?? true,
            order_index:
              item.order_index ?? 0,
            updated_by:
              userId ?? null,
            updated_at:
              new Date(),
          })
          .where(
            eq(
              projectFields.id,
              fieldId,
            ),
          );
      } else {
        const [field] =
          await this.db
            .insert(projectFields)
            .values({
              project_id: id,
              label: item.label!,
              field_key: item.field_key!,
              field_type: item.field_type!,
              reference_app_id:
                item.reference_app_id ?? null,
              placeholder:
                item.placeholder ?? null,
              default_value:
                item.default_value ?? null,
              dropdown_options:
                item.dropdown_options ?? null,
              validation_rules:
                item.validation_rules ?? null,
              is_required:
                item.is_required ?? false,
              is_visible:
                item.is_visible ?? true,
              is_editable:
                item.is_editable ?? true,
              order_index:
                item.order_index ?? 0,
              created_by:
                userId ?? null,
              updated_by:
                userId ?? null,
            })
            .returning();

        fieldId = field.id;
      }

      await this.db
        .delete(projectRecordValues)
        .where(
          eq(
            projectRecordValues.field_id,
            fieldId!,
          ),
        );

      await this.db
        .insert(projectRecordValues)
        .values({
          project_id: id,
          field_id: fieldId!,
          value: item.value ?? null,
        });
    }
  }

  return await this.findFull(id);
}
}