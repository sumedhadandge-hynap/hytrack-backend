import {BadRequestException,Inject, Injectable,NotFoundException,} from '@nestjs/common';

import {and,eq,inArray,} from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import {  menus,  permissions,  rolePermissions,  userRoles,  users,  companies,} from 'src/database/schema';

import { CreateMenuDto } from './dto/create-menu.dto';

@Injectable()
export class SidebarService {
    constructor(
        @Inject('DB')
        private readonly db: DbType,
    ) { }

    async createMenu(dto: CreateMenuDto, userId?: number) {
        const existing = await this.db.query.menus.findFirst({
            where: eq(menus.route, dto.route),
        });

        if (existing) {
            throw new BadRequestException('Menu route already exists');
        }

        const [menu] = await this.db
            .insert(menus)
            .values({
                name: dto.name,
                route: dto.route,
                icon: dto.icon ?? null,
                parent_id: dto.parent_id ?? null,
                order_index: dto.order_index ?? 0,
                is_visible: dto.is_visible ?? true,
                permission_code: dto.permission_code ?? null,
                created_by: userId,
                updated_by: userId,
            })
            .returning();

        return menu;
    }

    async getAllMenus() {
        return await this.db.query.menus.findMany({
            orderBy: (menus, { asc }) => [
                asc(menus.order_index),
            ],
        });
    }

async getMyMenus(userId: number) {
  const user =
    await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        company_id: true,
      },
    });

  if (!user) {
    return {
      company: null,
      menus: [],
    };
  }

  const company =
    await this.db.query.companies.findFirst({
      where: eq(companies.id, user.company_id),
      columns: {
        id: true,
        name: true,
        logo_url: true,
      },
    });

  const assignedRoles =
    await this.db.query.userRoles.findMany({
      where: eq(userRoles.user_id, userId),
    });

  const roleIds = assignedRoles
    .map((item) => item.role_id)
    .filter((id): id is number => id !== null);

  if (roleIds.length === 0) {
    return {
      company,
      menus: [],
    };
  }

  const assignedPermissions =
    await this.db.query.rolePermissions.findMany({
      where: and(
        inArray(rolePermissions.role_id, roleIds),
        eq(rolePermissions.can_view, true),
      ),
    });

  const permissionIds = assignedPermissions
    .map((item) => item.permission_id)
    .filter((id): id is number => id !== null);

  if (permissionIds.length === 0) {
    return {
      company,
      menus: [],
    };
  }

  const permissionRows =
    await this.db.query.permissions.findMany({
      where: inArray(permissions.id, permissionIds),
    });

  const permissionCodes = permissionRows
    .map((item) => item.code)
    .filter((code): code is string => code !== null);

  if (permissionCodes.length === 0) {
    return {
      company,
      menus: [],
    };
  }

  const userMenus =
    await this.db.query.menus.findMany({
      where: and(
        eq(menus.is_visible, true),
        inArray(menus.permission_code, permissionCodes),
      ),
      orderBy: (menus, { asc }) => [
        asc(menus.order_index),
      ],
    });

  return {
    company,
    menus: userMenus,
  };
}

    async getMenuById(id: number) {

        const menu =
            await this.db.query.menus.findFirst({
                where: eq(menus.id, id),
            });

        if (!menu) {

            throw new NotFoundException(
                'Menu not found',
            );
        }

        return menu;
    }


    async updateMenu(
        id: number,
        dto: CreateMenuDto,
        userId?: number,
    ) {

        await this.getMenuById(id);

        const [menu] =
            await this.db
                .update(menus)
                .set({

                    name: dto.name,

                    route: dto.route,

                    icon: dto.icon ?? null,

                    parent_id:
                        dto.parent_id ?? null,

                    order_index:
                        dto.order_index ?? 0,

                    is_visible:
                        dto.is_visible ?? true,

                    permission_code:
                        dto.permission_code ?? null,

                    updated_by: userId,

                    updated_at: new Date(),
                })
                .where(eq(menus.id, id))
                .returning();

        return menu;
    }


    async deleteMenu(id: number) {

        await this.getMenuById(id);

        await this.db
            .delete(menus)
            .where(eq(menus.id, id));

        return true;
    }


}