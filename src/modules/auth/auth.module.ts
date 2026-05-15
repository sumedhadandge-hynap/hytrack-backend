import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User } from '../users/entities/user.entity';
import { Company } from './entities/company.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([
      User,
      Company,
      Role,
    ]),

    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'HYTRACK_SECRET',

      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService],

  exports: [AuthService],
})
export class AuthModule { }