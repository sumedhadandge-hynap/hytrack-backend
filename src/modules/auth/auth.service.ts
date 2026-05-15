import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';

import { Company } from './entities/company.entity';

import { Role } from './entities/role.entity';

import { SetupDto } from './dto/setup.dto';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    private readonly jwtService: JwtService,
  ) { }

  // =========================================
  // SETUP METHOD
  // =========================================

  async setup(dto: SetupDto) {

    // CHECK USER EXISTS

    const existingUser =
      await this.userRepo.findOne({
        where: {
          email: dto.email,
        },
      });

    if (existingUser) {

      throw new BadRequestException(
        'User already exists',
      );
    }

    // CREATE COMPANY SLUG

    const slug =
      dto.company_name
        .toLowerCase()
        .replace(/\s+/g, '-');

    // CHECK COMPANY EXISTS

    const existingCompany =
      await this.companyRepo.findOne({
        where: {
          slug,
        },
      });

    if (existingCompany) {

      throw new BadRequestException(
        'Company already exists',
      );
    }

    // CREATE COMPANY

    const company =
      await this.companyRepo.save({
        name: dto.company_name,
        slug,
        email: dto.email,
        phone: dto.phone,
        status: 'active',
      });

    // HASH PASSWORD

    const password_hash =
      await bcrypt.hash(
        dto.password,
        10,
      );

    // CREATE USER

    const user =
      await this.userRepo.save({
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        password_hash,
        company,
        is_super_admin: true,
        status: 'active',
      });

    // CREATE DEFAULT ROLES

    const defaultRoles = [
      'Super Admin',
      'Admin',
      'Project Manager',
      'User',
    ];

    for (const roleName of defaultRoles) {

      const roleExists =
        await this.roleRepo.findOne({
          where: {
            name: roleName,
          },
        });

      if (!roleExists) {

        await this.roleRepo.save({
          name: roleName,
          description: `${roleName} role`,
        });
      }
    }

    // JWT PAYLOAD

    const payload = {
      id: user.id,
      email: user.email,
    };

    // ACCESS TOKEN

    const access_token =
      this.jwtService.sign(payload, {
        expiresIn: '1d',
      });

    // REFRESH TOKEN

    const refresh_token =
      this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

    // RESPONSE

    return {

      access_token,

      refresh_token,

      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        email: company.email,
      },

      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_super_admin:
          user.is_super_admin,
        status: user.status,
      },
    };
  }

  // =========================================
  // LOGIN METHOD
  // =========================================

  async login(dto: LoginDto) {

    // FIND USER

    const user =
      await this.userRepo.findOne({
        where: {
          email: dto.email,
        },
      });

    if (!user) {

      throw new BadRequestException(
        'Invalid email or password',
      );
    }

    // CHECK PASSWORD

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

    // JWT PAYLOAD

    const payload = {
      id: user.id,
      email: user.email,
    };

    // ACCESS TOKEN

    const access_token =
      this.jwtService.sign(payload, {
        expiresIn: '1d',
      });

    // REFRESH TOKEN

    const refresh_token =
      this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

    // RESPONSE

    return {

      access_token,

      refresh_token,

      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile,
        status: user.status,
        is_super_admin:
          user.is_super_admin,
      },
    };
  }
}