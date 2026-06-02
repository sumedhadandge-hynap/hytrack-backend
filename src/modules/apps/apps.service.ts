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
  appTypes,
} from 'src/database/schema';

import { CreateAppDto }
  from './dto/create-app.dto';

import { UpdateAppDto }
  from './dto/update-app.dto';

@Injectable()
export class AppsService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) { }

  // CREATE APP
  async create(
    dto: CreateAppDto,
    userId?: number,
  ) {

    const existing =
      await this.db.query.apps.findFirst({
        where: eq(apps.code, dto.code),
      });

    if (existing) {

      throw new BadRequestException(
        'App code already exists',
      );
    }

    const appType =
      await this.db.query.appTypes.findFirst({
        where: eq(
          appTypes.id,
          dto.app_type_id,
        ),
      });

    if (!appType) {

      throw new NotFoundException(
        'App type not found',
      );
    }

    const [app] =
      await this.db
        .insert(apps)
        .values({

          name: dto.name,

          code: dto.code,

          description:
            dto.description ?? null,

          app_type_id:
            dto.app_type_id,

          icon_url:
            dto.icon_url ?? null,

          created_by: userId,

          updated_by: userId,
        })
        .returning();

    return app;
  }

  // GET ALL APPS
  async findAll() {

    const items =
      await this.db.query.apps.findMany({

        with: {
          appType: true,
          versions: true,
        },
      });

    return items.map((app) => {

      const publishedVersion =
        app.versions.find(
          (v) => v.is_published,
        );

      return {
        id: app.id,
        name: app.name,
        code: app.code,
        appType: app.appType,
        publishedVersion,
      };
    });
  }

  // GET APP BY ID
  async findOne(id: number) {

    const app =
      await this.db.query.apps.findFirst({

        where: eq(apps.id, id),

        with: {
          appType: true,
        },
      });

    if (!app) {

      throw new NotFoundException(
        'App not found',
      );
    }

    return app;
  }

  // UPDATE APP
  async update(
    id: number,
    dto: UpdateAppDto,
    userId?: number,
  ) {

    await this.findOne(id);

    const [app] =
      await this.db
        .update(apps)
        .set({

          ...dto,

          updated_by: userId,

          updated_at: new Date(),
        })
        .where(eq(apps.id, id))
        .returning();

    return app;
  }

  // DELETE APP
  async remove(id: number) {

    await this.findOne(id);

    await this.db
      .delete(apps)
      .where(eq(apps.id, id));

    return true;
  }

  // PUBLISH APP
  async publish(
    id: number,
    userId?: number,
  ) {

    await this.findOne(id);

    const [app] =
      await this.db
        .update(apps)
        .set({

          is_published: true,

          version: 2,

          updated_by: userId,

          updated_at: new Date(),
        })
        .where(eq(apps.id, id))
        .returning();

    return app;
  }




  async getPublishedAppsByType(
    typeCode: string,
  ) {

    const items =
      await this.db.query.apps.findMany({

        with: {

          appType: true,

          versions: true,
        },

        orderBy: (
          apps,
          { desc },
        ) => [
            desc(apps.id),
          ],
      });

    return items
      .filter((item) => {

        const publishedVersion =
          item.versions?.find(
            (v) =>
              v.is_published === true,
          );

        return (
          item.appType?.code ===
          typeCode &&
          publishedVersion
        );
      })
      .map((item) => {

        const publishedVersion =
          item.versions.find(
            (v) =>
              v.is_published === true,
          );

        return {
          ...item,
          published_version:
            publishedVersion,
        };
      });
  }

}