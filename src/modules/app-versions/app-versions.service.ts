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
  appVersions,
} from 'src/database/schema';

import { CreateAppVersionDto }
  from './dto/create-app-version.dto';

import { UpdateAppVersionDto }
  from './dto/update-app-version.dto';

@Injectable()
export class AppVersionsService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) { }

  // CREATE VERSION
  async create(
    dto: CreateAppVersionDto,
    userId?: number,
  ) {

    const app =
      await this.db.query.apps.findFirst({

        where: eq(
          apps.id,
          dto.app_id,
        ),
      });

    if (!app) {

      throw new NotFoundException(
        'App not found',
      );
    }

    const [result] =
      await this.db
        .insert(appVersions)
        .values({

          app_id: dto.app_id,

          version_number:
            dto.version_number ?? 1,

          version_name:
            dto.version_name,

          notes:
            dto.notes ?? null,

          created_by:
            userId ?? null,

          updated_by:
            userId ?? null,
        })
        .returning();

    return result;
  }
  // GET ALL
  async findAll() {

    return await this.db.query.appVersions.findMany({

      with: {
        app: true,
      },

      orderBy: (
        appVersions,
        { desc },
      ) => [
          desc(appVersions.id),
        ],
    });
  }

  // GET BY APP
  async findByApp(appId: number) {

    return await this.db.query.appVersions.findMany({

      where: eq(
        appVersions.app_id,
        appId,
      ),

      orderBy: (
        appVersions,
        { desc },
      ) => [
          desc(
            appVersions.version_number,
          ),
        ],
    });
  }



  // GET ONE
  async findOne(id: number) {

    const version =
      await this.db.query.appVersions.findFirst({

        where: eq(
          appVersions.id,
          id,
        ),

        with: {
          app: true,
        },
      });

    if (!version) {

      throw new NotFoundException(
        'Version not found',
      );
    }

    return version;
  }

  // UPDATE
  async update(
    id: number,
    dto: UpdateAppVersionDto,
    userId?: number,
  ) {

    await this.findOne(id);

    const [result] =
      await this.db
        .update(appVersions)
        .set({

          ...dto,

          updated_by:
            userId ?? null,

          updated_at:
            new Date(),
        })
        .where(
          eq(appVersions.id, id),
        )
        .returning();

    return result;
  }

  // PUBLISH VERSION
  async publish(
    id: number,
    userId?: number,
  ) {

    await this.findOne(id);

    const [result] =
      await this.db
        .update(appVersions)
        .set({

          is_published: true,

          updated_by:
            userId ?? null,

          updated_at:
            new Date(),
        })
        .where(
          eq(appVersions.id, id),
        )
        .returning();

    return result;
  }

  // DELETE
  async remove(id: number) {

    await this.findOne(id);

    await this.db
      .delete(appVersions)
      .where(
        eq(appVersions.id, id),
      );

    return true;
  }

async getFullVersion(id: number) {

  const version =
    await this.db.query.appVersions.findFirst({

      where: eq(
        appVersions.id,
        id,
      ),

      with: {
        app: true,
      },
    });

  if (!version) {

    throw new NotFoundException(
      'Version not found',
    );
  }

  const steps =
    await this.db.query.appSteps.findMany({

      where: eq(
        appSteps.version_id,
        id,
      ),

      with: {

        fields: true,

        approvers: true,

        discussions: true,
      },
    });

  return {
    version,
    steps,
  };
}

}