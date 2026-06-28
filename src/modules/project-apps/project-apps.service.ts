import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  and,
  desc,
  eq,
} from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import {
  apps,
  appSteps,
  appVersions,
  projectApps,
  projects,
} from 'src/database/schema';

import { InstallProjectAppDto } from './dto/install-project-app.dto';

@Injectable()
export class ProjectAppsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  private async getLatestPublishedVersion(
    appId: number,
  ) {
    const latestVersion =
      await this.db.query.appVersions.findFirst({
        where: and(
          eq(appVersions.app_id, appId),
          eq(appVersions.is_published, true),
        ),
        orderBy: (
          appVersions,
          { desc },
        ) => [
          desc(appVersions.version_number),
        ],
      });

    if (!latestVersion) {
      throw new BadRequestException(
        'No published version found for this app.',
      );
    }

    return latestVersion;
  }

  async install(
    dto: InstallProjectAppDto,
    userId?: number,
  ) {
    const project =
      await this.db.query.projects.findFirst({
        where: eq(projects.id, dto.project_id),
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    const app =
      await this.db.query.apps.findFirst({
        where: eq(apps.id, dto.app_id),
        with: {
          appType: true,
        },
      });

    if (!app) {
      throw new NotFoundException('App not found');
    }

    if (app.appType?.code !== 'standard') {
      throw new BadRequestException(
        'Only standard apps can be installed into projects.',
      );
    }

    const latestVersion =
      await this.getLatestPublishedVersion(
        dto.app_id,
      );

    const existing =
      await this.db.query.projectApps.findFirst({
        where: and(
          eq(
            projectApps.project_id,
            dto.project_id,
          ),
          eq(projectApps.app_id, dto.app_id),
        ),
        with: {
          app: true,
          version: true,
        },
      });

    if (existing) {
      return {
        ...existing,
        project_app_id: existing.id,
        app,
        installed_version: existing.version,
        latest_version: latestVersion,
        already_installed: true,
        update_available:
          existing.version_id !== latestVersion.id,
      };
    }

    const [installed] =
      await this.db
        .insert(projectApps)
        .values({
          project_id: dto.project_id,
          app_id: dto.app_id,
          version_id: latestVersion.id,
          status: 'installed',
          installed_by: userId ?? null,
        })
        .returning();

    return {
      ...installed,
      project_app_id: installed.id,
      app,
      installed_version: latestVersion,
      latest_version: latestVersion,
      already_installed: false,
      update_available: false,
    };
  }

  async updateLatest(
    projectAppId: number,
    userId?: number,
  ) {
    const projectApp =
      await this.db.query.projectApps.findFirst({
        where: eq(projectApps.id, projectAppId),
        with: {
          app: true,
          version: true,
        },
      });

    if (!projectApp) {
      throw new NotFoundException(
        'Project app not found',
      );
    }

    const latestVersion =
      await this.getLatestPublishedVersion(
        projectApp.app_id,
      );

    if (projectApp.version_id === latestVersion.id) {
      return {
        ...projectApp,
        project_app_id: projectApp.id,
        installed_version: projectApp.version,
        latest_version: latestVersion,
        update_available: false,
      };
    }

    const [updated] =
      await this.db
        .update(projectApps)
        .set({
          version_id: latestVersion.id,
          status: 'installed',
          updated_at: new Date(),
        })
        .where(eq(projectApps.id, projectAppId))
        .returning();

    return {
      ...updated,
      project_app_id: updated.id,
      app: projectApp.app,
      installed_version: latestVersion,
      latest_version: latestVersion,
      update_available: false,
    };
  }

  async findByProject(projectId: number) {
    const project =
      await this.db.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    const installedApps =
      await this.db.query.projectApps.findMany({
        where: eq(
          projectApps.project_id,
          projectId,
        ),
        with: {
          app: {
            with: {
              appType: true,
            },
          },
          version: true,
        },
        orderBy: (
          projectApps,
          { desc },
        ) => [desc(projectApps.id)],
      });

    const result: any[] = [];

    for (const item of installedApps) {
      const latestVersion =
        await this.getLatestPublishedVersion(
          item.app_id,
        );

      result.push({
        id: item.id,
        project_app_id: item.id,

        project_id: item.project_id,
        app_id: item.app_id,

        status: item.status,

        app: item.app,
        app_name: item.app?.name,
        app_code: item.app?.code,
        app_type: item.app?.appType?.name,
        app_type_code: item.app?.appType?.code,
        icon_url: item.app?.icon_url,

        installed_version_id: item.version?.id ?? null,
        installed_version_name:
          item.version?.version_name ?? null,
        installed_version_number:
          item.version?.version_number ?? null,

        latest_version_id: latestVersion.id,
        latest_version_name:
          latestVersion.version_name,
        latest_version_number:
          latestVersion.version_number,

        update_available:
          item.version_id !== latestVersion.id,

        action_label:
          item.version_id !== latestVersion.id
            ? 'Update Available'
            : 'Installed',

        created_at: item.created_at,
        updated_at: item.updated_at,
      });
    }

    return result;
  }

  async findSteps(id: number) {
    const projectApp =
      await this.db.query.projectApps.findFirst({
        where: eq(projectApps.id, id),
      });

    if (!projectApp) {
      throw new NotFoundException(
        'Project app not found',
      );
    }

    if (!projectApp.version_id) {
      throw new BadRequestException(
        'No version selected for this installed app',
      );
    }

    return await this.db.query.appSteps.findMany({
      where: eq(
        appSteps.version_id,
        projectApp.version_id,
      ),
      with: {
        fields: true,
      },
      orderBy: (appSteps, { asc }) => [
        asc(appSteps.order_index),
      ],
    });
  }

  async remove(id: number) {
    const projectApp =
      await this.db.query.projectApps.findFirst({
        where: eq(projectApps.id, id),
      });

    if (!projectApp) {
      throw new NotFoundException(
        'Project app not found',
      );
    }

    await this.db
      .delete(projectApps)
      .where(eq(projectApps.id, id));

    return true;
  }
}