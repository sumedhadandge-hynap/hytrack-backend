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
  apps,
  appSteps,
} from 'src/database/schema';

import { CreateAppStepDto }
from './dto/create-app-step.dto';

import { UpdateAppStepDto }
from './dto/update-app-step.dto';

@Injectable()
export class AppStepsService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  // CREATE STEP
  async create(
    dto: CreateAppStepDto,
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

    const [step] =
      await this.db
        .insert(appSteps)
        .values({

          app_id: dto.app_id,

          name: dto.name,

          description:
            dto.description ?? null,

          step_type: dto.step_type,

          order_index:
            dto.order_index ?? 1,

          is_required:
            dto.is_required ?? true,

          created_by: userId,

          updated_by: userId,
        })
        .returning();

    return step;
  }

  // GET ALL STEPS
  async findAll() {

    return await this.db.query.appSteps.findMany({

      with: {
        app: true,
      },

      orderBy: (appSteps, { asc }) => [
        asc(appSteps.order_index),
      ],
    });
  }

  // GET APP STEPS
  async findByApp(appId: number) {

    return await this.db.query.appSteps.findMany({

      where: eq(appSteps.app_id, appId),

      orderBy: (appSteps, { asc }) => [
        asc(appSteps.order_index),
      ],
    });
  }

  // GET STEP
  async findOne(id: number) {

    const step =
      await this.db.query.appSteps.findFirst({

        where: eq(appSteps.id, id),

        with: {
          app: true,
        },
      });

    if (!step) {

      throw new NotFoundException(
        'Step not found',
      );
    }

    return step;
  }

  // UPDATE STEP
  async update(
    id: number,
    dto: UpdateAppStepDto,
    userId?: number,
  ) {

    await this.findOne(id);

    const [step] =
      await this.db
        .update(appSteps)
        .set({

          ...dto,

          updated_by: userId,

          updated_at: new Date(),
        })
        .where(eq(appSteps.id, id))
        .returning();

    return step;
  }

  // DELETE STEP
  async remove(id: number) {

    await this.findOne(id);

    await this.db
      .delete(appSteps)
      .where(eq(appSteps.id, id));

    return true;
  }
}