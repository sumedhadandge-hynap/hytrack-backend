import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, desc, eq } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import { appInstallations, apps, appTypes, appVersions } from 'src/database/schema';

import { CreateAppDto } from './dto/create-app.dto';

import { UpdateAppDto } from './dto/update-app.dto';

@Injectable()
export class AppsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  // CREATE APP
  async create(dto: CreateAppDto, userId?: number) {
    const existing = await this.db.query.apps.findFirst({
      where: eq(apps.code, dto.code),
    });

    if (existing) {
      throw new BadRequestException('App code already exists');
    }

    const appType = await this.db.query.appTypes.findFirst({
      where: eq(appTypes.id, dto.app_type_id),
    });

    if (!appType) {
      throw new NotFoundException('App type not found');
    }

    const result = await this.db.transaction(async (tx) => {
      const [app] = await tx
        .insert(apps)
        .values({
          name: dto.name,
          code: dto.code,
          description: dto.description ?? null,
          app_type_id: dto.app_type_id,
          icon_url: dto.icon_url ?? null,
          created_by: userId ?? null,
          updated_by: userId ?? null,
        })
        .returning();

      const [version] = await tx
        .insert(appVersions)
        .values({
          app_id: app.id,
          version_number: 1,
          version_name: 'Version 1',
          notes: 'Initial version',
          is_published: false,
          created_by: userId ?? null,
          updated_by: userId ?? null,
        })
        .returning();

      return {
        ...app,
        currentVersion: version,
      };
    });

    return result;
  }

  // GET ALL APPS
  async findAll() {
    const items = await this.db.query.apps.findMany({
      with: {
        appType: true,
        versions: true,
      },

      orderBy: (apps, { desc }) => [desc(apps.id)],
    });

    return items.map((app) => {
      const latestVersion =
        [...app.versions].sort(
          (a, b) => (b.version_number ?? 0) - (a.version_number ?? 0),
        )[0] ?? null;

      const publishedVersion =
        [...app.versions]
          .filter((v) => v.is_published)
          .sort(
            (a, b) => (b.version_number ?? 0) - (a.version_number ?? 0),
          )[0] ?? null;

      return {
        id: app.id,
        uid: app.uid,

        name: app.name,
        code: app.code,

        description: app.description,

        icon_url: app.icon_url,

        app_type_id: app.app_type_id,

        appType: app.appType,

        latest_version: latestVersion,

        published_version: publishedVersion,

        total_versions: app.versions.length,
      };
    });
  }

  // GET APP BY ID
  async findOne(id: number) {
    const app = await this.db.query.apps.findFirst({
      where: eq(apps.id, id),

      with: {
        appType: true,
      },
    });

    if (!app) {
      throw new NotFoundException('App not found');
    }

    return app;
  }

  // UPDATE APP
  async update(id: number, dto: UpdateAppDto, userId?: number) {
    await this.findOne(id);

    const [app] = await this.db
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

    await this.db.delete(apps).where(eq(apps.id, id));

    return true;
  }

  // PUBLISH APP (publishes latest version)
  async publish(id: number, userId?: number) {
    await this.findOne(id);

    const latestVersion = await this.db.query.appVersions.findFirst({
      where: eq(appVersions.app_id, id),
      orderBy: (appVersions, { desc }) => [desc(appVersions.version_number)],
    });

    if (!latestVersion) {
      throw new NotFoundException('No version found for this app');
    }

    const [updatedVersion] = await this.db
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
  options?: {
    company_id?: number;
    project_id?: number;
  },
) {
  const items = await this.db.query.apps.findMany({
    with: {
      appType: true,
      versions: true,
    },
  });

  let scopeType: string | null = null;
  let scopeId: number | null = null;

  if (typeCode === 'master') {
    if (options?.company_id) {
      scopeType = 'company';
      scopeId = options.company_id;
    } else {
      scopeType = 'global';
      scopeId = 0;
    }
  }

  if (typeCode === 'standard') {
    if (options?.project_id) {
      scopeType = 'project';
      scopeId = options.project_id;
    }
  }

  const installations =
    scopeType !== null && scopeId !== null
      ? await this.db.query.appInstallations.findMany({
          where: and(
            eq(
              appInstallations.install_type,
              typeCode,
            ),
            eq(
              appInstallations.scope_type,
              scopeType,
            ),
            eq(
              appInstallations.scope_id,
              scopeId,
            ),
            eq(
              appInstallations.is_active,
              true,
            ),
          ),
        })
      : [];

  const result: any[] = [];

  for (const app of items) {
    if (app.appType?.code !== typeCode) {
      continue;
    }

    const latestPublishedVersion =
      [...app.versions]
        .filter((v) => v.is_published === true)
        .sort(
          (a, b) =>
            (b.version_number ?? 0) -
            (a.version_number ?? 0),
        )[0] ?? null;

    if (!latestPublishedVersion) {
      continue;
    }

    const installation =
      installations.find(
        (item) => item.app_id === app.id,
      ) ?? null;

    const installedVersion = installation
      ? app.versions.find(
          (version) =>
            version.id === installation.version_id,
        ) ?? null
      : null;

    result.push({
      app_id: app.id,
      app_name: app.name,
      app_code: app.code,
      description: app.description,
      icon_url: app.icon_url,

      app_type_id: app.app_type_id,
      app_type: app.appType?.name,
      app_type_code: app.appType?.code,

      latest_version_id:
        latestPublishedVersion.id,
      latest_version_number:
        latestPublishedVersion.version_number,
      latest_version_name:
        latestPublishedVersion.version_name,
      latest_version_notes:
        latestPublishedVersion.notes,

      is_installed: !!installation,

      installed_version_id:
        installedVersion?.id ?? null,
      installed_version_number:
        installedVersion?.version_number ?? null,
      installed_version_name:
        installedVersion?.version_name ?? null,

      update_available:
        !!installation &&
        installation.version_id !==
          latestPublishedVersion.id,

      action_label: !installation
        ? 'Install'
        : installation.version_id !==
            latestPublishedVersion.id
          ? 'Update Available'
          : 'Installed',
    });
  }

  return result;
}

async getLatestPublishedVersion(
  appId: number,
  currentVersionId?: number,
) {
  const app = await this.db.query.apps.findFirst({
    where: eq(apps.id, appId),
    with: {
      appType: true,
      versions: true,
    },
  });

  if (!app) {
    throw new NotFoundException('App not found');
  }

  const latestPublishedVersion =
    [...app.versions]
      .filter((v) => v.is_published === true)
      .sort(
        (a, b) =>
          (b.version_number ?? 0) -
          (a.version_number ?? 0),
      )[0] ?? null;

  if (!latestPublishedVersion) {
    throw new NotFoundException(
      'No published version found for this app',
    );
  }

  return {
    app_id: app.id,
    app_name: app.name,
    app_code: app.code,
    app_type: app.appType?.name,
    app_type_code: app.appType?.code,

    latest_version_id: latestPublishedVersion.id,
    latest_version_number:
      latestPublishedVersion.version_number,
    latest_version_name:
      latestPublishedVersion.version_name,
    latest_version_notes:
      latestPublishedVersion.notes,

    current_version_id: currentVersionId ?? null,

    update_available:
      currentVersionId
        ? currentVersionId !== latestPublishedVersion.id
        : false,
  };
}


}
