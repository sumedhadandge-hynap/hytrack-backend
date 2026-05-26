import * as bcrypt from 'bcrypt';

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
  users,
  roles,
  userRoles,
} from 'src/database/schema';

import { AssignRoleDto }
  from './dto/assign-role.dto';

import { CreateUserDto }
  from './dto/create-user.dto';

import { UpdateUserDto }
  from './dto/update-user.dto';


import { ChangePasswordDto }
  from './dto/change-password.dto';








@Injectable()
export class UsersService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) { }


  // GET ALL USERS
  async findAll() {

    const usersList =
      await this.db.query.users.findMany({

        columns: {
          password_hash: false,
        },

        with: {

          userRoles: {

            with: {
              role: true,
            },
          },
        },

        orderBy: (users, { desc }) => [
          desc(users.id),
        ],
      });

    return usersList.map((user: any) => {

      const {
        userRoles,
        ...userData
      } = user;

      return {

        ...userData,

        role:
          userRoles?.[0]?.role?.name ?? null,
      };
    });
  }

  // GET USER BY ID
  async findOne(id: number) {

    const user =
      await this.db.query.users.findFirst({

        where: eq(users.id, id),

        columns: {
          password_hash: false,
        },

        with: {
          userRoles: {
            with: {
              role: true,
            },
          },
        },
      });

    if (!user) {

      throw new NotFoundException(
        'User not found',
      );
    }

    return {

      id: user.id,

      uid: user.uid,

      company_id: user.company_id,

      first_name: user.first_name,

      last_name: user.last_name,

      email: user.email,

      mobile: user.mobile,

      status: user.status,

      is_active: user.is_active,

      profile_image_url: user.profile_image_url,

      role:
        user.userRoles?.[0]?.role?.name ?? null,
    };
  }


  // CREATE USER
  async create(
    dto: CreateUserDto,
    userId?: number,
  ) {

    try {

      // CHECK EMAIL

      const existingEmail =
        await this.db.query.users.findFirst({
          where: eq(users.email, dto.email),
        });

      if (existingEmail) {

        throw new BadRequestException(
          'User email already exists',
        );
      }

      // CHECK MOBILE

      const existingMobile =
        await this.db.query.users.findFirst({
          where: eq(users.mobile, dto.mobile),
        });

      if (existingMobile) {

        throw new BadRequestException(
          'Mobile number already exists',
        );
      }

      // HASH PASSWORD

      const hashedPassword =
        await bcrypt.hash(dto.password, 10);

      // CREATE USER

      const [user] =
        await this.db
          .insert(users)
          .values({

            first_name:
              dto.first_name,

            last_name:
              dto.last_name ?? null,

            email:
              dto.email,

            mobile:
              dto.mobile,

            password_hash:
              hashedPassword,

            company_id:
              Number(dto.company_id),

            is_active:
              dto.is_active ?? true,

            profile_image_url:
              dto.profile_image_url ?? null,

            created_by:
              userId ?? null,

            updated_by:
              userId ?? null,
          })
          .returning();

      return user;

    } catch (error: any) {

      console.log(
        'USER CREATE ERROR:',
        error,
      );

      throw new BadRequestException(
        error.message,
      );
    }
  }


  // UPDATE USER
  async update(
    id: number,
    dto: UpdateUserDto,
    userId?: number,
  ) {

    await this.findOne(id);

    // CHECK DUPLICATE EMAIL

    if (dto.email) {

      const existingEmail =
        await this.db.query.users.findFirst({

          where: eq(users.email, dto.email),
        });

      if (
        existingEmail &&
        existingEmail.id !== id
      ) {

        throw new BadRequestException(
          'Email already exists',
        );
      }
    }

    // CHECK DUPLICATE MOBILE

    if (dto.mobile) {

      const existingMobile =
        await this.db.query.users.findFirst({

          where: eq(users.mobile, dto.mobile),
        });

      if (
        existingMobile &&
        existingMobile.id !== id
      ) {

        throw new BadRequestException(
          'Mobile number already exists',
        );
      }
    }

    const updateData: any = {

      first_name:
        dto.first_name,

      last_name:
        dto.last_name,

      email:
        dto.email,

      mobile:
        dto.mobile,

      company_id:
        dto.company_id,

      is_active:
        dto.is_active,

      profile_image_url:
        dto.profile_image_url,

      updated_by:
        userId,

      updated_at:
        new Date(),
    };

    // UPDATE PASSWORD

    if (dto.password) {

      updateData.password_hash =
        await bcrypt.hash(
          dto.password,
          10,
        );
    }

    const [user] =
      await this.db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning();

    return user;
  }


  // DELETE USER
  async remove(id: number) {

    await this.findOne(id);

    await this.db
      .delete(users)
      .where(eq(users.id, id));

    return true;
  }


  // ASSIGN ROLE
  async assignRole(
    userId: number,
    dto: AssignRoleDto,
    assignedBy?: number,
  ) {

    const user =
      await this.db.query.users.findFirst({
        where: eq(users.id, userId),
      });

    if (!user) {

      throw new NotFoundException(
        'User not found',
      );
    }

    const role =
      await this.db.query.roles.findFirst({
        where: eq(roles.id, dto.role_id),
      });

    if (!role) {

      throw new NotFoundException(
        'Role not found',
      );
    }

    const existing =
      await this.db.query.userRoles.findFirst({

        where: and(
          eq(userRoles.user_id, userId),
          eq(userRoles.role_id, dto.role_id),
        ),
      });

    if (existing) {

      throw new BadRequestException(
        'Role already assigned to user',
      );
    }

    const [result] =
      await this.db
        .insert(userRoles)
        .values({

          user_id: userId,

          role_id: dto.role_id,

          assigned_by: assignedBy,
        })
        .returning();

    return result;
  }


  // GET USER ROLES
  async getUserRoles(userId: number) {

    await this.findOne(userId);

    return await this.db.query.userRoles.findMany({

      where: eq(
        userRoles.user_id,
        userId,
      ),
    });
  }



  // CHANGE PASSWORD
  async changePassword(

    id: number,

    dto: ChangePasswordDto,

    updatedBy?: number,
  ) {

    const user =
      await this.db.query.users.findFirst({

        where: eq(users.id, id),
      });

    if (!user) {

      throw new NotFoundException(
        'User not found',
      );
    }

    const isPasswordValid =
      await bcrypt.compare(

        dto.old_password,

        user.password_hash,
      );

    if (!isPasswordValid) {

      throw new BadRequestException(
        'Old password is incorrect',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        dto.new_password,
        10,
      );

    await this.db
      .update(users)
      .set({

        password_hash:
          hashedPassword,

        updated_by: updatedBy,

        updated_at: new Date(),
      })
      .where(eq(users.id, id));

    return true;
  }





}