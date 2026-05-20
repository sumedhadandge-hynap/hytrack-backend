import { BadRequestException, Inject, Injectable, NotFoundException, } from '@nestjs/common';

import { and, eq } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import { roles, rolePermissions, } from 'src/database/schema';

import { CreateRoleDto } from './dto/create-role.dto';

import { AssignPermissionDto } from './dto/assign-permission.dto';









@Injectable()
export class RolesService {

  constructor(

    @Inject('DB')
    private readonly db: DbType,
  ) { }

  // =====================================
  // CREATE ROLE
  // =====================================

  async create(
    dto: CreateRoleDto,
    userId?: number,
  ) {

    const existing =
      await this.db.query.roles.findFirst({
        where: eq(roles.name, dto.name),
      });

    if (existing) {

      throw new BadRequestException(
        'Role already exists',
      );
    }

    const [role] =
      await this.db
        .insert(roles)
        .values({
          name: dto.name,
          description: dto.description ?? null,
        })
        .returning();

    return role;
  }

  // =====================================
  // GET ALL ROLES
  // =====================================

  async findAll() {

    return await this.db.query.roles.findMany({
      orderBy: (roles, { desc }) => [
        desc(roles.id),
      ],
    });
  }

  // =====================================
  // ASSIGN PERMISSION
  // =====================================

  async assignPermission(
    roleId: number,
    dto: AssignPermissionDto,
    userId?: number,
  ) {

    const role =
      await this.db.query.roles.findFirst({
        where: eq(roles.id, roleId),
      });

    if (!role) {

      throw new NotFoundException(
        'Role not found',
      );
    }

    const existing =
      await this.db.query.rolePermissions.findFirst({

        where: and(
          eq(rolePermissions.role_id, roleId),
          eq(
            rolePermissions.permission_id,
            dto.permission_id,
          ),
        ),
      });

    // =====================================
    // UPDATE EXISTING PERMISSION
    // =====================================

    if (existing) {

      const [updated] =
        await this.db
          .update(rolePermissions)
          .set({

            can_view:
              dto.can_view ?? existing.can_view,

            can_create:
              dto.can_create ?? existing.can_create,

            can_update:
              dto.can_update ?? existing.can_update,

            can_delete:
              dto.can_delete ?? existing.can_delete,

            updated_by: userId,

            updated_at: new Date(),
          })
          .where(
            eq(rolePermissions.id, existing.id),
          )
          .returning();

      return updated;
    }

    // =====================================
    // CREATE NEW PERMISSION
    // =====================================

    const [result] =
      await this.db
        .insert(rolePermissions)
        .values({

          role_id: roleId,

          permission_id:
            dto.permission_id,

          can_view:
            dto.can_view ?? true,

          can_create:
            dto.can_create ?? false,

          can_update:
            dto.can_update ?? false,

          can_delete:
            dto.can_delete ?? false,

          created_by: userId,

          updated_by: userId,
        })
        .returning();

    return result;
  }

  // =====================================
  // GET ROLE PERMISSIONS
  // =====================================

  async getRolePermissions(
    roleId: number,
  ) {

    return await this.db.query
      .rolePermissions.findMany({

        where: eq(
          rolePermissions.role_id,
          roleId,
        ),
      });
  }



  // 
  async removePermission(
    roleId: number,
    permissionId: number,
  ) {

    const existing =
      await this.db.query.rolePermissions.findFirst({

        where: and(

          eq(rolePermissions.role_id, roleId),

          eq(
            rolePermissions.permission_id,
            permissionId,
          ),
        ),
      });

    if (!existing) {

      throw new NotFoundException(
        'Permission assignment not found',
      );
    }

    await this.db
      .delete(rolePermissions)
      .where(
        eq(rolePermissions.id, existing.id),
      );

    return true;
  }
}