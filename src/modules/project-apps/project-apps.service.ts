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
  appVersions,
  projectApps,
  projects,
  appSteps,
} from 'src/database/schema';

import { InstallProjectAppDto }
from './dto/install-project-app.dto';

@Injectable()
export class ProjectAppsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async install(
    dto: InstallProjectAppDto,
    userId?: number,
  ) {
    const project =
      await this.db.query.projects.findFirst({
        where: eq(projects.id, dto.project_id),
      });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const app =
      await this.db.query.apps.findFirst({
        where: eq(apps.id, dto.app_id),
      });

    if (!app) {
      throw new NotFoundException('App not found');
    }

    let versionId = dto.version_id ?? null;

    if (versionId) {
      const version =
        await this.db.query.appVersions.findFirst({
          where: eq(appVersions.id, versionId),
        });

      if (!version) {
        throw new NotFoundException(
          'Version not found',
        );
      }

      if (version.app_id !== dto.app_id) {
        throw new BadRequestException(
          'Version does not belong to the selected app',
        );
      }
    }

    if (!versionId) {
      const publishedVersions =
        await this.db.query.appVersions.findMany({
          where: eq(
            appVersions.app_id,
            dto.app_id,
          ),
          orderBy: (appVersions, { desc }) => [
            desc(appVersions.version_number),
          ],
        });

      const published =
        publishedVersions.find(
          (v) => v.is_published,
        );

      if (!published) {
        throw new BadRequestException(
          'No published version found for this app',
        );
      }

      versionId = published.id;
    }

    const existing =
      await this.db.query.projectApps.findFirst({
        where: and(
          eq(projectApps.project_id, dto.project_id),
          eq(projectApps.app_id, dto.app_id),
        ),
      });

    if (existing) {
      throw new BadRequestException(
        'App already installed in project',
      );
    }

    const [installed] =
      await this.db
        .insert(projectApps)
        .values({
          project_id: dto.project_id,
          app_id: dto.app_id,
          version_id: versionId,
          status: 'installed',
          installed_by: userId ?? null,
        })
        .returning();

    return installed;
  }

  async findByProject(projectId: number) {
    return await this.db.query.projectApps.findMany({
      where: eq(projectApps.project_id, projectId),
      with: {
        app: true,
        version: true,
      },
    });
  }

  async findSteps(id: number) {
    const projectApp =
      await this.db.query.projectApps.findFirst({
        where: eq(projectApps.id, id),
      });

    if (!projectApp) {
      throw new NotFoundException('Project app not found');
    }

    if (!projectApp.version_id) {
      throw new BadRequestException('No version selected for this installed app');
    }

    return await this.db.query.appSteps.findMany({
      where: eq(appSteps.version_id, projectApp.version_id),
      with: {
        fields: true,
      },
      orderBy: (appSteps, { asc }) => [
        asc(appSteps.order_index),
      ],
    });
  }

  async remove(id: number) {
    await this.db
      .delete(projectApps)
      .where(eq(projectApps.id, id));

    return true;
  }
}