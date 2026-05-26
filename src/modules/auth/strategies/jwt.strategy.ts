// import { Injectable, UnauthorizedException, } from '@nestjs/common';

// import { PassportStrategy } from '@nestjs/passport';

// import { ExtractJwt, Strategy, } from 'passport-jwt';

// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy
//   extends PassportStrategy(Strategy) {

//   constructor(
//     private readonly configService:
//       ConfigService,
//   ) {

//     super({

//       jwtFromRequest:
//         ExtractJwt.fromAuthHeaderAsBearerToken(),

//       ignoreExpiration: false,

//       secretOrKey:
//         configService.get<string>(
//           'JWT_SECRET',
//         ) || 'hytrack_secret',
//     });
//   }

//   async validate(payload: any) {

//     if (!payload) {

//       throw new UnauthorizedException(
//         'Invalid token',
//       );
//     }

//     return {

//       id: payload.id,

//       email: payload.email,
//     };
//   }
// }




import {
  Injectable,
  Inject,
} from '@nestjs/common';

import {
  PassportStrategy,
} from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { ConfigService }
from '@nestjs/config';

import { eq }
from 'drizzle-orm';

import type { DbType }
from 'src/database/database.module';

import {
  users,
  rolePermissions,
} from 'src/database/schema';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
{
  constructor(
    configService: ConfigService,

    @Inject('DB')
    private readonly db: DbType,
  ) {

    super({

      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        configService.get<string>(
          'JWT_SECRET',
        ) || 'secret',
    });
  }

  async validate(payload: any) {

    const user =
      await this.db.query.users.findFirst({

        where: eq(
          users.id,
          payload.id,
        ),
      });

    if (!user) {
      return null;
    }

    const rolePermissionList =
      await this.db.query.rolePermissions.findMany({

        where: eq(
          rolePermissions.role_id,
          payload.role_id,
        ),

        with: {
          permission: true,
        },
      });

    const permissionCodes =
      rolePermissionList
        .filter(
          (item) => item.permission,
        )
        .map(
          (item) =>
            item.permission!.code,
        );

    return {

      id: user.id,

      email: user.email,

      role_id:
        payload.role_id,

      permissions:
        permissionCodes,
    };
  }
}