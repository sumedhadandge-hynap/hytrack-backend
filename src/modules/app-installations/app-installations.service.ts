import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  and,
  eq,
} from 'drizzle-orm';



import {
  apps,
  appVersions,
  appInstallations,
} from 'src/database/schema';

import { InstallAppDto } from './dto/install-app.dto';
import type{ DbType } from 'src/database/database.module';

@Injectable()
export class AppInstallationsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  private getScope(dto: InstallAppDto) {
    if (dto.install_type === 'master') {
      if (dto.company_id) {
        return {
          scope_type: 'company',
          scope_id: dto.company_id,
        };
      }

      return {
        scope_type: 'global',
        scope_id: 0,
      };
    }

    if (dto.install_type === 'standard') {
      if (!dto.project_id) {
        throw new BadRequestException(
          'project_id is required for standard app installation.',
        );
      }

      return {
        scope_type: 'project',
        scope_id: dto.project_id,
      };
    }

    throw new BadRequestException(
      'Invalid install type.',
    );
  }

  async getLatestPublishedVersion(appId: number) {
    const version =
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

    if (!version) {
      throw new BadRequestException(
        'No published version found for this app.',
      );
    }

    return version;
  }

  async installLatest(
    dto: InstallAppDto,
    userId?: number,
  ) {
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

    if (app.appType?.code !== dto.install_type) {
      throw new BadRequestException(
        `This app is ${app.appType?.code}, but install_type is ${dto.install_type}.`,
      );
    }

    const latestVersion =
      await this.getLatestPublishedVersion(dto.app_id);

    const scope = this.getScope(dto);

    const existing =
      await this.db.query.appInstallations.findFirst({
        where: and(
          eq(appInstallations.app_id, dto.app_id),
          eq(
            appInstallations.install_type,
            dto.install_type,
          ),
          eq(
            appInstallations.scope_type,
            scope.scope_type,
          ),
          eq(
            appInstallations.scope_id,
            scope.scope_id,
          ),
          eq(appInstallations.is_active, true),
        ),
      });

    if (existing) {
      const [updated] =
        await this.db
          .update(appInstallations)
          .set({
            version_id: latestVersion.id,
            company_id: dto.company_id ?? null,
            project_id: dto.project_id ?? null,
            updated_by: userId ?? null,
            updated_at: new Date(),
          })
          .where(
            eq(appInstallations.id, existing.id),
          )
          .returning();

      return {
        ...updated,
        app,
        installed_version: latestVersion,
        update_available: false,
      };
    }

    const [created] =
      await this.db
        .insert(appInstallations)
        .values({
          app_id: dto.app_id,
          version_id: latestVersion.id,
          install_type: dto.install_type,
          scope_type: scope.scope_type,
          scope_id: scope.scope_id,
          company_id: dto.company_id ?? null,
          project_id: dto.project_id ?? null,
          is_active: true,
          installed_by: userId ?? null,
          updated_by: userId ?? null,
        })
        .returning();

    return {
      ...created,
      app,
      installed_version: latestVersion,
      update_available: false,
    };
  }

  async getInstalledVersion(
    appId: number,
    installType: 'master' | 'standard',
    companyId?: number,
    projectId?: number,
  ) {
    const scope = this.getScope({
      app_id: appId,
      install_type: installType,
      company_id: companyId,
      project_id: projectId,
    });

    const installation =
      await this.db.query.appInstallations.findFirst({
        where: and(
          eq(appInstallations.app_id, appId),
          eq(
            appInstallations.install_type,
            installType,
          ),
          eq(
            appInstallations.scope_type,
            scope.scope_type,
          ),
          eq(
            appInstallations.scope_id,
            scope.scope_id,
          ),
          eq(appInstallations.is_active, true),
        ),
      });

    if (!installation) {
      throw new BadRequestException(
        'App is not installed. Please install the app first.',
      );
    }

    const version =
      await this.db.query.appVersions.findFirst({
        where: eq(
          appVersions.id,
          installation.version_id,
        ),
      });

    if (!version) {
      throw new NotFoundException(
        'Installed version not found.',
      );
    }

    return {
      installation,
      version,
    };
  }
}