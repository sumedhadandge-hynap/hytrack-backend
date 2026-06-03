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
  appVersions,
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

      orderBy: (apps, { desc }) => [
        desc(apps.id),
      ],
    });

  return items.map((app) => {

    const latestVersion =
      [...app.versions].sort(
        (a, b) =>
          (b.version_number ?? 0) -
          (a.version_number ?? 0),
      )[0] ?? null;

    const publishedVersion =
      [...app.versions]
        .filter((v) => v.is_published)
        .sort(
          (a, b) =>
            (b.version_number ?? 0) -
            (a.version_number ?? 0),
        )[0] ?? null;

    return {
      id: app.id,
      uid: app.uid,

      name: app.name,
      code: app.code,

      description:
        app.description,

      icon_url:
        app.icon_url,

      appType:
        app.appType,

      latest_version:
        latestVersion,

      published_version:
        publishedVersion,

      total_versions:
        app.versions.length,
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

  // PUBLISH APP (publishes latest version)
  async publish(
    id: number,
    userId?: number,
  ) {
    await this.findOne(id);

    const latestVersion =
      await this.db.query.appVersions.findFirst({
        where: eq(appVersions.app_id, id),
        orderBy: (appVersions, { desc }) => [
          desc(appVersions.version_number),
        ],
      });

    if (!latestVersion) {
      throw new NotFoundException(
        'No version found for this app',
      );
    }

    const [updatedVersion] =
      await this.db
        .update(appVersions)
        .set({
          is_published: true,
          updated_by: userId,
          updated_at: new Date(),
        })
        .where(eq(appVersions.id, latestVersion.id))
        .returning();

    return updatedVersion;
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
      });

    const result: any[] = [];

    for (const app of items) {

      if (
        app.appType?.code !== typeCode
      ) {
        continue;
      }

      const publishedVersions =
        app.versions.filter(
          (v) => v.is_published === true,
        );

      for (const version of publishedVersions) {

        result.push({

          app_id: app.id,

          app_name: app.name,

          app_code: app.code,

          icon_url:
            app.icon_url,

          app_type:
            app.appType?.name,

          version_id:
            version.id,

          version_number:
            version.version_number,

          version_name:
            version.version_name,

          notes:
            version.notes,

          published_at:
            version.updated_at,
        });
      }
    }

    return result;
  }

}