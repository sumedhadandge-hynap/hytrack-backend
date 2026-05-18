import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

import type { DbType } from 'src/database/database.module';

import {
  companies,
  users,
  roles,
  userRoles,
} from 'src/database/schema';

import { SetupDto } from './dto/setup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,

    private readonly jwtService: JwtService,
  ) { }

  async setup(dto: SetupDto) {
    const existingUser =
      await this.db.query.users.findFirst({
        where: eq(users.email, dto.email),
      });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const slug = dto.company_name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');

    const existingCompany =
      await this.db.query.companies.findFirst({
        where: eq(companies.slug, slug),
      });

    if (existingCompany) {
      throw new BadRequestException('Company already exists');
    }

    const [company] = await this.db
      .insert(companies)
      .values({
        name: dto.company_name,
        slug,
        email: dto.email,
        phone: dto.phone,
        status: 'active',
      })
      .returning();

    const password_hash = await bcrypt.hash(
      dto.password,
      10,
    );

    const [user] = await this.db
      .insert(users)
      .values({
        company_id: company.id,
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        mobile: dto.phone,
        password_hash,
        status: 'active',
        is_active: true,
        is_super_admin: true,
      })
      .returning();

    const defaultRoles = [
      {
        name: 'Super Admin',
        description: 'Full system access',
      },
      {
        name: 'Admin',
        description: 'Company admin access',
      },
      {
        name: 'Project Manager',
        description: 'Project manager access',
      },
      {
        name: 'User',
        description: 'Normal user access',
      },
    ];

    let superAdminRoleId: number | null = null;

    for (const role of defaultRoles) {
      const existingRole =
        await this.db.query.roles.findFirst({
          where: eq(roles.name, role.name),
        });

      if (existingRole) {
        if (role.name === 'Super Admin') {
          superAdminRoleId = existingRole.id;
        }
        continue;
      }

      const [createdRole] = await this.db
        .insert(roles)
        .values({
          name: role.name,
          description: role.description,
        })
        .returning();

      if (role.name === 'Super Admin') {
        superAdminRoleId = createdRole.id;
      }
    }

    if (superAdminRoleId) {
      await this.db.insert(userRoles).values({
        user_id: user.id,
        role_id: superAdminRoleId,
        assigned_by: user.id,
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      company_id: company.id,
    };

    const access_token =
      this.jwtService.sign(payload, {
        expiresIn: '1d',
      });

    const refresh_token =
      this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

    return {
      access_token,
      refresh_token,
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        email: company.email,
        phone: company.phone,
      },
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.mobile,
        is_super_admin: user.is_super_admin,
        status: user.status,
      },
    };
  }

  async login(dto: LoginDto) {
    const user =
      await this.db.query.users.findFirst({
        where: eq(users.email, dto.email),
      });

    if (!user) {
      throw new BadRequestException(
        'Invalid email or password',
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        dto.password,
        user.password_hash,
      );

    if (!isPasswordValid) {
      throw new BadRequestException(
        'Invalid email or password',
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      company_id: user.company_id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1d',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.mobile,
        status: user.status,
        is_super_admin: user.is_super_admin,
      },
    };
  }
}