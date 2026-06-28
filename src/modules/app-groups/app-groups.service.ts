import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  and,
  eq,
  inArray,
  max,
} from 'drizzle-orm';


import {
  appGroups,
  appGroupApps,
  apps,
  appVersions,
} from '../../database/schema';

import { CreateAppGroupDto } from './dto/create-app-group.dto';
import { AddAppsToGroupDto } from './dto/add-apps-to-group.dto';
import type { DbType } from 'src/database/database.module';

@Injectable()
export class AppGroupsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async create(
    dto: CreateAppGroupDto,
    userId?: number,
  ) {
    const existing =
      await this.db.query.appGroups.findFirst({
        where: eq(appGroups.code, dto.code),
      });

    if (existing) {
      throw new BadRequestException(
        'App group code already exists',
      );
    }

    const [result] =
      await this.db
        .insert(appGroups)
        .values({
          name: dto.name,
          code: dto.code,
          description: dto.description ?? null,
          icon_url: dto.iconUrl ?? null,
          sort_order: dto.sortOrder ?? 0,
          is_active: dto.isActive ?? true,
          created_by: userId,
          updated_by: userId,
        })
        .returning();

    return result;
  }

  async findAll() {
    return await this.db.query.appGroups.findMany({
      orderBy: (appGroups, { desc }) => [
        desc(appGroups.id),
      ],
    });
  }

  async findOne(id: number) {
    const group =
      await this.db.query.appGroups.findFirst({
        where: eq(appGroups.id, id),
      });

    if (!group) {
      throw new NotFoundException(
        'App group not found',
      );
    }

    return group;
  }

  async addAppsToGroup(
    groupId: number,
    dto: AddAppsToGroupDto,
    userId?: number,
  ) {
    const group =
      await this.db.query.appGroups.findFirst({
        where: eq(appGroups.id, groupId),
      });

    if (!group) {
      throw new NotFoundException(
        'App group not found',
      );
    }

    if (!dto.apps.length) {
      throw new BadRequestException(
        'Please select at least one app',
      );
    }

    const appIds = dto.apps.map((item) => item.appId);

    const foundApps =
      await this.db.query.apps.findMany({
        where: inArray(apps.id, appIds),
      });

    if (foundApps.length !== appIds.length) {
      throw new BadRequestException(
        'One or more apps are invalid',
      );
    }

    const values = dto.apps.map((item) => ({
      app_group_id: groupId,
      app_id: item.appId,
      sort_order: item.sortOrder ?? 0,
      is_active: true,
      created_by: userId,
      updated_by: userId,
    }));

    const result =
      await this.db
        .insert(appGroupApps)
        .values(values)
        .onConflictDoNothing()
        .returning();

    return result;
  }

async getGroupApps(groupId: number) {
  const group = await this.findOne(groupId);

  const latestVersions = this.db
    .select({
      appId: appVersions.app_id,
      versionNumber: max(appVersions.version_number).as(
        'versionNumber',
      ),
    })
    .from(appVersions)
    .groupBy(appVersions.app_id)
    .as('latest_versions');

  const groupApps =
    await this.db
      .select({
        id: appGroupApps.id,
        uid: appGroupApps.uid,
        appGroupId: appGroupApps.app_group_id,
        appId: appGroupApps.app_id,
        sortOrder: appGroupApps.sort_order,
        isActive: appGroupApps.is_active,

        appName: apps.name,
        appCode: apps.code,
        appDescription: apps.description,
        appIconUrl: apps.icon_url,

        appVersionId: appVersions.id,
        appVersionName: appVersions.version_name,
        appVersionNumber: appVersions.version_number,
      })
      .from(appGroupApps)
      .innerJoin(
        apps,
        eq(appGroupApps.app_id, apps.id),
      )
      .leftJoin(
        latestVersions,
        eq(latestVersions.appId, apps.id),
      )
      .leftJoin(
        appVersions,
        and(
          eq(appVersions.app_id, apps.id),
          eq(
            appVersions.version_number,
            latestVersions.versionNumber,
          ),
        ),
      )
      .where(
        and(
          eq(appGroupApps.app_group_id, groupId),
          eq(appGroupApps.is_active, true),
        ),
      );

  return {
    ...group,
    apps: groupApps,
  };
}

  async removeAppFromGroup(
    groupId: number,
    appId: number,
  ) {
    const existing =
      await this.db.query.appGroupApps.findFirst({
        where: and(
          eq(appGroupApps.app_group_id, groupId),
          eq(appGroupApps.app_id, appId),
        ),
      });

    if (!existing) {
      throw new NotFoundException(
        'App not found in this group',
      );
    }

    const [result] =
      await this.db
        .delete(appGroupApps)
        .where(
          and(
            eq(appGroupApps.app_group_id, groupId),
            eq(appGroupApps.app_id, appId),
          ),
        )
        .returning();

    return result;
  }
}