import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { SidebarModule } from './modules/sidebar/sidebar.module';
import { PublicModule } from './modules/public/public.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    LoggerModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    SidebarModule,
    PublicModule

  ],
})
export class AppModule { }




