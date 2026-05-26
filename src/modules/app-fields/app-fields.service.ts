import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { desc, eq }
  from 'drizzle-orm';

import type { DbType }
  from 'src/database/database.module';

import {
  appFields,
  apps,
  appSteps,
} from 'src/database/schema';

import { CreateAppFieldDto }
  from './dto/create-app-field.dto';

import { UpdateAppFieldDto }
  from './dto/update-app-field.dto';

@Injectable()
export class AppFieldsService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) { }

  // CREATE
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

    const step =
      await this.db.query.appSteps.findFirst({
        where: eq(appSteps.id, dto.step_id),
      });

    if (!step) {
      throw new NotFoundException(
        'Step not found',
      );
    }

    const existing =
      await this.db.query.appFields.findFirst({
        where: eq(
          appFields.field_key,
          dto.field_key,
        ),
      });

    if (existing) {
      throw new BadRequestException(
        'Field key already exists',
      );
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

          created_by: userId,

          updated_by: userId,
        })
        .returning();

    return field;
  }

  // GET ALL
  async findAll() {

    return await this.db.query.appFields.findMany({

      with: {
        step: true
       
      },

      orderBy: (appFields, { desc }) => [
        desc(appFields.id),
      ],
    });
  }

  // GET APP FIELDS
  async findByApp(appId: number) {

    return await this.db.query.appFields.findMany({

      where: eq(appFields.app_id, appId),

      orderBy: (appFields, { asc }) => [
        asc(appFields.order_index),
      ],
    });
  }

  // GET ONE
  async findOne(id: number) {

    const field =
      await this.db.query.appFields.findFirst({

        where: eq(appFields.id, id),
      });

    if (!field) {

      throw new NotFoundException(
        'Field not found',
      );
    }

    return field;
  }

  // UPDATE
  async update(
    id: number,
    dto: UpdateAppFieldDto,
    userId?: number,
  ) {

    await this.findOne(id);

    const [field] =
      await this.db
        .update(appFields)
        .set({

          ...dto,

          updated_by: userId,

          updated_at: new Date(),
        })
        .where(eq(appFields.id, id))
        .returning();

    return field;
  }

  // DELETE
  async remove(id: number) {

    await this.findOne(id);

    await this.db
      .delete(appFields)
      .where(eq(appFields.id, id));

    return true;
  }
}