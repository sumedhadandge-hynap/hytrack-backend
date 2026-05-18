import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    LoggerModule,
    AuthModule,
    PermissionsModule
  ],
})
export class AppModule { }




