import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { eq, desc } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import { appGroups } from 'src/database/schema/app-groups.schema';
import { apps } from 'src/database/schema/apps.schema';

import { CreateAppGroupDto } from './dto/create-app-group.dto';
import { UpdateAppGroupDto } from './dto/update-app-group.dto';

@Injectable()
export class AppGroupsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  // CREATE

  async create(
    dto: CreateAppGroupDto,
    userId?: number,
  ) {
    const duplicate =
      await this.db.query.appGroups.findFirst({
        where: eq(appGroups.code, dto.code),
      });

    if (duplicate) {
      throw new BadRequestException(
        'App group code already exists.',
      );
    }

    const [group] =
      await this.db
        .insert(appGroups)
        .values({
          name: dto.name.trim(),

          code: dto.code
            .trim()
            .toUpperCase(),

          description:
            dto.description ?? null,

          created_by: userId ?? null,

          updated_by: userId ?? null,
        })
        .returning();

    return group;
  }

  // GET ALL

  async findAll() {
    return await this.db.query.appGroups.findMany({
      orderBy: (table) => [
        desc(table.id),
      ],
    });
  }

  // GET ONE

  async findOne(id: number) {
    const group =
      await this.db.query.appGroups.findFirst({
        where: eq(appGroups.id, id),
      });

    if (!group) {
      throw new NotFoundException(
        'App group not found.',
      );
    }

    return group;
  }

  // UPDATE

  async update(
    id: number,
    dto: UpdateAppGroupDto,
    userId?: number,
  ) {
    await this.findOne(id);

    if (dto.code) {
      const duplicate =
        await this.db.query.appGroups.findFirst({
          where: eq(
            appGroups.code,
            dto.code.toUpperCase(),
          ),
        });

      if (
        duplicate &&
        duplicate.id !== id
      ) {
        throw new BadRequestException(
          'App group code already exists.',
        );
      }
    }

    const [group] =
      await this.db
        .update(appGroups)
        .set({
          ...dto,

          code:
            dto.code?.toUpperCase(),

          updated_by:
            userId ?? null,

          updated_at:
            new Date(),
        })
        .where(eq(appGroups.id, id))
        .returning();

    return group;
  }

  // DELETE

  async remove(id: number) {
    await this.findOne(id);

    const linkedApps =
      await this.db.query.apps.findMany({
        where: eq(
          apps.app_group_id,
          id,
        ),
      });

    if (linkedApps.length) {
      throw new BadRequestException(
        'This group is linked with apps. Remove them first.',
      );
    }

    await this.db
      .delete(appGroups)
      .where(eq(appGroups.id, id));

    return true;
  }

  // GET APPS OF GROUP

  async getApps(id: number) {
    await this.findOne(id);

    return await this.db.query.apps.findMany({
      where: eq(
        apps.app_group_id,
        id,
      ),

      with: {
        appType: true,
        versions: true,
      },

      orderBy: (table) => [
        desc(table.id),
      ],
    });
  }
}